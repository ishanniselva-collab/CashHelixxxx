import React, { useState } from 'react';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {isOpen && (
        <div className="mb-3 p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-emerald-400">CashHelix Voice</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
          <div>Coming soon</div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Voice Assistant"
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    </div>
  );
}
