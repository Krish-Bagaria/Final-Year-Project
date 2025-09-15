import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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

  // Mock data for development
  const mockProperties = [
    {
      id: '1',
      title: 'Luxury Penthouse with City View',
      description: 'Stunning penthouse with panoramic city views, modern amenities, and premium finishes.',
      price: 2500000,
      location: {
        address: '123 Skyline Drive',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        coordinates: { lat: 40.7589, lng: -73.9851 }
      },
      type: 'apartment',
      status: 'for-sale',
      category: 'luxury',
      bedrooms: 3,
      bathrooms: 3,
      area: 2500,
      yearBuilt: 2020,
      features: ['City View', 'Balcony', 'Modern Kitchen', 'Hardwood Floors'],
      amenities: ['Gym', 'Pool', 'Concierge', 'Parking'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
      ],
      owner: {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-0123'
      },
      isVerified: true,
      aiPricePrediction: 2550000,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Modern Family Home in Suburbs',
      description: 'Beautiful family home with spacious rooms, large backyard, and excellent schools nearby.',
      price: 750000,
      location: {
        address: '456 Oak Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        coordinates: { lat: 30.2672, lng: -97.7431 }
      },
      type: 'house',
      status: 'for-sale',
      category: 'premium',
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      yearBuilt: 2018,
      features: ['Large Backyard', 'Updated Kitchen', 'Master Suite', 'Two-Car Garage'],
      amenities: ['Near Schools', 'Shopping Center', 'Public Transport'],
      images: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800'
      ],
      owner: {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1-555-0456'
      },
      isVerified: true,
      aiPricePrediction: 780000,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'Commercial Office Space Downtown',
      description: 'Prime commercial space in downtown business district, perfect for corporate offices.',
      price: 1200000,
      location: {
        address: '789 Business Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      type: 'commercial',
      status: 'for-sale',
      category: 'commercial',
      bedrooms: 0,
      bathrooms: 2,
      area: 5000,
      yearBuilt: 2015,
      features: ['Open Floor Plan', 'High Ceilings', 'Large Windows', 'Modern HVAC'],
      amenities: ['Parking Garage', 'Security System', 'Elevator', 'Near BART'],
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
      ],
      owner: {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@example.com',
        phone: '+1-555-0789'
      },
      isVerified: true,
      aiPricePrediction: 1250000,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    }
  ];

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

  const mockMarketTrends = [
    {
      id: '1',
      location: 'New York',
      period: 'monthly',
      averagePrice: 1200000,
      priceChange: 5.2,
      volume: 1250,
      daysOnMarket: 45,
      pricePerSqFt: 1200,
      trend: 'rising',
      confidence: 85,
      dataPoints: [
        { date: '2024-01-01', value: 1150000, volume: 1200 },
        { date: '2024-02-01', value: 1180000, volume: 1100 },
        { date: '2024-03-01', value: 1200000, volume: 1250 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockStockData = [
    {
      symbol: 'REIT',
      name: 'Real Estate Investment Trust',
      price: 125.50,
      change: 2.30,
      changePercent: 1.87,
      volume: 1500000,
      marketCap: 5000000000,
      sector: 'Real Estate',
      lastUpdated: new Date()
    },
    {
      symbol: 'HD',
      name: 'Home Depot Inc.',
      price: 320.75,
      change: -1.25,
      changePercent: -0.39,
      volume: 2500000,
      marketCap: 350000000000,
      sector: 'Consumer Discretionary',
      lastUpdated: new Date()
    }
  ];

  const mockInvestmentComparison = {
    realEstate: {
      totalValue: 1000000,
      annualReturn: 8.5,
      totalReturn: 25.0,
      riskScore: 6
    },
    stocks: {
      totalValue: 1000000,
      annualReturn: 12.0,
      totalReturn: 35.0,
      riskScore: 8
    },
    period: '3 years',
    lastUpdated: new Date()
  };

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
