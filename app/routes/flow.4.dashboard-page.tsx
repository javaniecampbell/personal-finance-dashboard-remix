import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Pause, Play, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import BudgetDetailTable from "~/components/BudgetDetailTable";
import BudgetOverview from "~/components/BudgetOverview.v2";
import { UpcomingBills } from "~/components/DashboardComponents";
import UpdateTransactionsDrawer from "~/components/UpdateTransactionsDrawer";
import TransactionList from "~/components/TransactionList";
import { useReplay } from "~/hooks/useReplay";
import { Metric } from "~/types";
import { requireUserId } from "~/utils/auth.server.v2";
import { getUpcomingBills } from "~/utils/bills.server";
import { getBudgetOverview } from "~/utils/budgets.server";
import { createSpan } from "~/utils/tracing.server";
import {
  getAccountBalance,
  getRecentTransactions,
  updateTransactionsBudgets,
} from "~/utils/transactions.server";
import { getUser } from "~/utils/user.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await getUser(userId);
  const recentTransactions = await getRecentTransactions(userId, 5);
  const accountBalance = await getAccountBalance(userId);
  const budgetOverview = await getBudgetOverview(userId);
  const upcomingBills = await getUpcomingBills(userId);
  const metrics = (await createSpan("fetch-metrics", async () => {
    // In a real application, you would fetch this data from your OpenTelemetry backend
    const mockMetrics = [
      {
        timestamp: "2024-07-26T00:00:00",
        requestCount: 100,
        responseTime: 250,
        errorRate: 0.02,
      },
      {
        timestamp: "2024-07-26T01:00:00",
        requestCount: 120,
        responseTime: 230,
        errorRate: 0.01,
      },
      {
        timestamp: "2024-07-26T02:00:00",
        requestCount: 80,
        responseTime: 280,
        errorRate: 0.03,
      },
      // ... more data points
    ];
    return Promise.resolve({
      metrics: mockMetrics,
    });
  })) as { metrics: Metric[] };
  return json({
    user,
    recentTransactions,
    accountBalance,
    budgetOverview,
    upcomingBills,
    metrics: metrics.metrics,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "updateTransactionsBudgets") {
    const result = await updateTransactionsBudgets(userId);
    return json(result);
  }
  // TODO: Add fetcher get method to toggle isCapped state
  // ... other actions ...
};

export default function Dashboard() {
  const {
    user,
    recentTransactions,
    accountBalance,
    budgetOverview,
    upcomingBills,
  } = useLoaderData<typeof loader>();

  const {
    recordEvent,
    startReplay,
    stopReplay,
    isReplaying,
    currentReplayEvent,
  } = useReplay();
  const [balance, setBalance] = useState(accountBalance);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  //TODO: Add state for isCapped here and fetcher get method to toggle isCapped state

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
              {/* Span 2 columns in grid */}
              <div className="grid col-span-2">
                <UpcomingBills bills={upcomingBills} />
              </div>
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
                <div className="gid grid-rows-2 gap-4">
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
                  <div className="mt-4 grid">
                    <button
                      onClick={() => setIsUpdateDrawerOpen(true)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Update Transactions Budgets
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* You can add another component here, such as financial tips or goal progress */}
          </div>

          <UpdateTransactionsDrawer
            isOpen={isUpdateDrawerOpen}
            onClose={() => setIsUpdateDrawerOpen(false)}
          />
        </div>
      </main>
    </div>
  );
}
