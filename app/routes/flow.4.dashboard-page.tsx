import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import {
  endOfMonth,
  isValid,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { Pause, Play, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import BudgetDetailTable from "~/components/BudgetDetailTable";
import BudgetHistoryChart from "~/components/BudgetHistoryChart";
import BudgetOverview from "~/components/BudgetOverview.v2";
import { UpcomingBills } from "~/components/DashboardComponents";
import { DateRangePicker } from "~/components/DateRangePicker";
import DetailedBudgetHistoryChart from "~/components/DetailedBudgetHistoryChart";
import { useNotification } from "~/components/ErrorNotification";
import TransactionList from "~/components/TransactionList";
import UpdateTransactionsDrawer from "~/components/UpdateTransactionsDrawer";
import { useReplay } from "~/hooks/useReplay";
import { DateRangeResult, Metric } from "~/types";
import { getAccounts } from "~/utils/accounts.server";
import { requireUserId } from "~/utils/auth.server.v2";
import { getUpcomingBills } from "~/utils/bills.server";
import {
  getBudgetHistoryByMonth,
  recordBudgetHistory,
} from "~/utils/budgetHistory.server";
import { getBudgetOverview } from "~/utils/budgets.server";
import { formatCurrency } from "~/utils/formatters";
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
  const accounts = await getAccounts(userId);
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const url = new URL(request.url);
  const currentDate = new Date();
  const startDate = url.searchParams.get("startDate")
    ? new Date(url.searchParams.get("startDate")!)
    : startOfMonth(subMonths(currentDate, 3));
  const endDate = url.searchParams.get("endDate")
    ? new Date(url.searchParams.get("endDate")!)
    : endOfMonth(currentDate);

  const budgetHistory = await getBudgetHistoryByMonth(
    userId,
    startDate,
    endDate
  );
  if (process.env.NODE_ENV === "development") {
    console.log(
      "Fetched Budget History:",
      JSON.stringify(budgetHistory, null, 4)
    );
  }

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
    accounts,
    accountBalance,
    budgetHistory,
    budgetOverview,
    metrics: metrics.metrics,
    recentTransactions,
    upcomingBills,
    user,
    totalBalance,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
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

  if (_action === "recordBudgetHistory") {
    const result = await recordBudgetHistory(userId);
    return json(result);
  }
};

export default function Dashboard() {
  const {
    accounts,
    accountBalance,
    budgetHistory,
    budgetOverview,
    endDate,
    recentTransactions,
    totalBalance,
    user,
    upcomingBills,
    startDate,
  } = useLoaderData<typeof loader>();

  const {
    recordEvent,
    startReplay,
    stopReplay,
    isReplaying,
    currentReplayEvent,
  } = useReplay();

  const { addNotification } = useNotification();
  const [balance, setBalance] = useState(totalBalance ?? accountBalance);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(budgetHistory[0]?.id);
  //TODO: Add state for isCapped here and fetcher get method to toggle isCapped state

  const [isDetailedView, setIsDetailedView] = useState(false);
  const fetcher = useFetcher();

  const rStartDate = fetcher.data?.startDate || startDate;
  const rEndDate = fetcher.data?.endDate || endDate;
  const rBudgetHistory = fetcher.data?.budgetHistory || budgetHistory;

  console.log("Updated Start Date received:", rStartDate);
  console.log("Updated End Date received:", rEndDate);
  console.log("Updated Budget History received:", rBudgetHistory);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(rStartDate),
    endDate: new Date(rEndDate),
  });
  useEffect(() => {
    recentTransactions.forEach(recordEvent);
  }, [recentTransactions, recordEvent]);

  const handleDateRangeChange = (newDateRange: DateRangeResult) => {
    try {
      const start =
        newDateRange.startDate instanceof Date
          ? newDateRange.startDate
          : parseISO(newDateRange.startDate);
      const end =
        newDateRange.endDate instanceof Date
          ? newDateRange.endDate
          : parseISO(newDateRange.endDate);

      if (!isValid(start) || !isValid(end)) {
        console.error("Invalid date range selected");
        addNotification("Invalid date range selected", "error");
        return;
      }

      setDateRange(newDateRange);
      // Format dates as ISO strings for the URL
      const formattedStartDate = start.toISOString().split("T")[0];
      const formattedEndDate = end.toISOString().split("T")[0];

      addNotification("New Date Range selected", "info");
      console.log("New Date Range:", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      addNotification("Fetching budget history data...", "info");

      fetcher.submit(
        { startDate: formattedStartDate, endDate: formattedEndDate },
        { method: "get" }
      );
    } catch (error) {
      console.error("Error fetching budget history data:", error);
      addNotification("Error fetching budget history data", "error");
    }
  };

  const toggleChartView = () => {
    setIsDetailedView(!isDetailedView);
  };

  const handleRecordHistory = () => {
    try {
      fetcher.submit({ _action: "recordBudgetHistory" }, { method: "post" });
      addNotification(
        `Recorded ${fetcher.data?.recordedEntries ?? 0} out of
        ${fetcher?.data?.totalBudgets ?? 0} budget entries.`,
        "info"
      );
    } catch (error) {
      console.error("Error recording budget history:", error);
      addNotification("Error recording budget history", "error");
    }
  };

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
            Welcome, {user?.name}
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
                    {formatCurrency(balance)}
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
            <BudgetDetailTable budgetOverview={budgetOverview} isChangeRate />
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              Historical Performance
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleRecordHistory}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Record Current Budget History
              </button>
            </div>
            {/* {fetcher.data &&
              fetcher.formData._action === "recordBudgetHistory" && (
                <p className="mb-4 text-green-600">
                  Recorded {fetcher.data.recordedEntries} out of{" "}
                  {fetcher.data.totalBudgets} budget entries.
                </p>
              )} */}

            <div className="flex justify-between items-center mb-4">
              <div>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="p-2 border rounded"
                >
                  {budgetHistory.map((budget) => (
                    <option key={budget.id} value={budget.id}>
                      {budget.name}
                    </option>
                  ))}
                </select>
                <DateRangePicker
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <button
                onClick={toggleChartView}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                {isDetailedView
                  ? "Switch to Simple View"
                  : "Switch to Detailed View"}
              </button>
            </div>
            {selectedBudget && (
              <>
                {isDetailedView ? (
                  <DetailedBudgetHistoryChart
                    budgetHistory={
                      budgetHistory.find((b) => b.id === selectedBudget) || {
                        id: "",
                        name: "No Data",
                        category: "",
                        history: [],
                      }
                    }
                  />
                ) : (
                  <BudgetHistoryChart
                    budgetHistory={
                      budgetHistory.find((b) => b.id === selectedBudget) || {
                        id: "",
                        name: "No Data",
                        category: "",
                        history: [],
                      }
                    }
                  />
                )}
              </>
            )}
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg mb-6 mt-8">
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
          {/* Accounts Overview Section  */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Accounts Overview
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Total Balance: ${totalBalance.toFixed(2)}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {accounts === undefined || (accounts && accounts.length === 0) ? (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {/* Add an icon based on account type */}
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            No accounts found
                          </dt>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link
                        to="/accounts/new"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Add an account
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                accounts?.map((account) => (
                  <div
                    key={account.id}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {/* Add an icon based on account type */}
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {account.name}
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              ${account.balance.toFixed(2)}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <a
                          href={`/accounts/${account.id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View details
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

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
