import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatPercentage } from '~/utils/formatters';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const IncomeVsExpensesChart: React.FC<{ data: Array<{ date: string; income: number; expenses: number }> }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip formatter={(value) => formatCurrency(value as number)} />
      <Legend />
      <Line type="monotone" dataKey="income" stroke="#8884d8" />
      <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

export const SpendingByCategoryChart: React.FC<{ data: Array<{ category: string; amount: number }> }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="amount"
        label={({ name, percent }) => `${name} ${formatPercentage(percent)}`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => formatCurrency(value as number)} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export const SavingsTrendChart: React.FC<{ data: Array<{ date: string; savings: number }> }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip formatter={(value) => formatCurrency(value as number)} />
      <Legend />
      <Line type="monotone" dataKey="savings" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

export const FinancialHealthIndicators: React.FC<{
  savingsRate: number;
  debtToIncomeRatio: number;
  netWorth: number;
}> = ({ savingsRate, debtToIncomeRatio, netWorth }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Savings Rate</h3>
      <p className="text-2xl font-bold">{formatPercentage(savingsRate)}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Debt-to-Income Ratio</h3>
      <p className="text-2xl font-bold">{debtToIncomeRatio.toFixed(2)}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Net Worth</h3>
      <p className="text-2xl font-bold">{formatCurrency(netWorth)}</p>
    </div>
  </div>
);
