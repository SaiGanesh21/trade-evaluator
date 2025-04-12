const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const tradeRoutes = require('./routes/tradeRoutes');
const currencyRoutes = require('./routes/currencies');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/trade', tradeRoutes);
app.use('/api/currencies', currencyRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch((err) => console.log(err));
