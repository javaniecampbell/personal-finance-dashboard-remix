import React from 'react';
import { formatCurrency } from '~/utils/formatters';

type Budget = {
  id: string;
  name: string;
  amount: number;
  category: string;
  period: 'weekly' | 'monthly' | 'yearly';
};

type BudgetPerformance = {
  id: string;
  name: string;
  category: string;
  budgetedAmount: number;
  actualAmount: number;
};

export const BudgetList: React.FC<{ budgets: Budget[], onEdit: (budget: Budget) => void, onDelete: (id: string) => void }> = ({ budgets, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((budget) => (
        <div key={budget.id} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">{budget.name}</h3>
          <p className="text-gray-600 mb-1">Category: {budget.category}</p>
          <p className="text-2xl font-bold mb-4">{formatCurrency(budget.amount)} / {budget.period}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(budget)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(budget.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const BudgetPerformanceChart: React.FC<{ performance: BudgetPerformance[] }> = ({ performance }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Budget Performance</h3>
      {performance.map((item) => (
        <div key={item.id} className="mb-4">
          <div className="flex justify-between mb-1">
            <span>{item.name}</span>
            <span>{formatCurrency(item.actualAmount)} / {formatCurrency(item.budgetedAmount)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${item.actualAmount > item.budgetedAmount ? 'bg-red-600' : 'bg-green-600'}`}
              style={{ width: `${Math.min((item.actualAmount / item.budgetedAmount) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
