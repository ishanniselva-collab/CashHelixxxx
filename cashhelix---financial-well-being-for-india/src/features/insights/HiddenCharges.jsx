import React, { useState, useMemo } from 'react';
import { detectHiddenCharges, formatRupee } from './calc.js';
import { usePersona } from '../../context/PersonaContext.jsx';
import { getTranslation } from '../i18n.js';
import { 
  AlertTriangle, 
  RotateCcw, 
  ShieldX, 
  CheckCircle, 
  X, 
  ExternalLink, 
  Info, 
  Sparkles,
  Ban,
  ArrowUpRight
} from 'lucide-react';

export default function HiddenCharges({ persona }) {
  const { lang } = usePersona();
  const t = getTranslation(lang);

  const rawLeaks = useMemo(() => {
    return detectHiddenCharges(persona);
  }, [persona]);

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'recurring' | 'fee' | 'insurance'
  const [cancelledIds, setCancelledIds] = useState(new Set());
  const [reviewItem, setReviewItem] = useState(null);

  // Filter items
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return rawLeaks.items;
    return rawLeaks.items.filter(item => item.type === activeFilter);
  }, [rawLeaks.items, activeFilter]);

  // Recalculate remaining active leak taking into account user cancelled items
  const activeYearlyLeak = useMemo(() => {
    return rawLeaks.items
      .filter(item => !cancelledIds.has(item.id))
      .reduce((sum, item) => sum + item.yearlyLeak, 0);
  }, [rawLeaks.items, cancelledIds]);

  const activeMonthlyLeak = useMemo(() => {
    return rawLeaks.items
      .filter(item => !cancelledIds.has(item.id))
      .reduce((sum, item) => sum + item.monthlyAmount, 0);
  }, [rawLeaks.items, cancelledIds]);

  const handleCancelClick = (id) => {
    setCancelledIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8E2D5] pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <span>{t.hiddenCharges.title}</span>
          <span aria-hidden="true">·</span>
          <span>Automated Leak Audit</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-[#24232A] font-semibold tracking-tight">
          {t.hiddenCharges.title}
        </h2>
        <p className="text-sm text-[#55524B] mt-1 max-w-2xl leading-relaxed">
          {t.hiddenCharges.subtitle}
        </p>
      </div>

      {/* Hero Leak Summary Banner */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              {t.hiddenCharges.totalYearlyLeak}
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-[#24232A] tracking-tight">
                {formatRupee(activeYearlyLeak)}
              </span>
              <span className="text-xs text-[#736F66] font-mono">
                ({formatRupee(activeMonthlyLeak)}{t.common.monthly})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#55524B] mt-2 leading-relaxed">
              {t.hiddenCharges.leakSummary.replace('{{count}}', rawLeaks.items.length.toString())}
              {cancelledIds.size > 0 && (
                <span className="block mt-1 font-medium text-emerald-700">
                  🎉 You have scheduled cancellation for {cancelledIds.size} leak(s), saving {formatRupee(
                    rawLeaks.items.filter(i => cancelledIds.has(i.id)).reduce((s, i) => s + i.yearlyLeak, 0)
                  )} annually!
                </span>
              )}
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col gap-2">
            <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl p-3.5 flex items-center justify-between text-xs">
              <span className="text-[#55524B]">Bank/Platform Fees</span>
              <span className="font-mono font-semibold text-[#24232A]">
                {formatRupee(rawLeaks.items.filter(i => i.type === 'fee').reduce((s, i) => s + i.yearlyLeak, 0))}{t.common.yearly}
              </span>
            </div>
            <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl p-3.5 flex items-center justify-between text-xs">
              <span className="text-[#55524B]">Recurring Subscriptions</span>
              <span className="font-mono font-semibold text-[#24232A]">
                {formatRupee(rawLeaks.items.filter(i => i.type === 'recurring').reduce((s, i) => s + i.yearlyLeak, 0))}{t.common.yearly}
              </span>
            </div>
            <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl p-3.5 flex items-center justify-between text-xs">
              <span className="text-[#55524B]">Overlapping Policies</span>
              <span className="font-mono font-semibold text-[#24232A]">
                {formatRupee(rawLeaks.items.filter(i => i.type === 'insurance').reduce((s, i) => s + i.yearlyLeak, 0))}{t.common.yearly}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EBE5D8]/60 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-white text-[#24232A] shadow-xs font-semibold'
              : 'text-[#666258] hover:text-[#24232A]'
          }`}
        >
          {t.hiddenCharges.tabsAll} ({rawLeaks.items.length})
        </button>
        <button
          onClick={() => setActiveFilter('recurring')}
          className={`px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
            activeFilter === 'recurring'
              ? 'bg-white text-[#24232A] shadow-xs font-semibold'
              : 'text-[#666258] hover:text-[#24232A]'
          }`}
        >
          {t.hiddenCharges.tabsRecurring} ({rawLeaks.items.filter(i => i.type === 'recurring').length})
        </button>
        <button
          onClick={() => setActiveFilter('fee')}
          className={`px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
            activeFilter === 'fee'
              ? 'bg-white text-[#24232A] shadow-xs font-semibold'
              : 'text-[#666258] hover:text-[#24232A]'
          }`}
        >
          {t.hiddenCharges.tabsFees} ({rawLeaks.items.filter(i => i.type === 'fee').length})
        </button>
        <button
          onClick={() => setActiveFilter('insurance')}
          className={`px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
            activeFilter === 'insurance'
              ? 'bg-white text-[#24232A] shadow-xs font-semibold'
              : 'text-[#666258] hover:text-[#24232A]'
          }`}
        >
          {t.hiddenCharges.tabsInsurance} ({rawLeaks.items.filter(i => i.type === 'insurance').length})
        </button>
      </div>

      {/* List of Detected Leaks */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8E2D5] p-8 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#24232A]">
              {t.hiddenCharges.emptyState}
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isCancelled = cancelledIds.has(item.id);
            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl border transition-all p-5 shadow-xs ${
                  isCancelled 
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-80' 
                    : 'border-[#E8E2D5] hover:border-[#D1C9B8]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-[#736F66] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span aria-hidden="true" className="text-[#C5BFB2]">·</span>
                      <span className="text-[11px] text-[#736F66]">
                        {item.frequency}
                      </span>
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full ml-auto sm:ml-2">
                          <CheckCircle className="w-3 h-3" />
                          {t.hiddenCharges.cancelledLabel}
                        </span>
                      )}
                    </div>

                    <h3 className={`text-base font-semibold text-[#24232A] ${isCancelled ? 'line-through text-[#736F66]' : ''}`}>
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#55524B] mt-1 leading-relaxed">
                      {item.reason}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[#736F66]">Monthly: </span>
                        <span className="font-semibold text-[#24232A]">{formatRupee(item.monthlyAmount)}</span>
                      </div>
                      <div className="text-rose-700 font-semibold">
                        <span>Yearly: </span>
                        <span>{formatRupee(item.yearlyLeak)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Button Group */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => setReviewItem(item)}
                      className="px-3 py-1.5 rounded-lg border border-[#D5CEC0] text-xs font-semibold text-[#3A3832] hover:bg-[#FAF7F0] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      {t.common.review}
                    </button>
                    <button
                      onClick={() => handleCancelClick(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                        isCancelled
                          ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {isCancelled ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          Undo
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5" />
                          {t.common.cancel}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {reviewItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E8E2D5] p-6 shadow-xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setReviewItem(null)}
              className="absolute top-4 right-4 p-1.5 text-[#736F66] hover:text-[#24232A] rounded-lg hover:bg-[#F2ECE1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Charge Diagnostic</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#24232A]">
              {reviewItem.title}
            </h3>
            <p className="text-xs text-[#736F66] mt-0.5">
              Category: {reviewItem.category} · Frequency: {reviewItem.frequency}
            </p>

            <div className="my-5 p-4 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#55524B]">Current deduction:</span>
                <span className="font-mono font-semibold text-[#24232A]">{formatRupee(reviewItem.monthlyAmount)} / month</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#55524B]">Annual cumulative drain:</span>
                <span className="font-mono font-semibold text-rose-700">{formatRupee(reviewItem.yearlyLeak)} / year</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-[#E8E2D5]">
                <span className="text-[#55524B]">Financial impact:</span>
                <span className="font-semibold text-rose-700">{reviewItem.impact} Impact</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#24232A]">
                Remediation Guidance
              </h4>
              <p className="text-xs text-[#55524B] leading-relaxed">
                {reviewItem.actionAdvice}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-[#F2ECE1]">
              <button
                onClick={() => setReviewItem(null)}
                className="px-4 py-2 rounded-lg border border-[#D5CEC0] text-xs font-semibold text-[#3A3832] hover:bg-[#FAF7F0] cursor-pointer"
              >
                {t.common.close}
              </button>
              <button
                onClick={() => {
                  handleCancelClick(reviewItem.id);
                  setReviewItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
              >
                {cancelledIds.has(reviewItem.id) ? 'Reactivate Leak' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
