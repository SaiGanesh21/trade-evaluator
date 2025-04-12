import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const TradeHistory = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trade/history');
      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching trade history: ", err);
    }
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(history.map(entry => ({
      sourceCurrency: entry.source_currency,
      targetCurrency: entry.destination_currency,
      costPrice: entry.cost_price,
      sellingPrice: entry.selling_price,
      discount: entry.discount,
      convertedCostPrice: entry.converted_cost,
      convertedSellingPrice: (entry.selling_price * entry.quantity).toFixed(2),
      margin: entry.margin_percent?.toFixed(2),
      profitOrLoss: entry.profit,
      tag: entry.profit_tag
    })));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trade_history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Trade History</h2>
      <button
        onClick={downloadCSV}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download CSV
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Source Currency</th>
              <th className="px-4 py-2">Target Currency</th>
              <th className="px-4 py-2">Cost Price</th>
              <th className="px-4 py-2">Selling Price</th>
              <th className="px-4 py-2">Discount %</th>
              <th className="px-4 py-2">Converted Cost</th>
              <th className="px-4 py-2">Converted Selling</th>
              <th className="px-4 py-2">Margin (%)</th>
              <th className="px-4 py-2">Profit</th>
              <th className="px-4 py-2">Tag</th>
            </tr>
          </thead>
          <tbody>
            {history.map((trade, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{trade.source_currency}</td>
                <td className="px-4 py-2">{trade.destination_currency}</td>
                <td className="px-4 py-2">{trade.cost_price}</td>
                <td className="px-4 py-2">{trade.selling_price}</td>
                <td className="px-4 py-2">{trade.discount}%</td>
                <td className="px-4 py-2">{trade.converted_cost.toFixed(2)}</td>
                <td className="px-4 py-2">{(trade.selling_price * trade.quantity).toFixed(2)}</td>
                <td className="px-4 py-2">{trade.margin_percent.toFixed(2)}</td>
                <td className="px-4 py-2">{trade.profit.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded text-white bg-green-500">
                    {trade.profit_tag}
                  </span>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">No trades found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory;
