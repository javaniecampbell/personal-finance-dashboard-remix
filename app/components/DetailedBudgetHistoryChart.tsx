import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BudgetHistory } from "~/types";
import { formatCurrency, formatPercentage } from "~/utils/formatters";
type DetailedBudgetHistoryChartProps = {
  budgetHistory: BudgetHistory;
};

const DetailedBudgetHistoryChart: React.FC<DetailedBudgetHistoryChartProps> = ({
  budgetHistory,
}) => {
  const data = budgetHistory.history.map((h) => ({
    date: new Date(h.date).toISOString().split("T")[0],
    "Budgeted Amount": h.budgetedAmount,
    "Actual Amount": h.actualAmount,
    Performance: h.performance,
    "Spent Percentage": h.spentPercentage,
  }));

  // Find the maximum value for setting up the y-axis domain
  const maxValue = Math.max(
    ...data.map((d) =>
      Math.max(
        d["Budgeted Amount"],
        d["Actual Amount"],
        d["Performance"],
        d["Spent Percentage"]
      )
    )
  );
  console.log("Budget History Data received by detail chart:", budgetHistory);
  console.log("Processed Detailed Chart Data:", data);

  if (data.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">
          {budgetHistory.name} - Detailed Historical Performance
        </h3>
        <div>No budget history data available for the selected period.</div>
      </div>
    );
  }
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">
        {budgetHistory.name} - Detailed Historical Performance
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            yAxisId="left"
            domain={[0, maxValue * 1.1]} // Add 10% padding to the top
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]} // Percentage domain
            tickFormatter={(value) => formatPercentage(value / 100)}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Performance" || name === "Spent Percentage")
                return formatPercentage((value as number) / 100);
              return formatCurrency(value as number);
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Budgeted Amount"
            stroke="#8884d8"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Actual Amount"
            stroke="#82ca9d"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Performance"
            stroke="#ff7300"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Spent Percentage"
            stroke="#ffc658"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetailedBudgetHistoryChart;
