import React from "react";
import type { Budget, BudgetPerformance } from "~/types";
import { formatCurrency, formatPercentage } from "~/utils/formatters";

type BudgetDetailTableProps = {
  budgetOverview: {
    budgets: Budget[];
    performance: BudgetPerformance[];
  };
};

const BudgetDetailTable: React.FC<BudgetDetailTableProps> = ({
  budgetOverview,
}) => {
  const { budgets, performance } = budgetOverview;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Budget Details</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-right">Budgeted</th>
            <th className="text-right">Actual</th>
            <th className="text-right">Performance</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => {
            const budgetPerformance = performance.find(
              (p) => p.id === budget.id
            );
            return (
              <tr key={budget.id}>
                <td className="py-2">{budget.name}</td>
                <td className="text-right">{formatCurrency(budget.amount)}</td>
                <td className="text-right">
                  {budgetPerformance
                    ? formatCurrency(budgetPerformance.actualAmount)
                    : "N/A"}
                </td>
                <td className="text-right">
                  {budgetPerformance
                    ? formatPercentage(budgetPerformance.performance)
                    : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetDetailTable;
