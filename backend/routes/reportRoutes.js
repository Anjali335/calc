const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/calculate', reportController.calculate);
router.post('/', reportController.saveReport);
router.get('/', reportController.getReports);
router.get('/client/:clientName', reportController.getReportsByClient);
router.get('/export', reportController.exportData);
router.get('/:id', reportController.getReport);
router.delete('/:id', reportController.deleteReport);
router.delete('/', reportController.clearData);

module.exports = router;
