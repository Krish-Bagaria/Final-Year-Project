import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const MarketTrendChart = ({ data }) => {
  // Mock data for demonstration
  const chartData = [
    { city: 'New York', price: 1200000, change: 5.2, volume: 1250 },
    { city: 'Los Angeles', price: 950000, change: 3.8, volume: 980 },
    { city: 'Chicago', price: 650000, change: 2.1, volume: 1100 },
    { city: 'Houston', price: 450000, change: 4.5, volume: 850 },
    { city: 'Phoenix', price: 520000, change: 6.2, volume: 750 },
    { city: 'Philadelphia', price: 580000, change: 3.1, volume: 650 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="city" 
            stroke="#666"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'price') return [formatCurrency(value), 'Average Price'];
              if (name === 'change') return [formatPercentage(value), 'Price Change'];
              if (name === 'volume') return [value, 'Properties Listed'];
              return [value, name];
            }}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="price" 
            fill="#0ea5e9" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketTrendChart;
