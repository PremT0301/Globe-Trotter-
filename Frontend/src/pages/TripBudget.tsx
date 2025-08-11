import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Plus, Edit3, Trash2, PieChart as LucidePieChart, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../lib/api';

const TripBudget: React.FC = () => {
  const { tripId } = useParams();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0
  });
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    category: 'accommodation',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const { showToast } = useToast();

  const categories = [
    { id: 'accommodation', name: 'Accommodation', icon: '🏨', color: '#3B82F6' },
    { id: 'flights', name: 'Flights', icon: '✈️', color: '#10B981' },
    { id: 'Food&Dining', name: 'Food & Dining', icon: '🍽️', color: '#F59E0B' },
    { id: 'activities', name: 'Activities', icon: '🎯', color: '#8B5CF6' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#EF4444' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#06B6D4' }
  ];

  // Fetch expenses and budget data
  useEffect(() => {
    const fetchData = async () => {
      if (!tripId) return;
      
      try {
        setLoading(true);
        const [expensesData, budgetSummary] = await Promise.all([
          api.get(`/api/expenses/${tripId}`) as Promise<any[]>,
          api.get(`/api/expenses/${tripId}/summary`) as Promise<any>
        ]);
        
        setExpenses(expensesData);
        setBudgetData({
          totalBudget: budgetSummary.totalBudget,
          totalSpent: budgetSummary.totalSpent,
          remaining: budgetSummary.remaining
        });
      } catch (error) {
        console.error('Error fetching budget data:', error);
        showToast('error', 'Error', 'Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, showToast]);

  // Calculate spending by category
  const spendingByCategory = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category.id);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category.name,
      value: total,
      color: category.color,
      icon: category.icon
    };
  }).filter(item => item.value > 0);

  // Daily spending data
  const dailySpending = expenses.reduce((acc: any[], expense) => {
    const date = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find((item: any) => item.date === date);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({ date, amount: expense.amount });
    }
    return acc;
  }, [] as any[]).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tripId) return;
    
    try {
      const response = await api.post(`/api/expenses/${tripId}`, {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      
      setExpenses(prev => [response, ...prev]);
      
      // Update budget summary
      const budgetSummary = await api.get(`/api/expenses/${tripId}/summary`) as any;
      setBudgetData({
        totalBudget: budgetSummary.totalBudget,
        totalSpent: budgetSummary.totalSpent,
        remaining: budgetSummary.remaining
      });
      
      showToast('success', 'Expense added!', 'Your expense has been added to the budget.');
      setShowAddExpense(false);
      setNewExpense({
        category: 'accommodation',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      showToast('error', 'Error', 'Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await api.delete(`/api/expenses/${expenseId}`);
      setExpenses(prev => prev.filter(expense => expense._id !== expenseId));
      
      // Update budget summary
      const budgetSummary = await api.get(`/api/expenses/${tripId}/summary`) as any;
      setBudgetData({
        totalBudget: budgetSummary.totalBudget,
        totalSpent: budgetSummary.totalSpent,
        remaining: budgetSummary.remaining
      });
      
      showToast('success', 'Expense deleted!', 'Expense has been removed from the budget.');
    } catch (error) {
      console.error('Error deleting expense:', error);
      showToast('error', 'Error', 'Failed to delete expense');
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const budgetProgress = budgetData.totalBudget > 0 ? (budgetData.totalSpent / budgetData.totalBudget) * 100 : 0;
  const isOverBudget = budgetData.totalSpent > budgetData.totalBudget;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Budget</h1>
            <p className="text-gray-600">Track and manage your travel expenses</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddExpense(true)}
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </motion.button>
        </motion.div>

        {/* Budget Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Budget</h3>
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{budgetData.totalBudget.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
              <TrendingUp className={`h-6 w-6 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`} />
            </div>
            <p className={`text-3xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
              ₹{budgetData.totalSpent.toLocaleString()}
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isOverBudget ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{budgetProgress.toFixed(1)}% of budget used</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Remaining</h3>
              <TrendingDown className={`h-6 w-6 ${budgetData.remaining < 0 ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <p className={`text-3xl font-bold ${budgetData.remaining < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              ₹{Math.abs(budgetData.remaining).toLocaleString()}
              {budgetData.remaining < 0 && ' over'}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Spending by Category Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Spending by Category</h2>
              <LucidePieChart className="h-6 w-6 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {spendingByCategory.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-600">{category.icon} {category.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Daily Spending Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Daily Spending</h2>
              <BarChart3 className="h-6 w-6 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Expenses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Expenses</h2>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <DollarSign className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
              <p className="text-gray-600">Start tracking your trip expenses</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => {
                const categoryInfo = getCategoryInfo(expense.category);
                return (
                  <motion.div
                    key={expense._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: `${categoryInfo.color}20` }}>
                        {categoryInfo.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{expense.description}</h3>
                        <p className="text-sm text-gray-600">{categoryInfo.name} • {new Date(expense.date).toLocaleDateString()}</p>
                        {expense.location && (
                          <p className="text-sm text-gray-500">{expense.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900">₹{expense.amount}</span>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-red-600 transition-colors duration-200">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Expense</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What did you spend on?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripBudget;