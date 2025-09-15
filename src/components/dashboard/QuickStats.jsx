import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const QuickStats = ({ 
  totalProperties, 
  totalValue, 
  averageROI, 
  totalRentalIncome 
}) => {
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

  const stats = [
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: Home,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      change: '+2',
      changeType: 'positive',
    },
    {
      title: 'Total Value',
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      title: 'Average ROI',
      value: formatPercentage(averageROI),
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      change: '+2.1%',
      changeType: 'positive',
    },
    {
      title: 'Annual Rental Income',
      value: formatCurrency(totalRentalIncome),
      icon: Calendar,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      change: '+8.3%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'positive' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">
                {stat.title}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickStats;
