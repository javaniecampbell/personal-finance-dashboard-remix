import React, { useState, useEffect } from 'react';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';
import Layout from '~/components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for OpenTelemetry metrics
const generateMockMetrics = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    requestCount: Math.floor(Math.random() * 100),
    responseTime: Math.floor(Math.random() * 1000),
    errorRate: Math.random() * 5,
  }));
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const metrics = generateMockMetrics();
  return json({ metrics });
};

// Mock event stream
const mockEventStream = [
  { id: 1, timestamp: '2024-07-26T10:00:00Z', type: 'USER_LOGIN', data: { userId: 'user123' } },
  { id: 2, timestamp: '2024-07-26T10:05:00Z', type: 'TRANSACTION_CREATED', data: { transactionId: 'txn456', amount: 100 } },
  { id: 3, timestamp: '2024-07-26T10:10:00Z', type: 'BUCKET_UPDATED', data: { bucketId: 'bucket789', newAmount: 500 } },
];

const EventLog = () => {
  const [events, setEvents] = useState(mockEventStream);

  useEffect(() => {
    // In a real application, you would set up an SSE connection here
    const interval = setInterval(() => {
      const newEvent = {
        id: events.length + 1,
        timestamp: new Date().toISOString(),
        type: ['USER_LOGIN', 'TRANSACTION_CREATED', 'BUCKET_UPDATED'][Math.floor(Math.random() * 3)],
        data: { someData: Math.random() },
      };
      setEvents(prevEvents => [newEvent, ...prevEvents].slice(0, 100)); // Keep only the last 100 events
    }, 5000);

    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Event Log</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{JSON.stringify(event.data)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricsChart = ({ metrics }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">System Metrics</h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="requestCount" stroke="#8884d8" name="Request Count" />
            <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#82ca9d" name="Response Time (ms)" />
            <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ff7300" name="Error Rate (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function EventSourcingAndMonitoring() {
  const { metrics } = useLoaderData();

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Event Sourcing and Monitoring</h2>
      <MetricsChart metrics={metrics} />
      <EventLog />
    </Layout>
  );
}