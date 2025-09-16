import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MarketTrendChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      city: item.city || item.location,
      price: item.averagePrice,
      change: item.priceChange,
      volume: item.volume
    }));
  }, [data]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
