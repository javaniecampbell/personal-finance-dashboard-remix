// app/components/TransactionList.tsx
import React from "react";
import { Link } from "@remix-run/react";
import { formatCurrency, formatDate } from "~/utils/formatters";
import { Transaction } from "~/types";
type TransactionListProps = {
  transactions?: Transaction[];
};
export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {Array.from(transactions ?? [])?.map((transaction) => (
          <li key={transaction.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {transaction.description}
                </p>
                <p className="ml-2 text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0 flex">
                <p
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.type === "income"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  Category: {transaction.category}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  Account: {transaction?.account?.name}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
