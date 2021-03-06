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

interface VolumeChartProps {
  dataSet:
    | { date: string; volume: number }[]
    | { date: string; max: number }[]
    | undefined;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ dataSet }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dataSet}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
        <Tooltip />
        <Line type="monotone" dataKey="volume" stroke="#40a9ff" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VolumeChart;
