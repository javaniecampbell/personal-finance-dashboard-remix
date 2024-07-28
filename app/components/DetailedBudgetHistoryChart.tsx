import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatPercentage } from '~/utils/formatters';

const DetailedBudgetHistoryChart = ({ budgetHistory }) => {
  const data = budgetHistory.history.map(h => ({
    date: h.date,
    'Budgeted Amount': h.budgetedAmount,
    'Actual Amount': h.actualAmount,
    'Performance': h.performance,
    'Spent Percentage': h.spentPercentage,
  }));

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">{budgetHistory.name} - Detailed Historical Performance</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'Performance' || name === 'Spent Percentage') return formatPercentage(value / 100);
              return formatCurrency(value);
            }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="Budgeted Amount" stroke="#8884d8" />
          <Line yAxisId="left" type="monotone" dataKey="Actual Amount" stroke="#82ca9d" />
          <Line yAxisId="right" type="monotone" dataKey="Performance" stroke="#ff7300" />
          <Line yAxisId="right" type="monotone" dataKey="Spent Percentage" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetailedBudgetHistoryChart;
