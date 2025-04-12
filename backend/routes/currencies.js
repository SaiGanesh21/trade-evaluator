const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/list', async (req, res) => {
  try {
    const { source_currency = 'USD' } = req.query;
    const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/de4ae1cdabf8ba55e28a0e96/latest/${source_currency}`);
    const currencyCodes = Object.keys(data.conversion_rates);
    res.json(currencyCodes);
  } catch (err) {
    console.error('Error fetching currency list:', err.message);
    res.status(500).json({ error: 'Failed to fetch currencies' });
  }
});

module.exports = router;
