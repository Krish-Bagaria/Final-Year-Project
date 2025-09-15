import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-primary-500 mb-4">404</div>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. 
              The page might have been moved, deleted, or doesn't exist.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Looking for something specific?
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Try searching for properties, or browse our popular categories:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                to="/properties?type=apartment"
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors duration-200"
              >
                Apartments
              </Link>
              <Link
                to="/properties?type=house"
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors duration-200"
              >
                Houses
              </Link>
              <Link
                to="/properties?type=commercial"
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors duration-200"
              >
                Commercial
              </Link>
              <Link
                to="/properties?category=luxury"
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors duration-200"
              >
                Luxury
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
