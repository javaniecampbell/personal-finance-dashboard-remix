import React, { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server.v2';
import { getFinancialMetrics } from '~/utils/analytics.server';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '~/utils/formatters';

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const metrics = await getFinancialMetrics(userId);
  return json({ metrics });
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="label">{`${label} : ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { metrics } = useLoaderData();
  const [timeRange, setTimeRange] = useState('1M');

  // Filter data based on selected time range
  const filterData = (data) => {
    const now = new Date();
    const ranges = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365
    };
    const daysAgo = ranges[timeRange];
    const cutoff = new Date(now.setDate(now.getDate() - daysAgo));
    return data?.filter(item => new Date(item.date) >= cutoff);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Financial Analytics</h1>

      <div className="mb-6">
        <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-2">Time Range:</label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="1M">Last Month</option>
          <option value="3M">Last 3 Months</option>
          <option value="6M">Last 6 Months</option>
          <option value="1Y">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filterData(metrics.incomeVsExpenses)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#8884d8" />
              <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.spendingByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {metrics.spendingByCategory?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Budget Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.budgetPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" />
              <Bar dataKey="actual" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Savings Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filterData(metrics.savingsTrend)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Financial Health Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-600">Debt-to-Income Ratio</p>
            <p className="text-2xl font-bold">{metrics.debtToIncomeRatio.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Savings Rate</p>
            <p className="text-2xl font-bold">{(metrics.savingsRate * 100).toFixed(2)}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Net Worth</p>
            <p className="text-2xl font-bold">{formatCurrency(metrics.netWorth)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
