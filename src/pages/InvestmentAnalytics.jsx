import React from 'react';
import InvestmentChart from '../components/charts/InvestmentChart';
import { useDashboard } from '../context/DashboardContext';

const InvestmentAnalytics = () => {
  const { roiData } = useDashboard();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Investment Analytics</h1>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <InvestmentChart data={roiData} />
          <div className="text-sm text-gray-500 mt-4">Future AI predictions will appear here.</div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentAnalytics;


