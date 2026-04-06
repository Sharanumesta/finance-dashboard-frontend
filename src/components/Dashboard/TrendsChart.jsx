import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const TrendsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              name="Income"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              name="Expenses"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#3B82F6"
              name="Net"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsChart;