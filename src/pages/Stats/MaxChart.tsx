import React from 'react';
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from 'recharts';

interface MaxChartProps {
  dataSet:
    | { date: string; max: number }[]
    | { date: string; volume: number }[]
    | undefined;
}

const MaxChart: React.FC<MaxChartProps> = ({ dataSet }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dataSet}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
        <Tooltip />
        <Line type="monotone" dataKey="max" stroke="#40a9ff" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MaxChart;
