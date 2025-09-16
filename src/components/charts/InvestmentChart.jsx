import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const InvestmentChart = ({ data }) => {
  // Mock data for demonstration (INR)
  const chartData = [
    { month: 'Jan', realEstate: 10000000 },
    { month: 'Feb', realEstate: 10200000 },
    { month: 'Mar', realEstate: 10500000 },
    { month: 'Apr', realEstate: 10800000 },
    { month: 'May', realEstate: 11000000 },
    { month: 'Jun', realEstate: 11200000 },
    { month: 'Jul', realEstate: 11500000 },
    { month: 'Aug', realEstate: 11800000 },
    { month: 'Sep', realEstate: 12000000 },
    { month: 'Oct', realEstate: 12200000 },
    { month: 'Nov', realEstate: 12500000 },
    { month: 'Dec', realEstate: 12800000 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
            formatter={(value, name) => [formatCurrency(value), 'Real Estate']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={() => 'Real Estate'} />
          <Line 
            type="monotone" 
            dataKey="realEstate" 
            stroke="#0ea5e9" 
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentChart;
