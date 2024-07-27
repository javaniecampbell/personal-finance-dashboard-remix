import React from 'react';
import { formatCurrency, formatPercentage } from '~/utils/formatters';

type BudgetSummaryProps = {
  budgetOverview: {
    budgets: Array<{ amount: number }>;
    performance: Array<{ budgetedAmount: number; actualAmount: number }>;
  };
};

const BudgetSummaryCard: React.FC<BudgetSummaryProps> = ({ budgetOverview }) => {
  const { budgets, performance } = budgetOverview;

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalActual = performance.reduce((sum, perf) => sum + perf.actualAmount, 0);
  const totalPlanned = performance.reduce((sum, perf) => sum + perf.budgetedAmount, 0);

  const overallPerformance = totalPlanned > 0 ? totalActual / totalPlanned : 0;
  const remainingBudget = totalBudgeted - totalActual;

  const isOverBudget = remainingBudget < 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Budget Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Total Budgeted</p>
          <p className="text-2xl font-semibold">{formatCurrency(totalBudgeted)}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Spent</p>
          <p className="text-2xl font-semibold">{formatCurrency(totalActual)}</p>
        </div>
        <div>
          <p className="text-gray-600">Remaining Budget</p>
          <p className={`text-2xl font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(Math.abs(remainingBudget))}
            {isOverBudget ? ' Over' : ''}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Overall Performance</p>
          <p className="text-2xl font-semibold">{formatPercentage(overallPerformance)}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-green-600'}`} 
            style={{ width: `${Math.min(overallPerformance * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryCard;
