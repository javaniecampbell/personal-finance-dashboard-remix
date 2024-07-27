import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createSpan } from '~/utils/tracing.server';

export const loader = async () => {
  return createSpan('fetch-metrics', async () => {
    // In a real application, you would fetch this data from your OpenTelemetry backend
    const mockMetrics = [
      { timestamp: '2024-07-26T00:00:00', requestCount: 100, responseTime: 250, errorRate: 0.02 },
      { timestamp: '2024-07-26T01:00:00', requestCount: 120, responseTime: 230, errorRate: 0.01 },
      { timestamp: '2024-07-26T02:00:00', requestCount: 80, responseTime: 280, errorRate: 0.03 },
      // ... more data points
    ];

    return json({ metrics: mockMetrics });
  });
};

const MetricsDisplay = () => {
  const { metrics } = useLoaderData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Application Metrics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="requestCount" stroke="#8884d8" name="Request Count" />
          <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#82ca9d" name="Response Time (ms)" />
          <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ff7300" name="Error Rate" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsDisplay;
