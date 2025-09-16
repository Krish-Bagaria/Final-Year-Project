import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const SmartSearch = () => {
  const { properties } = useDashboard();
  const [query, setQuery] = useState('');
  const results = properties.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.location.city.toLowerCase().includes(query.toLowerCase()) ||
    (p.location.area || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Smart Property Search</h1>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, area or title"
            className="flex-1 outline-none"
          />
        </div>
        <div className="text-gray-600 mb-2">Results: {results.length}</div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ul className="divide-y">
            {results.map(r => (
              <li key={r.id} className="py-3">
                <div className="font-medium text-gray-900">{r.title}</div>
                <div className="text-sm text-gray-600">{r.location.city} {r.location.area ? `- ${r.location.area}` : ''}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;


