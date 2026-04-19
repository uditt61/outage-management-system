const mongoose = require('mongoose');

const outageSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  type: String,
  status: { type: String, default: 'pending' },
  priority: { type: String, default: 'medium' },
  reportedBy: String,
  reportedByName: String,
  assignedTo: String,
  assignedToName: String,
  resolutionNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Outage', outageSchema);