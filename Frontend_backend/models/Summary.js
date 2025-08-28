const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  raw_analysis: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  source: { type: String, default: 'voice-assistant-app' }
});

module.exports = mongoose.model('Summary', summarySchema);