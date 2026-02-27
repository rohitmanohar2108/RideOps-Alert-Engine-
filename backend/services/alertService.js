const Alert = require('../models/Alert');

/**
 * Example rule engine placeholder. In a real system rules might
 * be stored in DB or config and evaluated at runtime.
 */

exports.applyRules = async (alert) => {
  // simple escalation rule: high priority alerts escalate after creation
  if (alert.priority === 'high' && alert.status === 'new') {
    alert.status = 'escalated';
  }
  return alert;
};

exports.createAlertWithRules = async (data) => {
  let alert = new Alert(data);
  alert = await exports.applyRules(alert);
  return alert.save();
};
