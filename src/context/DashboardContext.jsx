import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import propertiesIN from '../sampleData/properties.in.json';
import marketTrendsIN from '../sampleData/marketTrends.in.json';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [roiData, setRoiData] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [investmentComparison, setInvestmentComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Indian sample data for development
  const mockProperties = propertiesIN.map(p => ({
    ...p,
    price: p.priceINR ?? p.price,
    aiPricePrediction: p.aiPricePredictionINR ?? p.aiPricePrediction
  }));

  const mockROIData = [
    {
      propertyId: '1',
      currentValue: 2500000,
      purchasePrice: 2000000,
      monthlyRent: 12000,
      annualRent: 144000,
      rentalYield: 5.76,
      appreciationRate: 8.5,
      totalROI: 14.26,
      cashFlow: 8000,
      capRate: 5.76,
      grossYield: 7.2,
      netYield: 5.76,
      breakEvenYears: 12,
      projectedValue5Years: 3750000,
      projectedValue10Years: 5600000,
      lastUpdated: new Date()
    },
    {
      propertyId: '2',
      currentValue: 750000,
      purchasePrice: 650000,
      monthlyRent: 3500,
      annualRent: 42000,
      rentalYield: 5.6,
      appreciationRate: 6.2,
      totalROI: 11.8,
      cashFlow: 2500,
      capRate: 5.6,
      grossYield: 6.46,
      netYield: 5.6,
      breakEvenYears: 15,
      projectedValue5Years: 1010000,
      projectedValue10Years: 1360000,
      lastUpdated: new Date()
    }
  ];

  const mockMarketTrends = marketTrendsIN.map(t => ({
    ...t,
    location: `${t.city} - ${t.area}`,
    averagePrice: t.averagePriceINR ?? t.averagePrice,
    pricePerSqFt: t.pricePerSqFtINR ?? t.pricePerSqFt,
    dataPoints: (t.dataPoints || []).map(dp => ({
      date: dp.date,
      value: dp.valueINR ?? dp.value,
      volume: dp.volume
    }))
  }));

  const mockStockData = [];
  const mockInvestmentComparison = null;

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProperties(mockProperties);
      setRoiData(mockROIData);
      setMarketTrends(mockMarketTrends);
      setStockData(mockStockData);
      setInvestmentComparison(mockInvestmentComparison);
      
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setError('Failed to refresh data');
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const value = {
    properties,
    roiData,
    marketTrends,
    stockData,
    investmentComparison,
    loading,
    error,
    refreshData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
