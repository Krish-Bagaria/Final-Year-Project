// 🏡 Real Estate Platform - TypeScript Types

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: 'apartment' | 'house' | 'villa' | 'commercial' | 'land' | 'office';
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  category: 'luxury' | 'premium' | 'standard' | 'budget' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq ft
  yearBuilt: number;
  features: string[];
  amenities: string[];
  images: string[];
  virtualTour?: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  isVerified: boolean;
  aiPricePrediction?: number;
  roi?: ROIAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

export interface ROIAnalysis {
  propertyId: string;
  currentValue: number;
  purchasePrice: number;
  monthlyRent: number;
  annualRent: number;
  rentalYield: number; // percentage
  appreciationRate: number; // percentage per year
  totalROI: number; // percentage
  cashFlow: number; // monthly
  capRate: number; // percentage
  grossYield: number; // percentage
  netYield: number; // percentage
  breakEvenYears: number;
  projectedValue5Years: number;
  projectedValue10Years: number;
  lastUpdated: Date;
}

export interface MarketTrend {
  id: string;
  location: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  averagePrice: number;
  priceChange: number; // percentage
  volume: number;
  daysOnMarket: number;
  pricePerSqFt: number;
  trend: 'rising' | 'falling' | 'stable';
  confidence: number; // 0-100
  dataPoints: TrendDataPoint[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  volume?: number;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  lastUpdated: Date;
}

export interface InvestmentComparison {
  realEstate: {
    totalValue: number;
    annualReturn: number;
    totalReturn: number;
    riskScore: number;
  };
  stocks: {
    totalValue: number;
    annualReturn: number;
    totalReturn: number;
    riskScore: number;
  };
  period: string;
  lastUpdated: Date;
}

export interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  propertyType: string[];
  bedrooms: number[];
  bathrooms: number[];
  areaRange: {
    min: number;
    max: number;
  };
  location: string[];
  features: string[];
  amenities: string[];
  category: string[];
  yearBuilt: {
    min: number;
    max: number;
  };
}

export interface SearchParams {
  query?: string;
  filters: FilterOptions;
  sortBy: 'price' | 'area' | 'date' | 'roi' | 'rating';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'agent';
  phone?: string;
}

export interface DashboardContextType {
  properties: Property[];
  roiData: ROIAnalysis[];
  marketTrends: MarketTrend[];
  stockData: StockData[];
  investmentComparison: InvestmentComparison | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  type: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: string[];
  amenities: string[];
  images: File[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
}

export interface MortgageCalculatorData {
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number; // in years
  propertyTax: number; // annual
  insurance: number; // annual
  pmi: number; // annual
  hoa: number; // monthly
}

export interface MortgageResult {
  monthlyPayment: number;
  principal: number;
  interest: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
  hoa: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  payoffDate: Date;
}

// Component Props Types
export interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onContactOwner: (property: Property) => void;
  onSaveProperty: (propertyId: string) => void;
  isSaved?: boolean;
}

export interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  onPropertyClick: (property: Property) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface ROICalculatorProps {
  property: Property;
  onCalculate: (data: ROIAnalysis) => void;
}

export interface ChartProps {
  data: ChartData;
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  title?: string;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export interface FilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}

// API Response Types
export interface PropertyListResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MarketTrendResponse {
  trends: MarketTrend[];
  summary: {
    averagePrice: number;
    priceChange: number;
    volume: number;
    trend: string;
  };
}

export interface StockDataResponse {
  stocks: StockData[];
  lastUpdated: Date;
}

// Utility Types
export type SortOption = 'price' | 'area' | 'date' | 'roi' | 'rating';
export type SortOrder = 'asc' | 'desc';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land' | 'office';
export type PropertyStatus = 'for-sale' | 'for-rent' | 'sold' | 'rented';
export type PropertyCategory = 'luxury' | 'premium' | 'standard' | 'budget' | 'commercial';
export type UserRole = 'buyer' | 'seller' | 'agent' | 'admin';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
