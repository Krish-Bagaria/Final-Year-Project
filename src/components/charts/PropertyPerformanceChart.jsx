import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PropertyPerformanceChart = ({ data }) => {
  // Mock data for demonstration
  const chartData = [
    { property: 'Luxury Penthouse', roi: 12.5, value: 2500000 },
    { property: 'Family Home', roi: 8.2, value: 750000 },
    { property: 'Commercial Space', roi: 6.8, value: 1200000 },
    { property: 'Apartment Unit', roi: 9.1, value: 450000 },
    { property: 'Townhouse', roi: 7.5, value: 650000 },
  ];

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getBarColor = (roi) => {
    if (roi >= 10) return '#10b981'; // Green for high ROI
    if (roi >= 7) return '#0ea5e9'; // Blue for medium ROI
    if (roi >= 5) return '#f59e0b'; // Orange for low ROI
    return '#ef4444'; // Red for very low ROI
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="property" 
            stroke="#666"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickFormatter={formatPercentage}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'roi') return [formatPercentage(value), 'ROI'];
              if (name === 'value') return [formatCurrency(value), 'Property Value'];
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
          <Bar dataKey="roi" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.roi)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PropertyPerformanceChart;
