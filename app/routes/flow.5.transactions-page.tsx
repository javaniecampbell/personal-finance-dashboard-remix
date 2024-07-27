import React, { useState } from "react";
import { useLoaderData, useNavigation, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server.v2";
import {
  getTransactions,
  importTransactions,
} from "~/utils/transactions.server";
import { useNotification } from "~/components/ErrorNotification";
import FileUpload from "~/components/FileUpload";
import SideDrawer from "~/components/SideDrawer";
import { formatDate, formatCurrency } from "~/utils/formatters";
import { Filter, SortAsc, SortDesc, FileUp, Info, Plus } from "lucide-react";
import AddTransactionForm from "~/components/AddTransactionForm";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 20;
  const sortBy = url.searchParams.get("sortBy") || "date";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";
  const filterType = url.searchParams.get("filterType") || "all";

  const { transactions, totalCount } = await getTransactions(userId, {
    page,
    limit,
    sortBy,
    sortOrder,
    filterType,
  });

  return json({
    transactions,
    totalCount,
    page,
    limit,
    sortBy,
    sortOrder,
    filterType,
  });
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const importedCount = await importTransactions(userId, file);
    return json({ success: true, importedCount });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
};

export default function TransactionsPage() {
  const {
    transactions,
    totalCount,
    page,
    limit,
    sortBy,
    sortOrder,
    filterType,
  } = useLoaderData();
  const transition = useNavigation();
  const fetcher = useFetcher();
  const { addNotification } = useNotification();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  const totalPages = Math.ceil(totalCount / limit);

  const handleSort = (field) => {
    const newSortOrder =
      field === sortBy && sortOrder === "asc" ? "desc" : "asc";
    fetcher.submit(
      { sortBy: field, sortOrder: newSortOrder },
      { method: "get" }
    );
  };

  const handleFilter = (event) => {
    fetcher.submit({ filterType: event.target.value }, { method: "get" });
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await fetcher.submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
      if (result.success) {
        addNotification(
          `Successfully imported ${result.importedCount} transactions`,
          "success"
        );
      } else {
        addNotification(result.error, "error");
      }
    } catch (error) {
      addNotification("Failed to import transactions", "error");
    }
  };

  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
  };
  const openAddTransaction = () => {
    setIsAddingTransaction(true);
    setIsDrawerOpen(true);
  };
  const handleAddTransaction = async (transactionData) => {
    try {
      const result = await fetcher.submit(
        { ...transactionData, _action: "createTransaction" },
        { method: "post" }
      );
      if (result.success) {
        addNotification("Transaction added successfully", "success");
        setIsAddFormOpen(false);
      } else {
        addNotification(result.error, "error");
      }
    } catch (error) {
      addNotification("Failed to add transaction", "error");
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Filter className="mr-2" />
          <select
            value={filterType}
            onChange={handleFilter}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>
        <div className="flex justify-between gap-2">
          <FileUpload onFileUpload={handleFileUpload} accept=".csv,.xls,.xlsx">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
              <FileUp className="mr-2" />
              Import Transactions
            </button>
          </FileUpload>
          <button
            onClick={openAddTransaction}
           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
             <Plus className="mr-2" />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
                <button onClick={() => handleSort("date")} className="ml-2">
                  {sortBy === "date" && sortOrder === "asc" ? (
                    <SortAsc size={16} />
                  ) : (
                    <SortDesc size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
                <button onClick={() => handleSort("amount")} className="ml-2">
                  {sortBy === "amount" && sortOrder === "asc" ? (
                    <SortAsc size={16} />
                  ) : (
                    <SortDesc size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300"></th>
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
                  <span
                    className={
                      transaction.amount >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-right">
                  <button
                    onClick={() => openTransactionDetails(transaction)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Info size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalCount)} of {totalCount} transactions
        </div>
        <div>
          <button
            onClick={() =>
              fetcher.submit({ page: page - 1 }, { method: "get" })
            }
            disabled={page === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Previous
          </button>
          <button
            onClick={() =>
              fetcher.submit({ page: page + 1 }, { method: "get" })
            }
            disabled={page === totalPages}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          >
            Next
          </button>
        </div>
      </div>

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={isAddingTransaction ? "Add Transaction" : "Transaction Details"}
      >
        {selectedTransaction && (
          <div>
            <p>
              <strong>Date:</strong> {formatDate(selectedTransaction.date)}
            </p>
            <p>
              <strong>Description:</strong> {selectedTransaction.description}
            </p>
            <p>
              <strong>Amount:</strong>{" "}
              {formatCurrency(selectedTransaction.amount)}
            </p>
            <p>
              <strong>Category:</strong> {selectedTransaction.category}
            </p>
            {/* Add more details as needed */}
          </div>
        )}

        {isAddingTransaction && (
          <AddTransactionForm onClose={handleCloseDrawer} />
        )}
      </SideDrawer>
    </div>
  );
}
