const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  condition: { type: String, required: true }, // e.g. "priority==='high'"
  action: { type: String, required: true }, // e.g. "status='escalated'"
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rule', ruleSchema);
