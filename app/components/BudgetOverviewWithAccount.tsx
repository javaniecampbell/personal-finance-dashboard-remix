// app/components/BudgetOverview.tsx
import React from 'react';
import { Link } from '@remix-run/react';
import { formatCurrency } from '~/utils/formatters';

export function BudgetOverview({ budgets }) {
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgetedAmount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.actualAmount, 0);
  const overallPerformance = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Budget Overview</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Total Budgeted: {formatCurrency(totalBudgeted)}</p>
          <p>Total Spent: {formatCurrency(totalSpent)}</p>
          <p>Overall Performance: {overallPerformance.toFixed(2)}%</p>
        </div>
        <div className="mt-5">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${Math.min(overallPerformance, 100)}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h4 className="text-md font-medium text-gray-900">Budget Details</h4>
          <ul className="mt-3 divide-y divide-gray-200">
            {budgets.map((budget) => (
              <li key={budget.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{budget.name}</p>
                    <p className="text-sm text-gray-500">{budget.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(budget.actualAmount)} / {formatCurrency(budget.budgetedAmount)}
                    </p>
                    <p className="text-sm text-gray-500">{budget.performance.toFixed(2)}%</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                      <div
                        style={{ width: `${Math.min(budget.performance, 100)}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p>Associated Accounts: {budget.accounts.map(account => account.name).join(', ')}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5">
          <Link
            to="/budgets"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Manage Budgets
          </Link>
        </div>
      </div>
    </div>
  );
}
