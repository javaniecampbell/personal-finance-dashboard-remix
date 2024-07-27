import React from 'react';
import { formatDate, formatCurrency } from '~/utils/formatters';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
};

type TransactionListProps = {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Amount
            </th>
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                {formatDate(transaction.date)}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                {transaction.description}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                {transaction.category}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-medium">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
