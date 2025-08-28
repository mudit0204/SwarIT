const Summary = require('../models/Summary');

exports.createSummary = async (req, res) => {
  try {
    const { raw_analysis, source } = req.body;
    if (!raw_analysis) {
      return res.status(400).json({ error: 'raw_analysis is required' });
    }
    console.log('raw_analysis:', raw_analysis);
    const summary = new Summary({ raw_analysis, source });
    await summary.save();
    res.status(201).json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    res.json({ success: true, summaries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};