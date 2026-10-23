import React, { useState } from 'react';
import { usePersona } from '../context/PersonaContext.jsx';
import { formatINR, formatDate, getDaysRemaining } from '../utils/formatters.js';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Users,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { persona, t } = usePersona();

  return (
    <div className="space-y-8 pb-28 pt-6 px-4 sm:px-8 max-w-4xl mx-auto">
      {/* Editorial Persona Header Banner */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-[#EDE7DC] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#51243A]">
              {t(`persona_${persona.id}`)}
            </span>
            <span className="text-[#C6A15B]">·</span>
            <span className="text-xs text-[#54525C] font-editorial italic">
              {persona.income.type === 'regular' ? 'Predictable Salary Cadence' : 'Dynamic Variable Liquidity'}
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#24232A] tracking-tight">
            {persona.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#54525C] mt-1.5 max-w-xl font-editorial italic leading-relaxed">
            {persona.tagline}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#EDE7DC]/40 p-4 rounded-2xl border border-[#EDE7DC] shrink-0">
          <div>
            <div className="text-[10px] text-[#54525C] uppercase tracking-wider font-semibold">
              Monthly Inflow Horizon
            </div>
            <div className="font-editorial text-2xl font-bold text-[#51243A] tabular-nums mt-0.5">
              {formatINR(persona.income.monthlyAvg)}
            </div>
          </div>
        </div>
      </div>

      {/* Render Persona-Specific Views */}
      {persona.id === 'gig' && <GigHome persona={persona} t={t} />}
      {persona.id === 'student' && <StudentHome persona={persona} t={t} />}
      {persona.id === 'shopkeeper' && <ShopkeeperHome persona={persona} t={t} />}
      {persona.id === 'family' && <FamilyHome persona={persona} t={t} />}
      {persona.id === 'senior' && <SeniorHome persona={persona} t={t} />}
      {persona.id === 'shg' && <SHGHome persona={persona} t={t} />}
    </div>
  );
}

/* =========================================================================
   1. GIG WORKER HOME - Modern Wealth Editorial
   ========================================================================= */
function GigHome({ persona, t }) {
  const billsIn7Days = persona.bills
    .filter((b) => {
      const days = getDaysRemaining(b.dueDate);
      return days >= 0 && days <= 7;
    })
    .reduce((sum, b) => sum + b.amount, 0);

  const dailyBillsShare = Math.round(billsIn7Days / 7);
  const dailyLeanReserveShare = Math.round(persona.income.typicalWeeklyLean / 7);
  const expectedDailyInflow = 950;
  const baseSafeSpend = Math.max(0, expectedDailyInflow - dailyBillsShare - dailyLeanReserveShare);

  // What-If EMI Simulator State
  const [phoneCost, setPhoneCost] = useState(40000);
  const [tenorMonths, setTenorMonths] = useState(6);

  const monthlyInterestRate = 0.15 / 12;
  const emi = Math.round(
    (phoneCost * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenorMonths)) /
    (Math.pow(1 + monthlyInterestRate, tenorMonths) - 1)
  );
  const dailyEmiImpact = Math.round(emi / 30);
  const newSafeSpend = Math.max(0, baseSafeSpend - dailyEmiImpact);

  return (
    <div className="space-y-6">
      {/* Big Safe to Spend Today Card - Deep Plum & Gold Editorial */}
      <div className="bg-[#51243A] text-[#F8F4EC] rounded-3xl p-6 sm:p-9 shadow-lg border border-[#3A1929] relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-widest uppercase text-[#DFC486]">
            {t('safeToSpendToday')}
          </span>
          <span className="text-[11px] font-editorial italic text-[#DFC486] border border-[#C6A15B]/30 rounded-full px-3 py-0.5 bg-[#3A1929]/50">
            22 Oct Live Estimate
          </span>
        </div>

        <div className="font-editorial text-5xl sm:text-6xl font-normal tracking-tight text-white mb-2 tabular-nums">
          {formatINR(baseSafeSpend)}
        </div>
        <p className="text-xs sm:text-sm text-[#F8F4EC]/85 font-editorial italic max-w-lg mb-6 leading-relaxed">
          {t('safeToSpendDesc')}
        </p>

        {/* Breakdown Row */}
        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#F8F4EC]/15 text-xs">
          <div className="bg-[#3A1929]/60 p-3 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Est. Inflow</div>
            <div className="font-editorial text-xl font-bold tabular-nums mt-0.5 text-white">+{formatINR(expectedDailyInflow)}</div>
          </div>
          <div className="bg-[#3A1929]/60 p-3 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Bills (7d/7)</div>
            <div className="font-editorial text-xl font-bold tabular-nums mt-0.5 text-rose-300">-{formatINR(dailyBillsShare)}</div>
          </div>
          <div className="bg-[#3A1929]/60 p-3 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Lean Reserve</div>
            <div className="font-editorial text-xl font-bold tabular-nums mt-0.5 text-[#DFC486]">-{formatINR(dailyLeanReserveShare)}</div>
          </div>
        </div>
      </div>

      {/* Bills Timeline */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 border border-[#EDE7DC] shadow-2xs">
        <div className="flex items-center justify-between mb-4 border-b border-[#EDE7DC] pb-3">
          <h2 className="font-editorial text-2xl font-bold text-[#24232A] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#C6A15B]" />
            {t('upcomingBills')}
          </h2>
          <span className="text-xs text-[#54525C] font-editorial italic">
            7-Day Commitment: <strong className="text-[#51243A] font-bold">{formatINR(billsIn7Days)}</strong>
          </span>
        </div>

        <div className="space-y-3">
          {persona.bills.map((bill) => {
            const daysLeft = getDaysRemaining(bill.dueDate);
            const isDueSoon = daysLeft <= 3;
            return (
              <div
                key={bill.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-[#EDE7DC] hover:border-[#C6A15B]/50 bg-white transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isDueSoon ? 'bg-rose-100 text-rose-800' : 'bg-[#EDE7DC] text-[#24232A]'
                    }`}
                  >
                    {daysLeft}d
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#24232A]">
                      {bill.name}
                    </h3>
                    <p className="text-[11px] text-[#54525C] font-editorial italic">
                      Scheduled: {formatDate(bill.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-editorial text-lg font-bold text-[#24232A] tabular-nums">
                    {formatINR(bill.amount)}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDueSoon ? 'text-rose-700' : 'text-[#54525C]'}`}>
                    {daysLeft === 0 ? 'Due Today' : `${daysLeft} days away`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What-If Purchase Simulator */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 border border-[#EDE7DC] shadow-2xs space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#51243A] mb-1">
            <Sliders className="w-4 h-4 text-[#C6A15B]" />
            <span>{t('whatIfSimulator')}</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#24232A]">
            {t('whatIfPrompt')}
          </h2>
          <p className="text-xs text-[#54525C] font-editorial italic mt-0.5">
            Simulate the multi-month erosion on your daily safe spending ceiling
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EDE7DC] space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#24232A]">
              <span>Purchase Price: ₹{phoneCost.toLocaleString('en-IN')}</span>
              <span className="text-[#C6A15B] font-bold">Horizon: {tenorMonths} Months</span>
            </div>
            <input
              type="range"
              min="15000"
              max="70000"
              step="5000"
              value={phoneCost}
              onChange={(e) => setPhoneCost(Number(e.target.value))}
              className="w-full accent-[#51243A] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#54525C] font-editorial italic">
              <span>₹15,000 (Functional)</span>
              <span>₹40,000 (Mid-tier)</span>
              <span>₹70,000 (Flagship)</span>
            </div>
          </div>

          {/* Tenor Selector */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-medium text-[#54525C] shrink-0">Tenor:</span>
            {[3, 6, 9, 12].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTenorMonths(m)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  tenorMonths === m
                    ? 'bg-[#51243A] text-[#F8F4EC] border-[#51243A] shadow-xs'
                    : 'bg-[#FDFBF7] text-[#54525C] border-[#EDE7DC] hover:border-[#C6A15B]'
                }`}
              >
                {m}M
              </button>
            ))}
          </div>

          {/* Resulting Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#EDE7DC]">
              <span className="text-[10px] uppercase tracking-wider text-[#54525C] font-semibold">Monthly EMI Burden</span>
              <div className="font-editorial text-2xl font-bold text-rose-700 tabular-nums mt-0.5">
                {formatINR(emi)} / mo
              </div>
              <span className="text-[11px] text-[#54525C] font-editorial italic mt-1 block">Deducts ₹{dailyEmiImpact} every day</span>
            </div>

            <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#EDE7DC]">
              <span className="text-[10px] uppercase tracking-wider text-[#54525C] font-semibold">{t('newDailySafe')}</span>
              <div className="font-editorial text-2xl font-bold text-[#51243A] tabular-nums mt-0.5">
                {formatINR(newSafeSpend)} / day
              </div>
              <span className="text-[11px] text-[#54525C] font-editorial italic mt-1 block">
                Adjusted from {formatINR(baseSafeSpend)} (drops by {Math.round((dailyEmiImpact / baseSafeSpend) * 100)}%)
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-[#C6A15B]/10 border border-[#C6A15B]/30 rounded-xl text-xs text-[#24232A] flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#C6A15B] shrink-0" />
            <span className="font-editorial italic">{t('bufferDepletionWarning')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. STUDENT HOME - Modern Wealth Editorial
   ========================================================================= */
function StudentHome({ persona, t }) {
  const currentBalance = 3450 + 420;
  const daysUntilNextAllowance = 10;
  const safeDailySpend = Math.round(currentBalance / daysUntilNextAllowance);

  const categories = [
    { name: 'Canteen & Food', amount: 4850, pct: 45, color: 'bg-[#51243A]' },
    { name: 'Hostel Mess Bill', amount: 3200, pct: 30, color: 'bg-[#6E334F]' },
    { name: 'Transit & Metro', amount: 980, pct: 9, color: 'bg-[#C6A15B]' },
    { name: 'OTT & Subscriptions', amount: 650, pct: 6, color: 'bg-[#A3803F]' },
    { name: 'Stationery & Study', amount: 1070, pct: 10, color: 'bg-[#54525C]' }
  ];

  return (
    <div className="space-y-6">
      {/* Runway Countdown Hero */}
      <div className="bg-[#51243A] text-[#F8F4EC] rounded-3xl p-6 sm:p-9 shadow-lg border border-[#3A1929]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-widest uppercase text-[#DFC486]">
            {t('runwayTitle')}
          </span>
          <span className="text-[11px] font-editorial italic text-amber-200 border border-amber-300/30 rounded-full px-3 py-0.5 bg-[#3A1929]">
            Buffer Critical
          </span>
        </div>

        <div className="font-editorial text-4xl sm:text-5xl font-normal tracking-tight text-white mb-2">
          {t('moneyLastsUntil')}
        </div>
        <p className="text-xs sm:text-sm text-[#F8F4EC]/85 font-editorial italic max-w-lg mb-6 leading-relaxed">
          Current liquid balance is <strong className="text-white font-bold">{formatINR(currentBalance)}</strong>. With 10 days remaining until your next parental allowance on Nov 1st, calibrate your daily cap.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-5 border-t border-[#F8F4EC]/15 text-xs">
          <div className="bg-[#3A1929]/70 p-3.5 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">{t('dailyBudgetCap')}</div>
            <div className="font-editorial text-2xl font-bold text-white tabular-nums mt-0.5">
              {formatINR(safeDailySpend)} / day
            </div>
          </div>
          <div className="bg-[#3A1929]/70 p-3.5 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">{t('countdownDays')}</div>
            <div className="font-editorial text-2xl font-bold text-[#DFC486] tabular-nums mt-0.5">
              {daysUntilNextAllowance} Days
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-[#3A1929]/70 p-3.5 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Next Allowance</div>
            <div className="font-editorial text-2xl font-bold text-white tabular-nums mt-0.5">
              ₹8,000 (1 Nov)
            </div>
          </div>
        </div>
      </div>

      {/* Spend by Category */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 border border-[#EDE7DC] shadow-2xs space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#24232A]">
          {t('topSpendingCategories')}
        </h2>

        <div className="space-y-3.5">
          {categories.map((c) => (
            <div key={c.name} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#24232A]">
                <span>{c.name}</span>
                <span className="tabular-nums font-bold text-[#51243A]">{formatINR(c.amount)} ({c.pct}%)</span>
              </div>
              <div className="w-full bg-[#EDE7DC] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${c.color}`}
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Loan Moratorium Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#EDE7DC] flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#EDE7DC] text-[#51243A] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
        </div>
        <div>
          <h3 className="font-editorial text-xl font-bold text-[#24232A]">
            {t('studyLoanStatus')}
          </h3>
          <p className="text-xs text-[#54525C] font-editorial italic mt-1 leading-relaxed">
            SBI Vidya Lakshmi Education Loan (₹6,40,000 principal) is legally protected under study moratorium until July 2027. {t('studyLoanSub')}.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. SHOPKEEPER HOME - Modern Wealth Editorial
   ========================================================================= */
function ShopkeeperHome({ persona, t }) {
  const businessReceiptsThisMonth = 68400;
  const personalDrawThisMonth = 26500;
  const shopSurplus = businessReceiptsThisMonth - personalDrawThisMonth;

  const forecastDays = [
    { day: 'Thu (Today)', receivables: 8500, payables: 4200, net: 4300 },
    { day: 'Fri (23 Oct)', receivables: 9200, payables: 8500, net: 700 },
    { day: 'Sat (24 Oct)', receivables: 14500, payables: 24500, net: -10000, note: 'Metro Bulk Stock Due' },
    { day: 'Sun (25 Oct)', receivables: 16000, payables: 2200, net: 13800, note: 'Peak Weekend Sales' },
    { day: 'Mon (26 Oct)', receivables: 7500, payables: 6450, net: 1050, note: 'DGVCL Power Bill' },
    { day: 'Tue (27 Oct)', receivables: 8900, payables: 3100, net: 5800 },
    { day: 'Wed (28 Oct)', receivables: 9400, payables: 9200, net: 200, note: 'MUDRA Loan EMI' }
  ];

  return (
    <div className="space-y-6">
      {/* Business vs Personal Split Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FDFBF7] rounded-3xl p-5 border border-[#EDE7DC] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#51243A] mb-1">
            <ArrowUpRight className="w-4 h-4 text-[#C6A15B]" />
            <span>{t('businessInflow')}</span>
          </div>
          <div className="font-editorial text-3xl font-bold text-[#24232A] tabular-nums">
            {formatINR(businessReceiptsThisMonth)}
          </div>
          <p className="text-[11px] text-[#54525C] font-editorial italic mt-1">BharatPe & Soundbox settlements</p>
        </div>

        <div className="bg-[#FDFBF7] rounded-3xl p-5 border border-[#EDE7DC] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A3803F] mb-1">
            <ArrowDownRight className="w-4 h-4" />
            <span>{t('personalDraw')}</span>
          </div>
          <div className="font-editorial text-3xl font-bold text-[#24232A] tabular-nums">
            {formatINR(personalDrawThisMonth)}
          </div>
          <p className="text-[11px] text-[#54525C] font-editorial italic mt-1">Transferred to HDFC Personal</p>
        </div>

        <div className="bg-[#FDFBF7] rounded-3xl p-5 border border-[#EDE7DC] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#51243A] mb-1">
            <TrendingUp className="w-4 h-4 text-[#C6A15B]" />
            <span>{t('netShopSurplus')}</span>
          </div>
          <div className="font-editorial text-3xl font-bold text-[#51243A] tabular-nums">
            {formatINR(shopSurplus)}
          </div>
          <p className="text-[11px] text-[#54525C] font-editorial italic mt-1">Free capital for stock re-orders</p>
        </div>
      </div>

      {/* 7-Day Cash-Flow Forecast */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-[#EDE7DC] shadow-2xs space-y-5">
        <div className="border-b border-[#EDE7DC] pb-4">
          <h2 className="font-editorial text-2xl font-bold text-[#24232A] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#C6A15B]" />
            {t('sevenDayForecast')}
          </h2>
          <p className="text-xs text-[#54525C] font-editorial italic mt-0.5">
            Forward-looking cash ledger estimating wholesale settlements against UPI inflows
          </p>
        </div>

        <div className="space-y-3">
          {forecastDays.map((item) => {
            const isNegative = item.net < 0;
            return (
              <div
                key={item.day}
                className="p-4 rounded-2xl bg-white border border-[#EDE7DC] hover:border-[#C6A15B]/60 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-[#24232A]">{item.day}</span>
                    {item.note && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EDE7DC] text-[#51243A]">
                        {item.note}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-[#51243A] font-bold tabular-nums">
                      +{formatINR(item.receivables)}
                    </span>
                    <span className="text-rose-700 font-bold tabular-nums">
                      -{formatINR(item.payables)}
                    </span>
                    <span className={`font-bold tabular-nums px-2.5 py-0.5 rounded-md ${
                      isNegative ? 'bg-rose-100 text-rose-800' : 'bg-[#51243A]/10 text-[#51243A]'
                    }`}>
                      {formatINR(item.net, { showSign: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 h-1.5 w-full bg-[#EDE7DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#51243A] rounded-full"
                    style={{ width: `${(item.receivables / (item.receivables + item.payables)) * 100}%` }}
                  />
                  <div
                    className="h-full bg-[#C6A15B] rounded-full"
                    style={{ width: `${(item.payables / (item.receivables + item.payables)) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. FAMILY HOME - Modern Wealth Editorial
   ========================================================================= */
function FamilyHome({ persona, t }) {
  const members = [
    { name: 'Vikram', role: 'IT Project Lead', income: '₹1,30,000', cover: 'Corporate Mediclaim + Term Cover', status: 'Primary Earner' },
    { name: 'Priya', role: 'High School Teacher', income: '₹55,000', cover: 'Joint HDFC ERGO Floater', status: 'Second Earner' },
    { name: 'Aarohi', role: 'Daughter (13 yrs)', school: 'Class 8 Vibgyor High', goal: 'Higher Education Fund', status: 'Dependent' },
    { name: 'Kabir', role: 'Son (7 yrs)', school: 'Class 2 Vibgyor High', goal: 'Child Medical Reserve', status: 'Dependent' }
  ];

  return (
    <div className="space-y-6">
      {/* Household Financial Pulse */}
      <div className="bg-[#51243A] text-[#F8F4EC] rounded-3xl p-6 sm:p-9 shadow-lg border border-[#3A1929]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-widest uppercase text-[#DFC486]">
            {t('familyFinancialPulse')}
          </span>
          <span className="text-[11px] font-editorial italic text-[#DFC486] border border-[#C6A15B]/30 rounded-full px-3 py-0.5 bg-[#3A1929]">
            Household of 4
          </span>
        </div>

        <div className="font-editorial text-5xl sm:text-6xl font-normal tracking-tight text-white mb-2 tabular-nums">
          ₹1,85,000 <span className="text-xl font-editorial italic text-[#F8F4EC]/70">/ month</span>
        </div>
        <p className="text-xs sm:text-sm text-[#F8F4EC]/85 font-editorial italic max-w-xl mb-6 leading-relaxed">
          Consolidated salary from TCS & Army Public School. Balanced against ₹57,300 in fixed home/car EMIs and children tuition commitments.
        </p>

        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#F8F4EC]/15 text-xs">
          <div className="bg-[#3A1929]/70 p-3.5 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Fixed EMIs</div>
            <div className="font-editorial text-xl font-bold tabular-nums mt-0.5 text-rose-300">₹57,300</div>
          </div>
          <div className="bg-[#3A1929]/70 p-3.5 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Pantry & Living</div>
            <div className="font-editorial text-xl font-bold tabular-nums mt-0.5 text-[#DFC486]">₹44,000</div>
          </div>
          <div className="bg-[#3A1929]/70 p-3.5 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Invest & Buffer</div>
            <div className="font-editorial text-xl font-bold tabular-nums mt-0.5 text-white">₹83,700</div>
          </div>
        </div>
      </div>

      {/* Member Cards */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 border border-[#EDE7DC] shadow-2xs space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#24232A] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#C6A15B]" />
          {t('familyMembers')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((m) => (
            <div
              key={m.name}
              className="p-4.5 rounded-2xl bg-white border border-[#EDE7DC] space-y-2 hover:border-[#C6A15B]/50 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#24232A]">{m.name}</h3>
                  <p className="text-xs text-[#54525C] font-editorial italic">{m.role || m.school}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EDE7DC] text-[#51243A]">
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-[#54525C] pt-1">
                {m.income ? `Inflows: ${m.income} · ` : ''}{m.cover || m.goal}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Goals Summary */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 border border-[#EDE7DC] shadow-2xs space-y-3.5">
        <h2 className="font-editorial text-2xl font-bold text-[#24232A]">
          {t('sharedFamilyGoals')}
        </h2>
        {persona.goals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <div key={g.id} className="p-4 rounded-2xl bg-white border border-[#EDE7DC] space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#24232A]">
                <span className="font-editorial text-base font-bold">{g.name}</span>
                <span className="tabular-nums font-bold text-[#51243A]">
                  {formatINR(g.saved)} / {formatINR(g.target)} ({pct}%)
                </span>
              </div>
              <div className="w-full bg-[#EDE7DC] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#51243A] h-full rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   5. SENIOR CITIZEN HOME - Modern Wealth Editorial (High Contrast)
   ========================================================================= */
function SeniorHome({ persona, t }) {
  return (
    <div className="space-y-6">
      {/* High-Contrast Oversized Pension Card */}
      <div className="bg-[#24232A] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#51243A] shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold tracking-widest uppercase text-[#DFC486]">
            {t('pensionSummary')}
          </span>
          <span className="text-xs font-semibold px-3 py-1 bg-[#51243A] text-[#DFC486] rounded-full border border-[#C6A15B]/30">
            SPARSH Linked
          </span>
        </div>

        <div className="font-editorial text-5xl sm:text-7xl font-bold tracking-tight text-white mb-2 tabular-nums">
          ₹58,000 <span className="text-xl font-normal text-[#EDE7DC]">/ month</span>
        </div>
        <p className="text-sm text-[#EDE7DC]/85 font-editorial italic max-w-lg mb-6 leading-relaxed">
          Guaranteed Army defense pension credited into SBI Pension Account (•••• 1009) by PCDA Prayagraj.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EDE7DC]/20">
          <div className="bg-[#3A1929]/80 p-5 rounded-2xl border border-[#C6A15B]/30">
            <div className="text-xs text-[#DFC486] uppercase font-bold tracking-wider">Total Bank FDs + SCSS Deposits</div>
            <div className="font-editorial text-3xl font-black text-white tabular-nums mt-1">₹32,00,000</div>
            <div className="text-xs text-[#DFC486] mt-1 font-editorial italic">Quarterly Yield: ₹53,700</div>
          </div>
          <div className="bg-[#3A1929]/80 p-5 rounded-2xl border border-[#C6A15B]/30">
            <div className="text-xs text-[#DFC486] uppercase font-bold tracking-wider">Medical Shield</div>
            <div className="font-editorial text-2xl font-bold text-white mt-1">ECHS Veteran Card</div>
            <div className="text-xs text-[#DFC486] mt-1 font-editorial italic">100% Cashless at Military Hospitals</div>
          </div>
        </div>
      </div>

      {/* Family Co-Pilot Security Alerts */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border-2 border-[#EDE7DC] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#EDE7DC] pb-3">
          <AlertCircle className="w-6 h-6 text-[#A3803F]" />
          <h2 className="font-editorial text-2xl font-bold text-[#24232A]">
            {t('copilotAlerts')}
          </h2>
        </div>

        <div className="space-y-3.5">
          {/* Nominee Warning */}
          <div className="p-4.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-rose-950">
                {t('nomineeNotice')}
              </h3>
              <p className="text-xs text-rose-900/90 font-editorial italic mt-0.5 leading-relaxed">
                Canara Bank Senior Citizen FD (₹12,00,000) lacks a registered nominee. Please submit Form DA-1 to avoid probate delay for your spouse.
              </p>
            </div>
          </div>

          {/* Maturity Warning */}
          <div className="p-4.5 rounded-2xl bg-[#C6A15B]/15 border border-[#C6A15B]/40 text-[#24232A] flex items-start gap-3.5">
            <Clock className="w-5 h-5 text-[#A3803F] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[#24232A]">
                {t('maturityNotice')}
              </h3>
              <p className="text-xs text-[#54525C] font-editorial italic mt-0.5 leading-relaxed">
                Your 444-Day Special Deposit at Canara Bank matures on 20 Nov 2026. Auto-renew at 7.6% or reinvest into SCSS for 8.2%.
              </p>
            </div>
          </div>

          {/* Health Policy Redundancy */}
          <div className="p-4.5 rounded-2xl bg-white border border-[#EDE7DC] text-[#24232A] flex items-start gap-3.5">
            <HelpCircle className="w-5 h-5 text-[#54525C] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[#24232A]">
                {t('healthAlert')}
              </h3>
              <p className="text-xs text-[#54525C] font-editorial italic mt-0.5 leading-relaxed">
                You are paying ₹28,500/yr for private insurance even though ECHS covers all veteran hospitalization without copay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. SHG HOME - Modern Wealth Editorial
   ========================================================================= */
function SHGHome({ persona, t }) {
  return (
    <div className="space-y-6">
      {/* Group Ledger Summary */}
      <div className="bg-[#51243A] text-[#F8F4EC] rounded-3xl p-6 sm:p-9 shadow-lg border border-[#3A1929]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-widest uppercase text-[#DFC486]">
            {t('shgGroupLedger')}
          </span>
          <span className="text-[11px] font-editorial italic text-[#DFC486] border border-[#C6A15B]/30 rounded-full px-3 py-0.5 bg-[#3A1929]">
            Wardha MSRLM Certified
          </span>
        </div>

        <div className="font-editorial text-5xl sm:text-6xl font-normal tracking-tight text-white mb-2 tabular-nums">
          ₹74,200
        </div>
        <p className="text-xs sm:text-sm text-[#F8F4EC]/85 font-editorial italic max-w-xl mb-6 leading-relaxed">
          Collective corpus of 12 women in Mahila Pragati Bachat Gat. Monthly pledge ₹500/member collected every 22nd.
        </p>

        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#F8F4EC]/15 text-xs">
          <div className="bg-[#3A1929]/70 p-3.5 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Active Members</div>
            <div className="font-editorial text-xl font-bold tabular-nums mt-0.5">12 Sisters</div>
          </div>
          <div className="bg-[#3A1929]/70 p-3.5 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Internal Loans</div>
            <div className="font-editorial text-xl font-bold tabular-nums mt-0.5 text-[#DFC486]">₹25,000</div>
          </div>
          <div className="bg-[#3A1929]/70 p-3.5 rounded-2xl border border-[#C6A15B]/20">
            <div className="text-[10px] text-[#DFC486] uppercase tracking-wider font-semibold">Recovery Rate</div>
            <div className="font-editorial text-xl font-bold tabular-nums mt-0.5 text-white">98.4%</div>
          </div>
        </div>
      </div>

      {/* Bank Linkage Micro-Loan Eligibility Meter */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-[#EDE7DC] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#C6A15B]" />
            <h2 className="font-editorial text-2xl font-bold text-[#24232A]">
              {t('microLoanMeter')}
            </h2>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#51243A]/10 text-[#51243A] rounded-full border border-[#51243A]/20">
            {t('creditScoreTier')}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#54525C] font-editorial italic">
            <span>Linkage Score: <strong>88 / 100</strong> (Grade A)</span>
            <span className="text-[#51243A] font-bold">100% Spotless NABARD Repayments</span>
          </div>
          <div className="w-full bg-[#EDE7DC] rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#C6A15B] to-[#51243A] h-full rounded-full w-[88%]" />
          </div>
        </div>

        <div className="p-4.5 bg-white border border-[#EDE7DC] rounded-2xl text-xs text-[#24232A] flex items-start gap-3.5">
          <CheckCircle2 className="w-5 h-5 text-[#51243A] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-editorial text-lg font-bold text-[#24232A]">
              {t('eligibleAmount')}
            </h3>
            <p className="text-xs text-[#54525C] font-editorial italic mt-1 leading-relaxed">
              Based on regular monthly deposits and spotless repayment of the Phase 1 micro-loan, Bank of India is ready to disburse the solar spice grinder loan at 7.0% interest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
