import React, { useState } from 'react';
import { usePersona } from '../context/PersonaContext.jsx';
import { formatINR, formatDate } from '../utils/formatters.js';
import {
  Wallet,
  Building2,
  CreditCard,
  PiggyBank,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Percent,
  CheckCircle2
} from 'lucide-react';

export default function Accounts() {
  const { persona, t, hasConsented } = usePersona();
  const [filterType, setFilterType] = useState('all');

  // Calculate Net Worth, Assets, Liabilities
  const assets = persona.accounts
    .filter((acc) => acc.balance > 0)
    .reduce((sum, acc) => sum + acc.balance, 0);

  const liabilities = persona.accounts
    .filter((acc) => acc.balance < 0)
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  const netWorth = assets - liabilities;

  // Asset allocation categories
  const bankAndWalletAssets = persona.accounts
    .filter((a) => (a.type === 'bank' || a.type === 'wallet') && a.balance > 0)
    .reduce((s, a) => s + a.balance, 0);

  const depositAssets = persona.accounts
    .filter((a) => a.type === 'fd' && a.balance > 0)
    .reduce((s, a) => s + a.balance, 0);

  const totalPositiveCorpus = Math.max(1, assets);
  const liquidPct = Math.round((bankAndWalletAssets / totalPositiveCorpus) * 100);
  const depositPct = Math.round((depositAssets / totalPositiveCorpus) * 100);
  const otherPct = Math.max(0, 100 - liquidPct - depositPct);

  // Solvency ratio (Assets / (Assets + Liabilities))
  const totalBalanceVolume = assets + liabilities;
  const assetSharePct = totalBalanceVolume > 0 ? Math.round((assets / totalBalanceVolume) * 100) : 100;
  const liabilitySharePct = 100 - assetSharePct;

  // Filter accounts
  const filteredAccounts = persona.accounts.filter((acc) => {
    if (filterType === 'all') return true;
    if (filterType === 'bank') return acc.type === 'bank' || acc.type === 'wallet';
    if (filterType === 'loan') return acc.type === 'loan' || acc.type === 'card';
    if (filterType === 'fd') return acc.type === 'fd';
    if (filterType === 'insurance') return acc.type === 'insurance';
    return true;
  });

  const getAccountIcon = (type) => {
    switch (type) {
      case 'bank':
      case 'wallet':
        return <Wallet className="w-4 h-4 text-[#51243A]" />;
      case 'card':
      case 'loan':
        return <CreditCard className="w-4 h-4 text-[#A3803F]" />;
      case 'fd':
        return <PiggyBank className="w-4 h-4 text-[#C6A15B]" />;
      case 'insurance':
        return <ShieldCheck className="w-4 h-4 text-[#51243A]" />;
      default:
        return <Building2 className="w-4 h-4 text-[#54525C]" />;
    }
  };

  const getAccountBadgeLabel = (type) => {
    switch (type) {
      case 'bank': return 'Savings Account';
      case 'wallet': return 'Digital Reserve';
      case 'card': return 'Line of Credit';
      case 'loan': return 'Debt Obligation';
      case 'fd': return 'Fixed Term Deposit';
      case 'insurance': return 'Underwritten Shield';
      default: return 'Account';
    }
  };

  return (
    <div className="space-y-8 pb-28 pt-6 px-4 sm:px-8 max-w-4xl mx-auto">
      {/* =========================================================================
          SIGNATURE MOMENT: Modern Wealth Editorial Net-Worth Overview
          ========================================================================= */}
      <section className="bg-[#51243A] text-[#F8F4EC] rounded-3xl p-6 sm:p-10 border border-[#3A1929] shadow-lg relative overflow-hidden">
        {/* Subtle decorative watermark/filigree motif in muted gold */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-[#C6A15B]/15 pointer-events-none" />
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border border-[#C6A15B]/10 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Curatorial Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F8F4EC]/15 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#DFC486]">
                {t('netWorth')} · {persona.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#F8F4EC]/70 font-editorial italic">
              <span>{hasConsented ? 'Sahamati AA Verified' : 'Consolidated Ledger'}</span>
              <span>·</span>
              <span>October 2026 Audit</span>
            </div>
          </div>

          {/* Stately Editorial Headline */}
          <div className="pt-1">
            <div className="text-xs uppercase tracking-widest text-[#DFC486] font-semibold mb-1">
              Consolidated Net Worth
            </div>
            <div className="font-editorial text-4xl sm:text-6xl font-normal tracking-tight text-white tabular-nums leading-none">
              {formatINR(netWorth, { showSign: true })}
            </div>
            <p className="text-xs sm:text-sm text-[#F8F4EC]/80 font-editorial italic mt-2.5 max-w-xl leading-relaxed">
              Calculated across {persona.accounts.length} verified institution accounts, balancing liquid reserves and fixed deposits against outstanding loan amortizations.
            </p>
          </div>

          {/* Elegant Dual-Track Solvency Indicator */}
          <div className="bg-[#3A1929]/70 rounded-2xl p-4 sm:p-5 border border-[#C6A15B]/20 space-y-3">
            <div className="flex justify-between items-end text-xs">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#DFC486] font-semibold block">
                  Asset-to-Liability Composition
                </span>
                <span className="font-editorial italic text-[#F8F4EC]/75 text-xs">
                  {assetSharePct}% Assets vs {liabilitySharePct}% Debt
                </span>
              </div>
              <div className="text-right tabular-nums">
                <span className="text-[#DFC486] font-bold">{formatINR(assets)}</span>
                <span className="text-[#F8F4EC]/50 mx-1.5">/</span>
                <span className="text-rose-300 font-bold">-{formatINR(liabilities)}</span>
              </div>
            </div>

            {/* Hairline Ratio Bar with Muted Gold & Crimson Accents */}
            <div className="h-2 w-full bg-[#2A101C] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-[#C6A15B] to-[#DFC486] transition-all duration-700"
                style={{ width: `${assetSharePct}%` }}
                title={`Assets: ${assetSharePct}%`}
              />
              <div
                className="h-full bg-rose-400/80 transition-all duration-700"
                style={{ width: `${liabilitySharePct}%` }}
                title={`Liabilities: ${liabilitySharePct}%`}
              />
            </div>

            {/* Micro Indicator Indicators */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#F8F4EC]/10 text-xs">
              <div>
                <span className="text-[10px] text-[#DFC486] uppercase tracking-wider block font-semibold">Liquid Inflows</span>
                <span className="font-bold text-white tabular-nums mt-0.5 block">{liquidPct}%</span>
                <span className="text-[10px] text-[#F8F4EC]/60">{formatINR(bankAndWalletAssets)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#DFC486] uppercase tracking-wider block font-semibold">Term FDs</span>
                <span className="font-bold text-white tabular-nums mt-0.5 block">{depositPct}%</span>
                <span className="text-[10px] text-[#F8F4EC]/60">{formatINR(depositAssets)}</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-300 uppercase tracking-wider block font-semibold">Debt Burden</span>
                <span className="font-bold text-rose-300 tabular-nums mt-0.5 block">{liabilitySharePct}%</span>
                <span className="text-[10px] text-[#F8F4EC]/60">{formatINR(liabilities)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Editorial Account Filter Tabs & Ledger
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE7DC] pb-3">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#24232A]">
              Institutions & Accounts
            </h2>
            <p className="text-xs text-[#54525C] font-editorial italic">
              Grouped by asset and liability class for {persona.label}
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: t('filterAll') },
              { id: 'bank', label: t('filterBank') },
              { id: 'loan', label: t('filterLoans') },
              { id: 'fd', label: t('filterInvestments') },
              { id: 'insurance', label: t('filterInsurance') }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-[#51243A] text-[#F8F4EC] shadow-xs'
                    : 'bg-[#FDFBF7] text-[#54525C] border border-[#EDE7DC] hover:border-[#C6A15B]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Account Cards */}
        <div className="grid grid-cols-1 gap-3.5">
          {filteredAccounts.map((account) => {
            const isNegative = account.balance < 0;
            const isZero = account.balance === 0;

            return (
              <div
                key={account.id}
                className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#EDE7DC] hover:border-[#C6A15B] transition-all space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EDE7DC]/60 border border-[#EDE7DC] flex items-center justify-center shrink-0 mt-0.5">
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <h3 className="font-editorial text-lg font-bold text-[#24232A] leading-snug">
                        {account.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#54525C] mt-0.5">
                        <span className="font-medium text-[#A3803F]">
                          {getAccountBadgeLabel(account.type)}
                        </span>
                        {account.meta?.accNo && (
                          <>
                            <span aria-hidden="true" className="text-[#C6A15B]">·</span>
                            <span className="font-mono text-[11px] text-[#54525C]">{account.meta.accNo}</span>
                          </>
                        )}
                        {account.meta?.primary && (
                          <>
                            <span aria-hidden="true" className="text-[#C6A15B]">·</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#51243A]">Primary</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-editorial text-2xl font-bold tabular-nums ${
                        isNegative
                          ? 'text-rose-700'
                          : isZero
                          ? 'text-[#54525C]'
                          : 'text-[#51243A]'
                      }`}
                    >
                      {isZero ? 'Active Shield' : formatINR(account.balance)}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#54525C] block mt-0.5">
                      {isNegative ? 'Balance Due' : isZero ? 'Underwritten' : 'Net Liquidity'}
                    </span>
                  </div>
                </div>

                {/* Account Metadata Grid */}
                {account.meta && Object.keys(account.meta).length > 0 && (
                  <div className="pt-3 border-t border-[#EDE7DC] grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-[#24232A]">
                    {account.meta.emi && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#54525C] block">Monthly EMI</span>
                        <strong className="font-semibold tabular-nums text-rose-800">{formatINR(account.meta.emi)}</strong>
                      </div>
                    )}
                    {account.meta.tenorRemaining && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#54525C] block">Tenor Horizon</span>
                        <strong className="font-semibold text-[#24232A]">{account.meta.tenorRemaining}</strong>
                      </div>
                    )}
                    {account.meta.interestRate && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#54525C] block">Yield / Coupon</span>
                        <strong className="font-semibold text-[#51243A] tabular-nums">{account.meta.interestRate}</strong>
                      </div>
                    )}
                    {account.meta.quarterlyPayout && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#54525C] block">Quarterly Yield</span>
                        <strong className="font-semibold text-[#51243A] tabular-nums">{formatINR(account.meta.quarterlyPayout)}</strong>
                      </div>
                    )}
                    {account.meta.nominee && (
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#54525C] block">Registered Nominee</span>
                        <strong className={account.meta.nominee === 'MISSING' ? 'text-rose-700 font-bold' : 'font-semibold text-[#24232A]'}>
                          {account.meta.nominee}
                        </strong>
                      </div>
                    )}
                    {account.meta.duplicateWith && (
                      <div className="col-span-2 sm:col-span-4">
                        <p className="text-[11px] text-[#A3803F] bg-[#C6A15B]/10 border border-[#C6A15B]/30 rounded-lg p-2 font-medium">
                          Coverage Notice: Potential redundancy with policy #{account.meta.duplicateWith}. Teammate audit recommended.
                        </p>
                      </div>
                    )}
                    {account.meta.moratoriumPeriod && (
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#54525C] block">Moratorium Shield</span>
                        <strong className="font-semibold text-[#51243A]">{account.meta.moratoriumPeriod}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          Editorial 90-Day Transaction Ledger
          ========================================================================= */}
      <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-[#EDE7DC] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-4">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#24232A]">
              {t('recentTransactions')}
            </h2>
            <p className="text-xs text-[#54525C] font-editorial italic">
              Verified statement entries over the last 90 days
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#EDE7DC] text-[#51243A] rounded-full">
            {persona.transactions.length} Ledger Lines
          </span>
        </div>

        <div className="divide-y divide-[#EDE7DC]/70 max-h-96 overflow-y-auto pr-1">
          {persona.transactions.slice(0, 16).map((tx) => {
            const isCredit = tx.amount > 0;
            return (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-[#EDE7DC]/20 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                      isCredit ? 'bg-[#51243A]/10 text-[#51243A]' : 'bg-[#EDE7DC] text-[#24232A]'
                    }`}
                  >
                    {isCredit ? <ArrowUpRight className="w-4 h-4 text-[#C6A15B]" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-[#24232A] leading-snug">
                      {tx.merchant}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#54525C] mt-0.5">
                      <span>{tx.category}</span>
                      <span className="text-[#C6A15B]">·</span>
                      <span>{formatDate(tx.date)}</span>
                      {tx.recurring && (
                        <>
                          <span className="text-[#C6A15B]">·</span>
                          <span className="text-[#51243A] font-semibold">Recurring</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`font-editorial text-base font-bold tabular-nums ${
                      isCredit ? 'text-[#51243A]' : 'text-[#24232A]'
                    }`}
                  >
                    {formatINR(tx.amount, { showSign: true })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
