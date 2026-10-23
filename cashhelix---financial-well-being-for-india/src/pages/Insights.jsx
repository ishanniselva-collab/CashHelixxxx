import React from 'react';

export default function Insights() {
  return (
    <div className="p-4 md:p-6 text-center text-slate-500">
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm max-w-md mx-auto">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Financial Insights</h3>
        <p className="text-xs text-slate-500">Coming soon</p>
      </div>
    </div>
  );
}
