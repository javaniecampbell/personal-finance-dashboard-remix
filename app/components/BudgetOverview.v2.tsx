import { ArrowDown, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";
import { formatCurrency, formatPercentage } from "~/utils/formatters";

type BudgetOverviewProps = {
  isCapped?: boolean;
  isChangeRate?: boolean;
  budgetOverview: {
    budgets: Array<{ amount: number }>;
    performance: Array<{ budgetedAmount: number; actualAmount: number }>;
  };
};

const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  budgetOverview,
  isCapped,
  isChangeRate,
}) => {
  const { performance } = budgetOverview;

  const totalBudgeted = performance.reduce(
    (sum, perf) => sum + perf.budgetedAmount,
    0
  );
  const totalActual = performance.reduce(
    (sum, perf) => sum + perf.actualAmount,
    0
  );
  const totalPlanned = performance.reduce(
    (sum, perf) => sum + perf.budgetedAmount,
    0
  );

  if (process.env.NODE_ENV === "development") {
    console.log("Budget Performance data", performance);
  }
  // Calculate overall performance as a percentage
  // const overallPerformance = totalPlanned > 0 ? totalActual / totalPlanned : 0;
  let overallPerformance: number = 0;

  overallPerformance =
    totalPlanned > 0 ? (totalActual / totalBudgeted) * 100 : 0;
  if (isChangeRate === true) {
    const overallPerformanceChangeRate =
      totalBudgeted > 0
        ? ((totalActual - totalBudgeted) / totalBudgeted) * 100
        : 0;
    overallPerformance = overallPerformanceChangeRate;
  }

  const remainingBudget = totalBudgeted - totalActual;

  if (process.env.NODE_ENV === "development") {
    console.log(
      `Total Budgeted: ${totalBudgeted}, Total Actual: ${totalActual}`
    );
  }

  const isOverBudget = remainingBudget < 0;

  const PerformanceIndicator = ({ value }) => (
    <span
      className={`flex items-center ${
        value >= 0 ? "text-red-600" : "text-green-600"
      }`}
    >
      {value >= 0 ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
      {formatPercentage(Math.abs(value / 100))}
    </span>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Budget Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Total Budgeted</p>
          <p className="text-2xl font-semibold">
            {formatCurrency(totalBudgeted)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Total Spent</p>
          <p className="text-2xl font-semibold">
            {formatCurrency(totalActual)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Remaining Budget</p>
          <p
            className={`text-2xl font-semibold ${
              isOverBudget ? "text-red-600" : "text-green-600"
            } ${
              isChangeRate ? "flex-col items-center" : "flex items-center gap-1"
            }`}
          >
            <div className="flex items-center">
              {isOverBudget === true && isChangeRate === true ? (
                <ArrowUpIcon size={16} />
              ) : isOverBudget === false && isChangeRate === true ? (
                <ArrowDownIcon size={16} />
              ) : null}
              {formatCurrency(Math.abs(remainingBudget))}
            </div>
            <div className={`${isChangeRate === true ? "flex pl-1" : ""}`}>
              {isOverBudget ? " Over" : ""}
            </div>
          </p>
        </div>
        <div>
          <p className="text-gray-600">Overall Performance</p>
          <p
            className={`text-2xl font-semibold  ${
              isOverBudget ? "text-red-600" : "text-green-600"
            }`}
          >
            {isChangeRate === true && (
              <PerformanceIndicator value={overallPerformance} />
            )}
            {/* Display "Over Budget" instead of a percentage when spending exceeds the budget with appropriate colour */}
            {isCapped === true && isOverBudget
              ? "Over Budget"
              : formatPercentage(overallPerformance / 100)}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          {/* Adjust the progress bar to max out at 100% width if isCapped is true */}
          <div
            className={`h-2.5 rounded-full ${
              isOverBudget ? "bg-red-600" : "bg-green-600"
            }`}
            style={{
              width: `${Math.min(
                isCapped === true
                  ? overallPerformance
                  : overallPerformance * 100,
                100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
