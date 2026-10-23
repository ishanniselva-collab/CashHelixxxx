import React, { useMemo, useState } from 'react';
import { evaluateInsuranceGaps, formatRupee } from './calc.js';
import { usePersona } from '../../context/PersonaContext.jsx';
import { getTranslation } from '../i18n.js';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  ChevronRight, 
  HeartHandshake, 
  HelpCircle,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export default function InsuranceGaps({ persona }) {
  const { lang } = usePersona();
  const t = getTranslation(lang);

  const gapAnalysis = useMemo(() => {
    return evaluateInsuranceGaps(persona);
  }, [persona]);

  const { gaps, gapCount, activePoliciesCount, totalLoanLiability } = gapAnalysis;
  const [completedActions, setCompletedActions] = useState(new Set());

  const toggleAction = (key) => {
    setCompletedActions(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8E2D5] pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <span>{t.insuranceGaps.title}</span>
          <span aria-hidden="true">·</span>
          <span>Safety Net Architecture</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-[#24232A] font-semibold tracking-tight">
          {t.insuranceGaps.title}
        </h2>
        <p className="text-sm text-[#55524B] mt-1 max-w-2xl leading-relaxed">
          {t.insuranceGaps.subtitle}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E8E2D5] p-4 shadow-xs">
          <div className="text-[11px] uppercase tracking-wider text-[#736F66] font-medium">
            Active Policies
          </div>
          <div className="text-2xl font-serif font-bold text-[#24232A] mt-1">
            {activePoliciesCount} <span className="text-xs font-sans font-normal text-[#736F66]">policies</span>
          </div>
          <p className="text-[11px] text-[#55524B] mt-1">
            Life, health, vehicle or accidental
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E2D5] p-4 shadow-xs">
          <div className="text-[11px] uppercase tracking-wider text-[#736F66] font-medium">
            Debt Exposure
          </div>
          <div className="text-2xl font-serif font-bold text-[#24232A] mt-1 font-mono">
            {formatRupee(totalLoanLiability)}
          </div>
          <p className="text-[11px] text-[#55524B] mt-1">
            Requires term insurance hedge
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E2D5] p-4 shadow-xs">
          <div className="text-[11px] uppercase tracking-wider text-[#736F66] font-medium">
            Identified Vulnerabilities
          </div>
          <div className={`text-2xl font-serif font-bold mt-1 ${gapCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
            {gapCount} <span className="text-xs font-sans font-normal text-[#736F66]">vulnerabilities</span>
          </div>
          <p className="text-[11px] text-[#55524B] mt-1">
            {gapCount > 0 ? 'Urgent protection shortfall' : 'Fully hedged safety net'}
          </p>
        </div>
      </div>

      {/* Gap Cards or Fully Hedged State */}
      {gapCount === 0 ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center shadow-xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-semibold text-[#24232A]">
            {t.insuranceGaps.noGaps}
          </h3>
          <p className="text-xs text-[#55524B] mt-1.5 max-w-md mx-auto leading-relaxed">
            Both primary medical risk and term liabilities are well balanced with your income profile. Ensure timely annual renewals.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#24232A]">
              {t.insuranceGaps.detectedGapsCount.replace('{{count}}', gapCount.toString())}
            </h3>
            <span className="text-xs text-[#736F66]">
              Ranked by financial severity
            </span>
          </div>

          {gaps.map((gap, index) => {
            const isCritical = gap.severity === 'critical';
            return (
              <div 
                key={gap.id}
                className="bg-white rounded-2xl border border-[#E8E2D5] p-6 shadow-xs relative overflow-hidden"
              >
                {/* Top Bar with Title and Severity Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE1] pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-semibold text-[#24232A]">
                      {t.insuranceGaps.gapTypes[gap.type] || gap.title}
                    </h4>
                  </div>

                  <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border self-start sm:self-auto ${gap.badgeColor}`}>
                    {gap.severity === 'critical' ? t.common.critical : t.common.moderatePriority}
                  </span>
                </div>

                {/* Body Explanation */}
                <p className="text-xs sm:text-sm text-[#45423B] leading-relaxed mb-5">
                  {gap.reason}
                </p>

                {/* Benchmark & Premium Recommendation Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl p-4 mb-5">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#736F66] font-medium">
                      {t.insuranceGaps.suggestedCover}
                    </div>
                    <div className="text-lg font-serif font-bold text-[#24232A] mt-0.5 font-mono">
                      {formatRupee(gap.recommendedCover)}
                    </div>
                    <div className="text-[11px] text-[#736F66] mt-0.5">
                      Tailored to liability & emergency costs
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#736F66] font-medium">
                      {t.insuranceGaps.estimatedMonthlyCost}
                    </div>
                    <div className="text-lg font-serif font-bold text-emerald-800 mt-0.5 font-mono">
                      ~{formatRupee(gap.startingPremiumEst)}{t.common.monthly}
                    </div>
                    <div className="text-[11px] text-[#736F66] mt-0.5">
                      Pure risk premium without investment clutter
                    </div>
                  </div>
                </div>

                {/* Action Steps */}
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-[#24232A] mb-2 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                    {t.insuranceGaps.actionPlan}: {gap.actionTitle}
                  </h5>

                  <div className="space-y-1.5">
                    {gap.actionSteps.map((step, sIdx) => {
                      const actionKey = `${gap.id}_${sIdx}`;
                      const isDone = completedActions.has(actionKey);
                      return (
                        <div
                          key={sIdx}
                          onClick={() => toggleAction(actionKey)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isDone 
                              ? 'bg-emerald-50/50 border-emerald-200 text-[#55524B]' 
                              : 'bg-white border-[#EFE9DC] hover:border-[#D5CEC0] text-[#33302B]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 transition-colors ${
                            isDone ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-[#B5AEA0]'
                          }`}>
                            {isDone && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                          <span className={`flex-1 ${isDone ? 'line-through text-[#736F66]' : ''}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
