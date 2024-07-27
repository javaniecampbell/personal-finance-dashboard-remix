import React, { useState, useEffect } from "react";
import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server.v2";
import { getUser } from "~/utils/user.server";
import {
  getRecentTransactions,
  getAccountBalance,
} from "~/utils/transactions.server";
import { getBudgetOverview } from "~/utils/budgets.server";
import { getUpcomingBills } from "~/utils/bills.server";
import { useReplay } from "~/hooks/useReplay";
import { UpcomingBills } from "~/components/DashboardComponents";
import BudgetOverview from "~/components/BudgetOverview.v2";
import TransactionList from "~/components/TransactionList";
import { Play, Pause, RefreshCw } from "lucide-react";
import BudgetDetailTable from "~/components/BudgetDetailTable";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(userId);
  const recentTransactions = await getRecentTransactions(userId, 5);
  const accountBalance = await getAccountBalance(userId);
  const budgetOverview = await getBudgetOverview(userId);
  const upcomingBills = await getUpcomingBills(userId);

  return json({
    user,
    recentTransactions,
    accountBalance,
    budgetOverview,
    upcomingBills,
  });
};

export default function Dashboard() {
  const {
    user,
    recentTransactions,
    accountBalance,
    budgetOverview,
    upcomingBills,
  } = useLoaderData();

  const {
    recordEvent,
    startReplay,
    stopReplay,
    isReplaying,
    currentReplayEvent,
  } = useReplay();
  const [balance, setBalance] = useState(accountBalance);

  useEffect(() => {
    recentTransactions.forEach(recordEvent);
  }, [recentTransactions, recordEvent]);

  const handleReplay = () => {
    if (isReplaying) {
      stopReplay();
    } else {
      startReplay(handleReplayEvent);
    }
  };

  const handleReplayEvent = (event) => {
    // Update balance based on the replayed event
    if (event.type === "DEPOSIT") {
      setBalance((prevBalance) => prevBalance + event.amount);
    } else if (event.type === "WITHDRAWAL") {
      setBalance((prevBalance) => prevBalance - event.amount);
    }
    // You can add more event handling logic here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.name}
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col gap-4">
            <BudgetOverview budgetOverview={budgetOverview} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Current Balance
                  </h2>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    ${balance?.toFixed(2)}
                  </p>
                </div>
              </div>

              <UpcomingBills bills={upcomingBills} />
            </div>
          </div>

          <div className="my-6">
            <BudgetDetailTable budgetOverview={budgetOverview} />
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Transactions
                </h2>
                <button
                  onClick={handleReplay}
                  className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isReplaying
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isReplaying ? (
                    <>
                      <Pause size={16} className="mr-2" /> Stop Replay
                    </>
                  ) : (
                    <>
                      <Play size={16} className="mr-2" /> Replay Events
                    </>
                  )}
                </button>
              </div>
              <TransactionList transactions={recentTransactions} />
              <div className="mt-4 text-right">
                <Link
                  to="/transactions"
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View all transactions
                </Link>
              </div>
            </div>
          </div>

          {currentReplayEvent && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-center">
                <RefreshCw
                  size={20}
                  className="mr-2 animate-spin text-yellow-700"
                />
                <p className="text-sm text-yellow-700">
                  Replaying: <strong>{currentReplayEvent.type}</strong> -
                  Amount: ${currentReplayEvent?.amount?.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/transactions/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Transaction
                  </Link>
                  <Link
                    to="/budgets"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Manage Budgets
                  </Link>
                  <Link
                    to="/bills/pay"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Pay Bills
                  </Link>
                  <Link
                    to="/analytics"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    View Analytics
                  </Link>
                </div>
              </div>
            </div>
            {/* You can add another component here, such as financial tips or goal progress */}
          </div>
        </div>
      </main>
    </div>
  );
}
