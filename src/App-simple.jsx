import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Real Estate Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to your real estate platform!
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Features Coming Soon
          </h2>
          <ul className="text-left space-y-2 text-gray-600">
            <li>✅ Property Listings</li>
            <li>✅ Investment Analytics</li>
            <li>✅ ROI Calculator</li>
            <li>✅ Market Trends</li>
            <li>✅ User Authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
