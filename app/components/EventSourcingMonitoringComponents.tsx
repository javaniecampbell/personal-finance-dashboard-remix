import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Event Log Component
export const EventLog = ({ initialEvents = [], onEventReceived }) => {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    // Simulating real-time event updates
    const interval = setInterval(() => {
      const newEvent = {
        id: events.length + 1,
        timestamp: new Date().toISOString(),
        type: ['USER_LOGIN', 'TRANSACTION_CREATED', 'BUCKET_UPDATED'][Math.floor(Math.random() * 3)],
        data: { someData: Math.random() },
      };
      setEvents(prevEvents => [newEvent, ...prevEvents].slice(0, 100)); // Keep only the last 100 events
      onEventReceived(newEvent);
    }, 5000);

    return () => clearInterval(interval);
  }, [events, onEventReceived]);

  return (
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
  );
};

// Metrics Chart Component
export const MetricsChart = ({ metrics }) => {
  return (
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
  );
};

// Helper function to generate mock metrics data
const generateMockMetrics = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    requestCount: Math.floor(Math.random() * 100),
    responseTime: Math.floor(Math.random() * 1000),
    errorRate: Math.random() * 5,
  }));
};

// Main Event Sourcing and Monitoring Component
const EventSourcingAndMonitoring = () => {
  const [metrics, setMetrics] = useState(generateMockMetrics());

  const handleEventReceived = (newEvent) => {
    // In a real application, you might want to update metrics based on the new event
    console.log('New event received:', newEvent);
  };

  // Simulating metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateMockMetrics());
    }, 60000); // Update metrics every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">System Metrics</h3>
        <MetricsChart metrics={metrics} />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Event Log</h3>
        <EventLog onEventReceived={handleEventReceived} />
      </div>
    </div>
  );
};

export default EventSourcingAndMonitoring;
