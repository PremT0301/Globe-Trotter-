const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Budget = require('../models/Budget');
const PDFDocument = require('pdfkit');

const router = express.Router();

// Generate PDF for a trip
router.get('/:tripId', authenticateToken, async (req, res) => {
  try {
    const tripId = req.params.tripId;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Get itinerary data
    const itineraries = await Itinerary.find({ tripId })
      .populate('cityId', 'name country')
      .populate('activityId')
      .sort({ date: 1, orderIndex: 1 })
      .lean();
    
    // Get budget
    const budget = await Budget.findOne({ tripId }).lean();
    
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${trip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    generatePDFContent(doc, trip, itineraries, budget);
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

// Generate PDF for shared trip (no authentication required)
router.get('/shared/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    
    // Get shared trip
    const SharedTrip = require('../models/SharedTrip');
    const shared = await SharedTrip.findOne({ publicUrl: slug }).lean();
    
    if (!shared) {
      return res.status(404).json({ message: 'Shared trip not found' });
    }
    
    // Get trip data
    const trip = await Trip.findById(shared.tripId).lean();
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Get itinerary data
    const itineraries = await Itinerary.find({ tripId: shared.tripId })
      .populate('cityId', 'name country')
      .populate('activityId')
      .sort({ date: 1, orderIndex: 1 })
      .lean();
    
    // Get budget
    const budget = await Budget.findOne({ tripId: shared.tripId }).lean();
    
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${trip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    generatePDFContent(doc, trip, itineraries, budget);
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

// Helper function to generate PDF content
const generatePDFContent = (doc, trip, itineraries, budget) => {
  // Title
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .text(trip.title, { align: 'center' })
     .moveDown(0.5);
  
  // Subtitle
  doc.fontSize(16)
     .font('Helvetica')
     .text(trip.destination, { align: 'center' })
     .moveDown(1);
  
  // Trip details
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('Trip Details', { underline: true })
     .moveDown(0.5);
  
  const startDate = new Date(trip.startDate).toLocaleDateString();
  const endDate = new Date(trip.endDate).toLocaleDateString();
  const duration = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  
  doc.fontSize(10)
     .font('Helvetica')
     .text(`Duration: ${duration} days (${startDate} - ${endDate})`)
     .text(`Travelers: ${trip.travelers}`)
     .text(`Type: ${trip.tripType || 'General'}`)
     .moveDown(1);
  
  // Budget summary
  if (budget) {
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Budget Summary', { underline: true })
       .moveDown(0.5);
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Total Budget: ₹${budget.totalBudget || 0}`)
       .text(`Spent: ₹${budget.spentAmount || 0}`)
       .text(`Remaining: ₹${(budget.totalBudget || 0) - (budget.spentAmount || 0)}`)
       .moveDown(1);
  }
  
  // Itinerary
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('Itinerary', { underline: true })
     .moveDown(0.5);
  
  // Group activities by date
  const activitiesByDate = {};
  itineraries.forEach(item => {
    const date = new Date(item.date).toLocaleDateString();
    if (!activitiesByDate[date]) {
      activitiesByDate[date] = [];
    }
    
    let activityData;
    if (item.activityId) {
      activityData = {
        name: item.activityId.name,
        type: item.activityId.type,
        duration: item.activityId.duration,
        cost: item.activityId.cost,
        description: item.activityId.description,
        city: item.cityId?.name || 'Unknown',
        notes: item.notes
      };
    } else {
      // Handle legacy data
      try {
        const parsedData = JSON.parse(item.notes || '{}');
        activityData = {
          name: parsedData.title || 'Activity',
          type: parsedData.type || 'attraction',
          duration: parsedData.duration || '1 hour',
          cost: parsedData.cost || 0,
          description: parsedData.notes || '',
          city: parsedData.location || 'Unknown',
          notes: ''
        };
      } catch (error) {
        activityData = {
          name: 'Activity',
          type: 'attraction',
          duration: '1 hour',
          cost: 0,
          description: '',
          city: 'Unknown',
          notes: ''
        };
      }
    }
    
    activitiesByDate[date].push(activityData);
  });
  
  // Add each day's activities
  Object.keys(activitiesByDate).sort().forEach((date, dayIndex) => {
    const activities = activitiesByDate[date];
    
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .text(`Day ${dayIndex + 1} - ${date}`, { underline: true })
       .moveDown(0.3);
    
    activities.forEach((activity, index) => {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text(`${index + 1}. ${activity.name}`)
         .moveDown(0.2);
      
      doc.fontSize(9)
         .font('Helvetica')
         .text(`   Type: ${activity.type}`)
         .text(`   Duration: ${activity.duration} minutes`)
         .text(`   Location: ${activity.city}`)
         .text(`   Cost: ₹${activity.cost || 0}`);
      
      if (activity.description) {
        doc.text(`   Description: ${activity.description}`);
      }
      
      if (activity.notes) {
        doc.text(`   Notes: ${activity.notes}`);
      }
      
      doc.moveDown(0.3);
    });
    
    doc.moveDown(0.5);
  });
  
  // Footer
  doc.fontSize(8)
     .font('Helvetica')
     .text('Generated by Odoo Travel Planner', { align: 'center' })
     .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
};

module.exports = router;
