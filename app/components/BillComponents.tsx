import React from 'react';
import { formatCurrency, formatDate } from '~/utils/formatters';

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  status: 'paid' | 'unpaid';
};

export const UpcomingBillsList: React.FC<{ bills: Bill[], onPay: (bill: Bill) => void }> = ({ bills, onPay }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Bills</h3>
      <ul className="space-y-4">
        {bills.map((bill) => (
          <li key={bill.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{bill.name}</p>
              <p className="text-sm text-gray-500">Due: {formatDate(bill.dueDate)}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatCurrency(bill.amount)}</p>
              <button
                onClick={() => onPay(bill)}
                className="mt-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Pay Now
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const BillHistory: React.FC<{ bills: Bill[] }> = ({ bills }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Bill Payment History</h3>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Bill</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Paid Date</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.name}</td>
              <td>{formatCurrency(bill.amount)}</td>
              <td>{formatDate(bill.dueDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
