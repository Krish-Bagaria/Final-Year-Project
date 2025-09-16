import React from 'react';
import MarketTrendChart from '../components/charts/MarketTrendChart';
import { useDashboard } from '../context/DashboardContext';

const MarketInsights = () => {
  const { marketTrends } = useDashboard();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Market Insights</h1>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <MarketTrendChart data={marketTrends} />
          <div className="text-sm text-gray-500 mt-4">Select an area to view trends. AI predictions coming soon.</div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;


