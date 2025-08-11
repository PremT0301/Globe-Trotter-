const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const cityRoutes = require('./routes/cities');
const activityRoutes = require('./routes/activities');
const itineraryRoutes = require('./routes/itinerary');
const budgetRoutes = require('./routes/budgets');
const expenseRoutes = require('./routes/expenses');
const sharedRoutes = require('./routes/shared');
const pdfRoutes = require('./routes/pdf');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const photoRoutes = require('./routes/photos');
const { connectToDatabase } = require('./lib/mongoose');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await connectToDatabase(process.env.MONGODB_URI);
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/shared', sharedRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/photos', photoRoutes);

const PORT = process.env.PORT || 4000;

connectToDatabase(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });


