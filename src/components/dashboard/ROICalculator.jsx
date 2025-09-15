import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const ROICalculator = () => {
  const [formData, setFormData] = useState({
    propertyPrice: 500000,
    downPayment: 100000,
    interestRate: 6.5,
    loanTerm: 30,
    monthlyRent: 3000,
    annualExpenses: 6000,
    appreciationRate: 4.0,
  });

  const [results, setResults] = useState(null);

  const calculateROI = () => {
    const {
      propertyPrice,
      downPayment,
      interestRate,
      loanTerm,
      monthlyRent,
      annualExpenses,
      appreciationRate,
    } = formData;

    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    // Calculate monthly mortgage payment
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    // Calculate annual cash flow
    const annualRent = monthlyRent * 12;
    const annualMortgage = monthlyPayment * 12;
    const annualCashFlow = annualRent - annualMortgage - annualExpenses;

    // Calculate ROI
    const cashOnCashROI = (annualCashFlow / downPayment) * 100;
    const capRate = ((annualRent - annualExpenses) / propertyPrice) * 100;
    
    // Calculate appreciation
    const annualAppreciation = propertyPrice * (appreciationRate / 100);
    const totalAnnualReturn = annualCashFlow + annualAppreciation;
    const totalROI = (totalAnnualReturn / downPayment) * 100;

    // Calculate 5-year projection
    const projectedValue5Years = propertyPrice * Math.pow(1 + appreciationRate / 100, 5);
    const totalEquity5Years = projectedValue5Years - (loanAmount - (monthlyPayment * 12 * 5));
    const totalReturn5Years = totalEquity5Years + (annualCashFlow * 5);

    setResults({
      monthlyPayment: monthlyPayment,
      annualCashFlow: annualCashFlow,
      cashOnCashROI: cashOnCashROI,
      capRate: capRate,
      totalROI: totalROI,
      annualAppreciation: annualAppreciation,
      projectedValue5Years: projectedValue5Years,
      totalReturn5Years: totalReturn5Years,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={formData.propertyPrice}
                onChange={(e) => handleInputChange('propertyPrice', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="500000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={formData.downPayment}
                onChange={(e) => handleInputChange('downPayment', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="100000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="6.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (years)
            </label>
            <input
              type="number"
              value={formData.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Rent
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="3000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Expenses
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={formData.annualExpenses}
                onChange={(e) => handleInputChange('annualExpenses', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="6000"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Appreciation Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.appreciationRate}
              onChange={(e) => handleInputChange('appreciationRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="4.0"
            />
          </div>
        </div>

        <button
          onClick={calculateROI}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Calculator className="w-4 h-4" />
          <span>Calculate ROI</span>
        </button>
      </div>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Cash-on-Cash ROI</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(results.cashOnCashROI)}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Cap Rate</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(results.capRate)}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Total ROI</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatPercentage(results.totalROI)}
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">Monthly Payment</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(results.monthlyPayment)}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">5-Year Projection</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Projected Value:</span>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(results.projectedValue5Years)}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Total Return:</span>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(results.totalReturn5Years)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ROICalculator;
