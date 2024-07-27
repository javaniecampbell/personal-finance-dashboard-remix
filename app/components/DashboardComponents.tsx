import React from 'react';

const BudgetOverview = ({ budgets }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-2">Budget Overview</h2>
    <ul className="space-y-2">
      {Object.entries(budgets).map(([category, amount]) => (
        <li key={category} className="flex justify-between items-center">
          <span className="capitalize">{category}</span>
          <span>${amount.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  </div>
);

const UpcomingBills = ({ bills }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-2">Upcoming Bills</h2>
    <ul className="space-y-2">
      {bills.map((bill) => (
        <li key={bill.id} className="flex justify-between items-center">
          <span>{bill.name}</span>
          <span>${bill.amount.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  </div>
);

const TransactionHistory = ({ transactions }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
    <ul className="space-y-2">
      {transactions.map((transaction) => (
        <li key={transaction.id} className="flex justify-between items-center">
          <span>{transaction.description}</span>
          <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
            ${Math.abs(transaction.amount).toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export { BudgetOverview, UpcomingBills, TransactionHistory };
