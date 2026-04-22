const mongoose = require('mongoose');

const outageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['electricity', 'internet', 'water'], required: true },
  status: { type: String, default: 'pending' },
  priority: { type: String, default: 'medium' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedByName: { type: String, required: true },
  
  // Enforcing Latitude and Longitude
  latitude: {
    type: Number,
    required: [true, 'Latitude is required to pinpoint the outage'],
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required to pinpoint the outage'],
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  },
  
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedToName: { type: String },
  resolutionNotes: { type: String }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Outage', outageSchema);