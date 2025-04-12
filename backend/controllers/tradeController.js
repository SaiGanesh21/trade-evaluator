const axios = require('axios');
const Trade = require('../models/Trade');

// Utility to fetch conversion rate
const getConversionRate = async (fromCurrency, toCurrency) => {
  try {
    const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/de4ae1cdabf8ba55e28a0e96/latest/${fromCurrency}`);
    const rate = data.conversion_rates[toCurrency];
    if (!rate) throw new Error("Currency not supported or invalid");
    return rate;
  } catch (err) {
    console.error("Currency conversion error:", err.message);
    throw new Error("Currency conversion failed");
  }
};

// POST /api/trade/evaluate
const evaluateTrade = async (req, res) => {
  try {
    const {
      product_name,
      quantity,
      source_currency,
      destination_currency,
      cost_price,
      selling_price,
      trade_type,
    } = req.body;

    const amount = cost_price * quantity;

    const conversionRate = await getConversionRate(source_currency, destination_currency);
    const converted_cost = amount * conversionRate;

    let discount = 0;
    if (quantity > 1000) discount = 10;
    else if (quantity > 500) discount = 5;

    const discounted_cost = converted_cost - (converted_cost * discount) / 100;
    const revenue = selling_price * quantity;
    const profit = revenue - discounted_cost;
    const margin_percent = (profit / discounted_cost) * 100;

    let profit_tag = "❌ Loss";
    if (margin_percent > 0 && margin_percent <= 10) profit_tag = "⚠️ Low Margin";
    else if (margin_percent > 10 && margin_percent <= 30) profit_tag = "✅ Medium Margin";
    else if (margin_percent > 30) profit_tag = "💰 High Margin";

    const trade = new Trade({
      product_name,
      quantity,
      source_currency,
      destination_currency,
      cost_price,
      selling_price,
      converted_cost,
      discount,
      profit,
      margin_percent,
      profit_tag,
      trade_type,
    });

    await trade.save();
    res.status(201).json(trade);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

// GET /api/trade
const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find().sort({ trade_date: -1 });
    res.json(trades);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};

module.exports = { evaluateTrade, getAllTrades };
