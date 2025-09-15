import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Home as HomeIcon, 
  TrendingUp, 
  Shield, 
  Users, 
  Star,
  ArrowRight,
  BarChart3,
  Calculator,
  Target
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import PropertyCard from '../components/property/PropertyCard';
import HeroSection from '../components/ui/HeroSection';
import FeatureSection from '../components/ui/FeatureSection';
import StatsSection from '../components/ui/StatsSection';
import TestimonialSection from '../components/ui/TestimonialSection';

const Home = () => {
  const { properties } = useDashboard();

  const featuredProperties = properties.slice(0, 3);

  const features = [
    {
      icon: Search,
      title: 'Smart Property Search',
      description: 'AI-powered search with advanced filters to find your perfect property',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: BarChart3,
      title: 'Investment Analytics',
      description: 'Comprehensive ROI analysis and market trend predictions',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Shield,
      title: 'Verified Properties',
      description: 'All properties are verified and fraud-protected for your safety',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Users,
      title: 'Expert Agents',
      description: 'Connect with certified real estate professionals',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Calculator,
      title: 'Mortgage Calculator',
      description: 'Calculate your monthly payments and total costs',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: Target,
      title: 'Market Insights',
      description: 'Real-time market data and investment opportunities',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
  ];

  const stats = [
    { label: 'Properties Listed', value: '10,000+', icon: HomeIcon },
    { label: 'Happy Customers', value: '5,000+', icon: Users },
    { label: 'Cities Covered', value: '50+', icon: MapPin },
    { label: 'Success Rate', value: '98%', icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Investor',
      content: 'RealEstatePro helped me find the perfect investment property. The ROI calculator and market insights were incredibly valuable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Michael Chen',
      role: 'First-time Buyer',
      content: 'The platform made buying my first home so much easier. The virtual tours and detailed property information were amazing.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Real Estate Agent',
      content: 'As an agent, this platform has revolutionized how I work with clients. The tools and analytics are top-notch.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection features={features} />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties with 
              excellent investment potential and modern amenities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard
                  property={property}
                  onViewDetails={() => {}}
                  onContactOwner={() => {}}
                  onSaveProperty={() => {}}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/properties"
              className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              View All Properties
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSection testimonials={testimonials} />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect 
              property with our advanced search and investment tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Browse Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
