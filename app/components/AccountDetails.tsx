// app/components/AccountDetails.tsx
import React from "react";
import { Link } from "@remix-run/react";
import { formatCurrency } from "~/utils/formatters";
import { Account, Transaction } from "~/types";

type AccountDetailsProps = {
  account?: Account;
  transactions?: Transaction[];
};

export function AccountDetails({ account, transactions }: AccountDetailsProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {account?.name}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{account?.type}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Current Balance
            </dt>
            <dd className="mt-1 text-3xl text-gray-900 sm:mt-0 sm:col-span-2">
              {formatCurrency(account?.balance ?? 0)}
            </dd>
          </div>
        </dl>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900">
          Recent Transactions
        </h4>
        <ul className="divide-y divide-gray-200">
          {Array.from(transactions ?? [])
            ?.slice(0, 5)
            ?.map((transaction) => (
              <li key={transaction.id} className="py-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p
                    className={`text-sm ${
                      transaction.amount >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(transaction?.amount)}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(transaction?.date).toLocaleDateString()}
                </p>
              </li>
            ))}
        </ul>
        <div className="mt-4">
          <Link
            to={`/accounts/${account?.id}/transactions`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            View all transactions
          </Link>
        </div>
      </div>
    </div>
  );
}
