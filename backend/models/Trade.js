const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  product_name: String,
  quantity: Number,
  source_currency: String,
  destination_currency: String,
  cost_price: Number,
  selling_price: Number,
  converted_cost: Number,
  discount: Number,
  profit: Number,
  margin_percent: Number,
  profit_tag: String,
  trade_type: String,
  trade_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trade', tradeSchema);
