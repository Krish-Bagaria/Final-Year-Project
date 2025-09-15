import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const InvestmentChart = ({ data }) => {
  // Mock data for demonstration
  const chartData = [
    { month: 'Jan', realEstate: 1000000, stocks: 1000000 },
    { month: 'Feb', realEstate: 1020000, stocks: 1015000 },
    { month: 'Mar', realEstate: 1050000, stocks: 1030000 },
    { month: 'Apr', realEstate: 1080000, stocks: 1020000 },
    { month: 'May', realEstate: 1100000, stocks: 1045000 },
    { month: 'Jun', realEstate: 1120000, stocks: 1060000 },
    { month: 'Jul', realEstate: 1150000, stocks: 1080000 },
    { month: 'Aug', realEstate: 1180000, stocks: 1100000 },
    { month: 'Sep', realEstate: 1200000, stocks: 1090000 },
    { month: 'Oct', realEstate: 1220000, stocks: 1115000 },
    { month: 'Nov', realEstate: 1250000, stocks: 1130000 },
    { month: 'Dec', realEstate: 1280000, stocks: 1150000 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value, name) => [formatCurrency(value), name === 'realEstate' ? 'Real Estate' : 'Stocks']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => value === 'realEstate' ? 'Real Estate' : 'Stocks'}
          />
          <Line 
            type="monotone" 
            dataKey="realEstate" 
            stroke="#0ea5e9" 
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="stocks" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentChart;
