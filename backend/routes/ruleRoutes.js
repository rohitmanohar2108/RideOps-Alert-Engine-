const express = require('express');
const router = express.Router();
const controller = require('../controllers/ruleController');

router.post('/', controller.createRule);
router.get('/', controller.getRules);
router.put('/:id', controller.updateRule);
router.delete('/:id', controller.deleteRule);

module.exports = router;
