const express = require('express');
const router = express.Router();
const { evaluateTrade, getAllTrades } = require('../controllers/tradeController');

// POST to evaluate trade
router.post('/evaluate', evaluateTrade);

// GET all trades
router.get('/history', getAllTrades);

module.exports = router;
