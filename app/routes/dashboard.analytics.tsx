import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';
import Layout from '~/components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - replace with actual API call in a real application
const generateMockData = (startDate, endDate) => {
  const data = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    data.push({
      date: currentDate.toISOString().split('T')[0],
      income: Math.floor(Math.random() * 1000) + 500,
      expenses: Math.floor(Math.random() * 800) + 200,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = url.searchParams.get('endDate') || new Date().toISOString().split('T')[0];
  
  const data = generateMockData(new Date(startDate), new Date(endDate));
  return json({ data, startDate, endDate });
};

export default function Analytics() {
  const { data, startDate, endDate } = useLoaderData();
  const [dateRange, setDateRange] = useState({ startDate, endDate });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Analytics</h2>
      
      <div className="mb-4">
        <label className="mr-2">Start Date:</label>
        <input 
          type="date" 
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateChange}
          className="mr-4 p-2 border rounded"
        />
        <label className="mr-2">End Date:</label>
        <input 
          type="date" 
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateChange}
          className="mr-4 p-2 border rounded"
        />
        <button 
          onClick={() => {
            // In a real app, you'd use this to trigger a new data fetch
            console.log("Fetch new data for", dateRange);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#8884d8" />
            <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}