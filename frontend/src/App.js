import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TradeHistory from './components/TradeHistory';  // Import the TradeHistory component

export default function SmartTradeEvaluator() {
  const [formData, setFormData] = useState({
    product_name: '',
    quantity: '',
    source_currency: 'USD', 
    destination_currency: 'USD',
    cost_price: '',
    selling_price: '',
    trade_type: 'Import',
  });

  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/currencies/list?source_currency=${formData.source_currency}`);
        setCurrencies(res.data);
      } catch (err) {
        console.error('Error fetching currencies:', err);
      }
    };

    fetchCurrencies();
  }, [formData.source_currency]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/trade/evaluate', formData);
      setResult(res.data);
    } catch (err) {
      alert('Error evaluating trade');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Smart Trade Evaluator</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {['product_name', 'quantity', 'cost_price', 'selling_price'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.replace('_', ' ')}
            className="border p-2 rounded"
            value={formData[field]}
            onChange={handleChange}
            required
          />
        ))}

        <select name="source_currency" value={formData.source_currency} onChange={handleChange} className="border p-2 rounded">
          {currencies.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>

        <select name="destination_currency" value={formData.destination_currency} onChange={handleChange} className="border p-2 rounded">
          {currencies.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>

        <select name="trade_type" value={formData.trade_type} onChange={handleChange} className="col-span-2 border p-2 rounded">
          <option value="Import">Import</option>
          <option value="Export">Export</option>
        </select>

        <button type="submit" className="col-span-2 bg-blue-500 text-white py-2 rounded">Evaluate Trade</button>
      </form>
      
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Trade Evaluation</h2>
          <ul className="list-disc list-inside">
            {Object.entries(result).map(([key, val]) => (
              <li key={key}><strong>{key.replace('_', ' ')}:</strong> {val}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Render the TradeHistory component here */}
      <TradeHistory />
    </div>
  );
}
