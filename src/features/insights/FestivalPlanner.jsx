import React, { useMemo, useState } from 'react';
import { buildFestivalPlan, formatRupee } from './calc.js';
import { usePersona } from '../../context/PersonaContext.jsx';
import { getTranslation } from '../i18n.js';
import { 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Coins, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Plus
} from 'lucide-react';

export default function FestivalPlanner({ persona }) {
  const { lang } = usePersona();
  const t = getTranslation(lang);

  const plan = useMemo(() => {
    return buildFestivalPlan(persona);
  }, [persona]);

  const { monthlySurplus, activeMilestones, totalRequiredMonthly, monthBudgets, isSurplusHealthy } = plan;

  const [simulatedContribution, setSimulatedContribution] = useState(totalRequiredMonthly);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-[#E8E2D5] pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <span>{t.festivalPlanner.title}</span>
          <span aria-hidden="true">·</span>
          <span>Seasonal Cashflow Forecaster</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-[#24232A] font-semibold tracking-tight">
          {t.festivalPlanner.title}
        </h2>
        <p className="text-sm text-[#55524B] mt-1 max-w-2xl leading-relaxed">
          {t.festivalPlanner.subtitle}
        </p>
      </div>

      {/* Monthly Surplus & Recommendation Hero */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#736F66]">
              {t.festivalPlanner.monthlySurplus}
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className={`text-4xl sm:text-5xl font-serif font-bold tracking-tight font-mono ${
                monthlySurplus >= 0 ? 'text-[#24232A]' : 'text-rose-700'
              }`}>
                {formatRupee(monthlySurplus)}
              </span>
              <span className="text-xs text-[#736F66]">
                {t.common.monthly}
              </span>
            </div>
            <p className="text-xs text-[#55524B] mt-2 leading-relaxed">
              {t.festivalPlanner.surplusNote}
            </p>
            {!isSurplusHealthy && (
              <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                <span>{t.festivalPlanner.deficitWarning}</span>
              </div>
            )}
          </div>

          {/* Action Callout Box */}
          <div className="md:col-span-5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Smart Recommendation</span>
            </div>
            <h3 className="text-sm font-semibold text-[#24232A]">
              {t.festivalPlanner.startSaving}:
            </h3>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1 font-mono">
              {formatRupee(totalRequiredMonthly)}{t.common.monthly}
            </div>
            <p className="text-xs text-[#55524B] mt-1.5 leading-relaxed">
              Fully funds all {activeMilestones.length} upcoming seasonal events and fees with zero credit card debt.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Milestones Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[#24232A]">
            {t.festivalPlanner.overallTimeline}
          </h3>
          <span className="text-xs text-[#736F66]">
            Sorted by calendar schedule
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMilestones.map(m => {
            const isCompleted = m.currentSaved >= m.targetBudget;
            return (
              <div key={m.id} className="bg-white rounded-xl border border-[#E8E2D5] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                        {m.category}
                      </span>
                      <h4 className="text-base font-semibold text-[#24232A] mt-0.5">
                        {t.festivalPlanner.festivals[m.nameKey] || m.defaultName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#736F66] mt-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#8A8478]" />
                        <span>{m.month}</span>
                        <span aria-hidden="true">·</span>
                        <span>{m.monthsLeft} {t.festivalPlanner.monthsRemaining}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#736F66] block">{t.festivalPlanner.target}</span>
                      <span className="text-base font-serif font-bold text-[#24232A] font-mono">
                        {formatRupee(m.targetBudget)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-[#55524B] mb-1">
                      <span>{t.festivalPlanner.allocated}: <strong className="text-[#24232A] font-mono">{formatRupee(m.currentSaved)}</strong></span>
                      <span className="font-semibold text-emerald-800">{m.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-[#EBE5D8] rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full bg-emerald-700 transition-all duration-700"
                        style={{ width: `${m.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Monthly Recommendation footer */}
                <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                  <span className="text-[#666258]">{t.festivalPlanner.suggestedSIP}:</span>
                  <span className="font-mono font-semibold text-emerald-800">
                    {isCompleted ? t.festivalPlanner.readyToCelebrate : `${formatRupee(m.suggestedMonthlySaving)}${t.common.monthly}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month-by-Month Mini Budget Forecast */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#F0EBE0] pb-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#24232A]">
              Month-by-Month Cashflow Allocation Plan
            </h3>
            <p className="text-xs text-[#736F66]">
              Projected surplus distribution across subsequent 4 calendar months
            </p>
          </div>
          <span className="text-xs font-mono text-[#55524B]">
            Automated from average surplus
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {monthBudgets.map((b, idx) => (
            <div key={idx} className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-[#24232A]">{b.month}</span>
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                  b.status === 'Fundable' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {b.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#55524B]">
                <div className="flex justify-between">
                  <span>Net Surplus:</span>
                  <span className="font-mono font-semibold text-[#24232A]">{formatRupee(b.surplus)}</span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Festival SIP:</span>
                  <span className="font-mono font-semibold">-{formatRupee(b.allocatedFestivals)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E8E2D5]">
                  <span>Emergency Fund:</span>
                  <span className="font-mono font-semibold text-[#24232A]">{formatRupee(b.retainedEmergencyBuffer)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
