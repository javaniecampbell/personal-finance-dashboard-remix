import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Metric } from "~/types";

const MetricsDisplay = ({ metrics }: { metrics: Metric[] }) => {
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
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="requestCount"
            stroke="#8884d8"
            name="Request Count"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="responseTime"
            stroke="#82ca9d"
            name="Response Time (ms)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="errorRate"
            stroke="#ff7300"
            name="Error Rate"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsDisplay;
