import React, { useMemo } from 'react';
import { calculateHealthScore, formatRupee } from './calc.js';
import { usePersona } from '../../context/PersonaContext.jsx';
import { getTranslation } from '../i18n.js';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  ShieldAlert, 
  PiggyBank, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function HealthScore({ persona }) {
  const { lang } = usePersona();
  const t = getTranslation(lang);

  const healthData = useMemo(() => {
    return calculateHealthScore(persona);
  }, [persona]);

  const { totalScore, tier, scoreDelta, scoreDrivers, factors, financials } = healthData;

  // Gauge angle calculation (180 degree semi-circle arc: from -90 to +90 degrees)
  const clampedScore = Math.max(0, Math.min(100, totalScore));
  const radius = 90;
  const circumference = Math.PI * radius; // 282.74
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Determine tier metadata
  const tierMeta = {
    healthy: {
      label: t.healthScore.status.healthy,
      subtext: 'Your finances have strong resilience against unexpected disruptions.',
      color: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      arcColor: '#059669', // emerald-600
    },
    moderate: {
      label: t.healthScore.status.moderate,
      subtext: 'Basic stability achieved, but key insurance or liquidity buffers are thin.',
      color: 'text-sky-700',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      arcColor: '#0284c7', // sky-600
    },
    vulnerable: {
      label: t.healthScore.status.vulnerable,
      subtext: 'High sensitivity to cashflow disruptions. Prioritize emergency fund & term protection.',
      color: 'text-amber-700',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      arcColor: '#d97706', // amber-600
    }
  }[tier] || {
    label: t.healthScore.status.moderate,
    subtext: '',
    color: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    arcColor: '#059669',
  };

  // Weakest factor identification for personalized coaching tip
  const weakestFactor = useMemo(() => {
    return [...factors].sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore))[0];
  }, [factors]);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-[#E8E2D5] pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <span>{t.healthScore.overallRating}</span>
          <span aria-hidden="true">·</span>
          <span>CashHelix Wellness Index</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-[#24232A] font-semibold tracking-tight">
          {t.healthScore.title}
        </h2>
        <p className="text-sm text-[#55524B] mt-1 max-w-2xl leading-relaxed">
          {t.healthScore.subtitle}
        </p>
      </div>

      {/* Main Score & Gauge Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Gauge Visualization */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative pt-2">
            <div className="relative w-56 h-32 flex items-center justify-center overflow-hidden">
              <svg className="w-56 h-56 transform -rotate-180 origin-center" viewBox="0 0 220 220">
                {/* Background Track Arc */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="transparent"
                  stroke="#E8E2D5"
                  strokeWidth="16"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                />
                {/* Colored Fill Arc */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="transparent"
                  stroke={tierMeta.arcColor}
                  strokeWidth="16"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Central Big Number */}
              <div className="absolute top-12 flex flex-col items-center text-center">
                <span className="text-5xl font-serif font-bold text-[#24232A] tracking-tight">
                  {clampedScore}
                </span>
                <span className="text-xs uppercase tracking-wider text-[#736F66] font-medium mt-0.5">
                  {t.healthScore.gaugeLabel}
                </span>
              </div>
            </div>

            {/* Score Range Legend */}
            <div className="w-full max-w-xs flex justify-between text-[11px] text-[#736F66] font-mono border-t border-[#F0EBE0] pt-2 px-2">
              <span>0 (Vulnerable)</span>
              <span>50 (Moderate)</span>
              <span>100 (Resilient)</span>
            </div>
          </div>

          {/* Qualitative Summary & Tier Card */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${tierMeta.badgeBg}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {tierMeta.label}
              </span>
              {scoreDelta !== 0 && (
                <span className={`inline-flex items-center text-xs font-medium ${scoreDelta > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {scoreDelta > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 mr-1" />
                  )}
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts vs last month
                </span>
              )}
            </div>

            <p className="text-[#3A3832] text-sm leading-relaxed">
              {tierMeta.subtext}
            </p>

            {/* Quick KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#FAF7F0] rounded-xl p-3 border border-[#EBE5D8]">
                <div className="text-[11px] text-[#736F66] uppercase tracking-wider font-medium">Monthly Inflow</div>
                <div className="text-base font-semibold text-[#24232A] mt-0.5 font-mono">
                  {formatRupee(financials.monthlyIncome)}
                </div>
              </div>
              <div className="bg-[#FAF7F0] rounded-xl p-3 border border-[#EBE5D8]">
                <div className="text-[11px] text-[#736F66] uppercase tracking-wider font-medium">Liquid Buffer</div>
                <div className="text-base font-semibold text-[#24232A] mt-0.5 font-mono">
                  {financials.emergencyMonths} mos
                </div>
              </div>
              <div className="bg-[#FAF7F0] rounded-xl p-3 border border-[#EBE5D8] col-span-2 sm:col-span-1">
                <div className="text-[11px] text-[#736F66] uppercase tracking-wider font-medium">Net Debt</div>
                <div className="text-base font-semibold text-[#24232A] mt-0.5 font-mono">
                  {formatRupee(financials.totalDebt)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Factor Breakdown Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[#24232A]">
            Factor Evaluation Breakdown
          </h3>
          <span className="text-xs text-[#736F66]">
            Weighted 25 points each
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map((factor) => {
            const pct = Math.round((factor.score / factor.maxScore) * 100);
            return (
              <div key={factor.id} className="bg-white rounded-xl border border-[#E8E2D5] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-[#24232A]">
                        {t.healthScore.factors[factor.id === 'savings' ? 'savingsRate' : factor.id === 'dti' ? 'debtToIncome' : factor.id === 'insurance' ? 'insuranceCoverage' : 'emergencyBuffer'] || factor.label}
                      </h4>
                      <p className="text-xs text-[#736F66] mt-0.5">
                        {factor.benchmark}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-serif font-bold text-[#24232A]">
                        {factor.score}
                      </span>
                      <span className="text-xs text-[#736F66]">/25</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-[#55524B] font-medium">Current Metric:</span>
                    <span className="font-semibold text-[#24232A] font-mono">{factor.value}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#EBE5D8] rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-700 ${
                        pct >= 80 ? 'bg-emerald-600' : pct >= 50 ? 'bg-sky-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-[11px] text-[#736F66]">
                  <span>Status:</span>
                  <span className={`font-medium capitalize ${
                    factor.status === 'optimal' ? 'text-emerald-700' : factor.status === 'fair' ? 'text-sky-700' : 'text-amber-700'
                  }`}>
                    {t.common[factor.status] || factor.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "What Moved Your Score This Month" Explainer */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE0] pb-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#24232A]">
              {t.healthScore.whatMovedScore}
            </h3>
            <p className="text-xs text-[#736F66] mt-0.5">
              {t.healthScore.vsPrevious30Days}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 bg-[#FAF7F0] border border-[#E8E2D5] rounded-md text-[#3A3832]">
              Net Drift: {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {scoreDrivers.map((driver, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FCFAF5] border border-[#EFE9DC] hover:border-[#DFD7C7] transition-colors"
            >
              <div className="mt-0.5 p-1 rounded-md shrink-0">
                {driver.type === 'positive' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                ) : driver.type === 'negative' ? (
                  <TrendingDown className="w-4 h-4 text-amber-700" />
                ) : (
                  <Clock className="w-4 h-4 text-[#736F66]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-[#24232A]">
                    {driver.title}
                  </h4>
                  <span className={`text-xs font-mono font-semibold ${
                    driver.type === 'positive' ? 'text-emerald-700' : driver.type === 'negative' ? 'text-amber-700' : 'text-[#736F66]'
                  }`}>
                    {driver.points} pts
                  </span>
                </div>
                <p className="text-xs text-[#55524B] mt-1 leading-relaxed">
                  {driver.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weakest Factor Recommended Next Step */}
      {weakestFactor && (
        <div className="bg-[#F4F9F4] border border-emerald-200/80 rounded-2xl p-5">
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-emerald-100/70 text-emerald-800 rounded-lg shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                {t.healthScore.tipsHeader}
              </div>
              <h4 className="text-sm font-semibold text-[#24232A] mt-0.5">
                Target your {weakestFactor.label} (Current Score: {weakestFactor.score}/25)
              </h4>
              <p className="text-xs text-[#4A4740] mt-1.5 leading-relaxed">
                {weakestFactor.id === 'savings' && 'Automate a recurring deposit on payday to lock in at least 15% before discretionary expenditures take over.'}
                {weakestFactor.id === 'dti' && 'Explore debt consolidation or prepay highest-interest loan tranches to bring monthly obligations under 30% of income.'}
                {weakestFactor.id === 'insurance' && 'Acquire a pure term policy and family floater health cover to protect against catastrophic medical drains.'}
                {weakestFactor.id === 'emergency' && 'Build an emergency liquid reserve of at least 3 months essential expenses in a high-yield sweep FD or liquid fund.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
