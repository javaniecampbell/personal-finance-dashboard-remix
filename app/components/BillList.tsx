import React from "react";
import { Bill } from "~/types";
import { formatCurrency, formatDate } from "~/utils/formatters";

type BillListProps = {
  bills: Bill[];
  onPayBill?: (bill: Bill) => void;
  onEditBill?: (bill: Bill) => void;
  onDeleteBill?: (billId: string) => void;
};

const BillList: React.FC<BillListProps> = ({
  bills,
  onPayBill,
  onEditBill,
  onDeleteBill,
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {bills?.map((bill) => (
          <li key={bill.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {bill.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Due: {formatDate(bill.dueDate)} | Category: {bill.category}
                </p>
                {bill.recurring && (
                  <p className="mt-1 text-sm text-gray-500">
                    Recurring: {bill.frequency}
                  </p>
                )}
              </div>
              <div className="ml-2 flex-shrink-0 flex">
                <p
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    bill.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {formatCurrency(bill.amount)}
                </p>
                <div className="ml-2 flex space-x-2">
                  {onPayBill && bill.status !== "paid" && (
                    <button
                      onClick={() => onPayBill(bill)}
                      className="px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                    >
                      Pay
                    </button>
                  )}
                  {onEditBill && (
                    <button
                      onClick={() => onEditBill(bill)}
                      className="px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                    >
                      Edit
                    </button>
                  )}
                  {onDeleteBill && (
                    <button
                      onClick={() => onDeleteBill(bill.id)}
                      className="px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:text-red-500 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:text-red-800 active:bg-gray-50 transition ease-in-out duration-150"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillList;
