import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ChartData = {
  [key: string]: string | number;
};

type ChartProps = {
  data: ChartData[];
  xAxisDataKey: string;
  lines: Array<{
    dataKey: string;
    stroke: string;
  }>;
  title: string;
};

const Chart: React.FC<ChartProps> = ({ data, xAxisDataKey, lines, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
