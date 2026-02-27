const Alert = require('../models/Alert');
const alertService = require('../services/alertService');

exports.createAlert = async (req, res) => {
  try {
    const { type, message, priority } = req.body;
    if (!type || !message) {
      return res.status(400).json({ error: 'type and message are required' });
    }
    if (priority && !['low','medium','high'].includes(priority)) {
      return res.status(400).json({ error: 'invalid priority' });
    }
    const io = req.app.locals.io;
    const saved = await alertService.createAlertWithRules(req.body, io);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    // support basic query filtering
    const filter = {};
    if (req.query.type) filter.type = { $regex: req.query.type, $options: 'i' };
    if (req.query.priority) filter.priority = req.query.priority;

    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alert) return res.status(404).json({ error: 'Not found' });
    res.json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const result = await Alert.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
