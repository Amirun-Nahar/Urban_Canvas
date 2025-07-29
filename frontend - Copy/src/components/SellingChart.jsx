import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const SellingChart = () => {
  const { data: salesData, isLoading } = useQuery({
    queryKey: ['sales-chart'],
    queryFn: async () => {
      const response = await axios.get('/api/properties/agent/sales-chart');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <h2 className="mb-4 text-xl font-semibold">Selling Statistics</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={salesData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#10B981" name="Sold Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SellingChart; 