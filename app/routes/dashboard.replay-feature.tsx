import React, { useState, useEffect } from "react";
import { useReplay } from "~/hooks/useReplay";
import { Play, Pause, RefreshCw } from "lucide-react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRecentEvents } from "~/models/events.server";
import * as replayHandlers from '~/utils/replayHandlers';
export const loader = async () => {
  const recentEvents = await getRecentEvents();
  return json({ recentEvents });
};

const financialEventTypes = [
  "DEPOSIT",
  "WITHDRAWAL",
  "BUDGET_ADJUSTMENT",
  "BILL_PAYMENT",
];

const generateMockEvents = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    type: financialEventTypes[
      Math.floor(Math.random() * financialEventTypes.length)
    ],
    amount: Math.floor(Math.random() * 1000) + 1,
    timestamp: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));
};

const Dashboard = () => {
  const [recentEvents, setRecentEvents] = useState([]);
  // const { recentEvents } = useLoaderData();
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentReplayEvent, setCurrentReplayEvent] = useState(null);
  const {
    recordEvent,
    startReplay,
    stopReplay,
    isReplaying,
    currentReplayEvent,
  } = useReplay();
  const [balance, setBalance] = useState(10000); // Example initial balance
  const [budgets, setBudgets] = useState({});
  const [billStatuses, setBillStatuses] = useState({});

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
        replayHandlers.handleBillPaymentReplay(event, setBalance, (billId, status) => {
          setBillStatuses(prev => ({ ...prev, [billId]: status }));
        });
        break;
    }
  }, []);
  // useEffect(() => {
  //   recentEvents.forEach(recordEvent);
  // }, [recentEvents, recordEvent]);

  useEffect(() => {
    // In a real app, you'd fetch this data from your backend
    const mockEvents = generateMockEvents(5);
    setRecentEvents(mockEvents);
    mockEvents.forEach(recordEvent);
  }, [recordEvent]);

  const handleReplay = () => {
    if (isReplaying) {
      stopReplay();
      setIsReplaying(false);
      setCurrentReplayEvent(null);
    } else {
      setIsReplaying(true);
      replayEvents();
    }
  };

  const replayEvents = async () => {
    for (const event of recentEvents) {
      if (!isReplaying) break;
      setCurrentReplayEvent(event);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating event processing time
      // In a real app, you'd update the UI based on the event type
    }
    setIsReplaying(false);
    setCurrentReplayEvent(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Financial Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recent Financial Events</h2>
        <ul className="space-y-2">
          {recentEvents.map((event) => (
            <li
              key={event.id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <span className="font-medium">{event.type}</span>
              <span>${event.amount.toFixed(2)}</span>
              <span className="text-sm text-gray-500">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <button
          onClick={handleReplay}
          className={`flex items-center px-4 py-2 rounded ${
            isReplaying
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
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

      {currentReplayEvent && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex items-center">
            <RefreshCw size={20} className="mr-2 animate-spin" />
            <p>
              Replaying: <strong>{currentReplayEvent.type}</strong> - Amount: $
              {currentReplayEvent.amount.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Other dashboard components would go here */}
    </div>
  );
};

export default Dashboard;
