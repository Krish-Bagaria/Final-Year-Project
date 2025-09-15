import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  BarChart3,
  PieChart,
  Target,
  Calendar,
  Plus,
  Eye,
  Filter
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import ROICalculator from '../components/dashboard/ROICalculator';
import InvestmentChart from '../components/charts/InvestmentChart';
import MarketTrendChart from '../components/charts/MarketTrendChart';
import PropertyPerformanceChart from '../components/charts/PropertyPerformanceChart';
import RecentProperties from '../components/dashboard/RecentProperties';
import QuickStats from '../components/dashboard/QuickStats';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    properties, 
    roiData, 
    marketTrends, 
    stockData, 
    investmentComparison,
    loading 
  } = useDashboard();
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('1Y');
  const [selectedView, setSelectedView] = useState('overview');

  const timeRanges = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: '3Y', label: '3 Years' },
    { value: '5Y', label: '5 Years' },
  ];

  const views = [
    { value: 'overview', label: 'Overview', icon: BarChart3 },
    { value: 'properties', label: 'Properties', icon: Home },
    { value: 'analytics', label: 'Analytics', icon: PieChart },
    { value: 'roi', label: 'ROI Analysis', icon: Target },
  ];

  // Calculate dashboard metrics
  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, property) => sum + property.price, 0);
  const averageROI = roiData.length > 0 
    ? roiData.reduce((sum, roi) => sum + roi.totalROI, 0) / roiData.length 
    : 0;
  const totalRentalIncome = roiData.reduce((sum, roi) => sum + roi.annualRent, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's your real estate investment overview
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {timeRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Selector */}
              <div className="flex border border-gray-300 rounded-lg">
                {views.map((view) => {
                  const Icon = view.icon;
                  return (
                    <button
                      key={view.value}
                      onClick={() => setSelectedView(view.value)}
                      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        selectedView === view.value
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{view.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <QuickStats
          totalProperties={totalProperties}
          totalValue={totalValue}
          averageROI={averageROI}
          totalRentalIncome={totalRentalIncome}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Investment Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Investment Performance
                </h2>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">
                    +{formatPercentage(averageROI)}
                  </span>
                </div>
              </div>
              <InvestmentChart data={investmentComparison} />
            </motion.div>

            {/* Market Trends Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Market Trends
                </h2>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary-500" />
                  <span className="text-sm text-gray-600">
                    {marketTrends.length} markets tracked
                  </span>
                </div>
              </div>
              <MarketTrendChart data={marketTrends} />
            </motion.div>

            {/* Property Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Property Performance
                </h2>
                <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  View All
                </button>
              </div>
              <PropertyPerformanceChart data={roiData} />
            </motion.div>
          </div>

          {/* Right Column - Tools & Recent Activity */}
          <div className="space-y-8">
            {/* ROI Calculator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Target className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  ROI Calculator
                </h2>
              </div>
              <ROICalculator />
            </motion.div>

            {/* Recent Properties */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Properties
                </h2>
                <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  View All
                </button>
              </div>
              <RecentProperties properties={properties.slice(0, 3)} />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200">
                  <Plus className="w-5 h-5 text-primary-500" />
                  <span className="text-primary-700 font-medium">Add New Property</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">Browse Properties</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">Advanced Search</span>
                </button>
              </div>
            </motion.div>

            {/* Market Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <h2 className="text-xl font-semibold mb-4">Market Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary-100">Average Price</span>
                  <span className="font-semibold">
                    {formatCurrency(marketTrends[0]?.averagePrice || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-100">Price Change</span>
                  <span className={`font-semibold ${
                    (marketTrends[0]?.priceChange || 0) >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {formatPercentage(marketTrends[0]?.priceChange || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-100">Properties Listed</span>
                  <span className="font-semibold">
                    {marketTrends[0]?.volume || 0}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
