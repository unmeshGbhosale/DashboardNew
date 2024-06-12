const express = require('express');
const router = express.Router();
const { initializeDatabase, listTransactions, getStatistics, getBarChartData, getPieChartData, getCombinedData } = require('../controllers/transactionsController');

router.get('/initialize', initializeDatabase);
router.get('/list', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);
router.get('/combined-data', getCombinedData);
module.exports = router;
