import React, { useState } from 'react';
import { usePersona } from '../context/PersonaContext.jsx';
import { getTranslation } from '../i18n.js';
import { getMonthlyFinancials, formatRupee } from '../features/insights/calc.js';
import HealthScore from '../features/insights/HealthScore.jsx';
import HiddenCharges from '../features/insights/HiddenCharges.jsx';
import InsuranceGaps from '../features/insights/InsuranceGaps.jsx';
import FestivalPlanner from '../features/insights/FestivalPlanner.jsx';
import { 
  HeartPulse, 
  SearchX, 
  ShieldAlert, 
  CalendarRange
} from 'lucide-react';

export default function Insights({ persona: propPersona }) {
  const { persona: contextPersona, lang } = usePersona();
  const persona = propPersona || contextPersona;
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState('healthScore');

  const financials = getMonthlyFinancials(persona);

  // Tab definitions
  const tabs = [
    {
      id: 'healthScore',
      label: t.tabs.healthScore,
      icon: HeartPulse,
      badge: '0-100',
    },
    {
      id: 'hiddenCharges',
      label: t.tabs.hiddenCharges,
      icon: SearchX,
      badge: 'Audit',
    },
    {
      id: 'insuranceGaps',
      label: t.tabs.insuranceGaps,
      icon: ShieldAlert,
      badge: 'Protection',
    },
    {
      id: 'festivalPlanner',
      label: t.tabs.festivalPlanner,
      icon: CalendarRange,
      badge: 'Budget',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-28">
      
      {/* Modern Wealth Editorial: Signature Net-Worth & Liquid Health Overview */}
      <section className="bg-white rounded-2xl border border-[#E8E2D5] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F0EBE0] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <span>{persona.city || 'India'}</span>
              <span aria-hidden="true">·</span>
              <span>{persona.income.type === 'regular' ? 'Salaried Regular' : 'Variable Inflows'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#24232A] mt-1">
              {persona.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#55524B] mt-1">
              {persona.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-[#736F66] block font-medium">
                Liquid Reserve
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 font-mono">
                {formatRupee(financials.liquidAssets)}
              </span>
            </div>
          </div>
        </div>

        {/* Elegant Editorial Progress Indicator Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#736F66] font-medium">Monthly Inflow</div>
            <div className="text-lg font-semibold text-[#24232A] mt-0.5 font-mono">
              {formatRupee(financials.monthlyIncome)}
            </div>
            <div className="text-[11px] text-[#736F66] mt-0.5">Average net income</div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#736F66] font-medium">Monthly Surplus</div>
            <div className={`text-lg font-semibold mt-0.5 font-mono ${financials.monthlySurplus >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
              {formatRupee(financials.monthlySurplus)}
            </div>
            <div className="text-[11px] text-[#736F66] mt-0.5">After living & EMI costs</div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#736F66] font-medium">Debt Obligations</div>
            <div className="text-lg font-semibold text-[#24232A] mt-0.5 font-mono">
              {formatRupee(financials.totalDebt)}
            </div>
            <div className="text-[11px] text-[#736F66] mt-0.5">DTI: {financials.dti}%</div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#736F66] font-medium">Emergency Cushion</div>
            <div className="text-lg font-semibold text-[#24232A] mt-0.5 font-mono">
              {financials.emergencyMonths} <span className="text-xs font-sans font-normal text-[#736F66]">months</span>
            </div>
            <div className="text-[11px] text-[#736F66] mt-0.5">Target: 3+ months</div>
          </div>
        </div>
      </section>

      {/* Tabbed Navigation Bar */}
      <nav className="flex items-center gap-2 p-1.5 bg-[#EFE9DC]/70 rounded-2xl border border-[#E5DECF] overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-white text-[#24232A] shadow-xs'
                  : 'text-[#635F56] hover:text-[#24232A] hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-800' : 'text-[#7D786E]'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-[#E3DCCE]/50 text-[#7D786E]'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Active Tab Content Section */}
      <main className="min-h-[420px]">
        {activeTab === 'healthScore' && <HealthScore persona={persona} />}
        {activeTab === 'hiddenCharges' && <HiddenCharges persona={persona} />}
        {activeTab === 'insuranceGaps' && <InsuranceGaps persona={persona} />}
        {activeTab === 'festivalPlanner' && <FestivalPlanner persona={persona} />}
      </main>

    </div>
  );
}
