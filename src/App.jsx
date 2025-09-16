import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';

// Layout Components
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import SmartSearch from './pages/SmartSearch';
import InvestmentAnalytics from './pages/InvestmentAnalytics';
import MortgageCalculator from './pages/MortgageCalculator';
import MarketInsights from './pages/MarketInsights';

// Styles
import './index.css';

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/smart-search" element={<SmartSearch />} />
                <Route path="/investment-analytics" element={<InvestmentAnalytics />} />
                <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
                <Route path="/market-insights" element={<MarketInsights />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;
