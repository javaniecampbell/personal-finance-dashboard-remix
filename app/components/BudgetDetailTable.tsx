import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";
import type { Budget, BudgetPerformance } from "~/types";
import { formatCurrency, formatPercentage } from "~/utils/formatters";

type BudgetDetailTableProps = {
  isChangeRate?: boolean;
  budgetOverview: {
    budgets: Budget[];
    performance: BudgetPerformance[];
  };
};

type BudgetDetailsRowProps = {
  budget?: BudgetPerformance;
};

const BudgetDetailsRow: React.FC<BudgetDetailsRowProps> = ({ budget }) => {
  const isOverBudget =
    (budget?.actualAmount ?? 0) > (budget?.budgetedAmount ?? 0);
  const performance =
    (((budget?.actualAmount ?? 0) - (budget?.budgetedAmount ?? 0)) /
      (budget?.budgetedAmount ?? 1)) *
    100;

  return (
    <tr>
      <td className="py-2">{budget?.name}</td>
      <td className="text-right">{formatCurrency(budget?.budgetedAmount ?? 0)}</td>
      <td className="text-right">{formatCurrency(budget?.actualAmount ?? 0)}</td>
      <td
        className={`flex items-center justify-end ${
          isOverBudget ? "text-red-600" : "text-green-600"
        }`}
      >
        <span className="flex items-center justify-between p-2">
        {isOverBudget ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
        {formatPercentage(Math.abs(performance / 100))}
        </span>
      </td>
    </tr>
  );
};

const BudgetDetailTable: React.FC<BudgetDetailTableProps> = ({
  budgetOverview,
  isChangeRate,
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
            if (isChangeRate === true) {
              return (
                <BudgetDetailsRow key={budget.id} budget={budgetPerformance} />
              );
            }
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
                  {budgetPerformance &&
                  budgetPerformance.performance !== null &&
                  budgetPerformance.performance !== undefined
                    ? formatPercentage(budgetPerformance.performance ?? 0)
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
