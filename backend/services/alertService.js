const Alert = require('../models/Alert');
const Rule = require('../models/Rule');

/**
 * Evaluate configured rules stored in database.
 * This simplistic engine uses `eval` so it's only for demo purposes;
 * a production system would parse AST or use a safe sandbox.
 */
exports.applyRules = async (alert) => {
  const rules = await Rule.find({ active: true });
  rules.forEach(rule => {
    try {
      const conditionFunc = new Function('alert', `return ${rule.condition};`);
      if (conditionFunc(alert)) {
        const actionFunc = new Function('alert', rule.action);
        actionFunc(alert);
      }
    } catch (err) {
      console.error('Rule evaluation error', rule.name, err);
    }
  });
  return alert;
};

exports.createAlertWithRules = async (data, io) => {
  let alert = new Alert(data);
  alert = await exports.applyRules(alert);
  const saved = await alert.save();
  if (io) {
    io.emit('newAlert', saved);
  }
  return saved;
};
