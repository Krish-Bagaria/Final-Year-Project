import React, { useMemo, useState } from 'react';

const MortgageCalculator = () => {
  const [principal, setPrincipal] = useState(5000000);
  const [annualRate, setAnnualRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const monthlyPayment = useMemo(() => {
    const r = annualRate / 12 / 100;
    const n = years * 12;
    if (r === 0) return principal / n;
    return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }, [principal, annualRate, years]);

  const formatINR = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mortgage Calculator</h1>
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">Loan Amount (INR)</span>
            <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Annual Interest Rate (%)</span>
            <input type="number" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Tenure (years)</span>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
          <div className="text-lg font-semibold">Estimated EMI: {formatINR(monthlyPayment)}</div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;


