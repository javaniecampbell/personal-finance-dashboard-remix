import React, { useState, useEffect, useCallback } from 'react';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { useReplay } from '~/hooks/useReplay';
import * as replayHandlers from '~/utils/replayHandlers';
import { getRecentEvents } from '~/models/events.server';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { BudgetOverview, UpcomingBills, TransactionHistory } from '~/components/DashboardComponents';

export const loader = async () => {
  const recentEvents = await getRecentEvents();
  // In a real app, you'd fetch this data from your backend
  const budgets = { groceries: 300, entertainment: 150, utilities: 200 };
  const upcomingBills = [
    { id: 1, name: 'Rent', amount: 1000, dueDate: '2024-08-01' },
    { id: 2, name: 'Internet', amount: 50, dueDate: '2024-08-05' },
  ];
  const transactions = [
    { id: 1, description: 'Grocery Store', amount: -75.50, date: '2024-07-25' },
    { id: 2, description: 'Salary Deposit', amount: 2000, date: '2024-07-24' },
    { id: 3, description: 'Restaurant', amount: -45.00, date: '2024-07-23' },
  ];
  return json({ recentEvents, budgets, upcomingBills, transactions });
};

const Dashboard = () => {
  const { recentEvents, budgets: initialBudgets, upcomingBills, transactions } = useLoaderData();
  const { recordEvent, startReplay, stopReplay, isReplaying, currentReplayEvent } = useReplay();
  const [balance, setBalance] = useState(10000);
  const [budgets, setBudgets] = useState(initialBudgets);

  useEffect(() => {
    recentEvents.forEach(recordEvent);
  }, [recentEvents, recordEvent]);

  const handleReplayEvent = useCallback((event) => {
    switch (event.type) {
      case 'DEPOSIT':
        replayHandlers.handleDepositReplay(event, setBalance);
        break;
      case 'WITHDRAWAL':
        replayHandlers.handleWithdrawalReplay(event, setBalance);
        break;
      case 'BUDGET_ADJUSTMENT':
        replayHandlers.handleBudgetAdjustmentReplay(event, (categoryId, newAmount) => {
          setBudgets(prev => ({ ...prev, [categoryId]: newAmount }));
        });
        break;
      case 'BILL_PAYMENT':
        replayHandlers.handleBillPaymentReplay(event, setBalance, () => {});
        break;
    }
  }, []);

  const handleReplay = () => {
    if (isReplaying) {
      stopReplay();
    } else {
      startReplay(handleReplayEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Current Balance</h2>
                <p className="mt-1 text-3xl font-semibold text-gray-900">${balance.toFixed(2)}</p>
              </div>
            </div>
            <BudgetOverview budgets={budgets} />
            <UpcomingBills bills={upcomingBills} />
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Financial Events</h2>
              <ul className="space-y-3">
                {recentEvents.map((event) => (
                  <li key={event.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{event.type}</span>
                    <span>${event.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button
                  onClick={handleReplay}
                  className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isReplaying ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
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
            </div>
          </div>

          {currentReplayEvent && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-center">
                <RefreshCw size={20} className="mr-2 animate-spin text-yellow-700" />
                <p className="text-sm text-yellow-700">
                  Replaying: <strong>{currentReplayEvent.type}</strong> - Amount: ${currentReplayEvent.amount.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <TransactionHistory transactions={transactions} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
