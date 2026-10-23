import React, { useState } from 'react';
import { usePersona } from '../context/PersonaContext.jsx';
import { ShieldCheck, CheckCircle2, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';

const INSTITUTIONS = [
  { id: 'sbi', name: 'State Bank of India', code: 'SBIN', logoText: 'SBI', popularFor: ['student', 'family', 'senior'] },
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC', logoText: 'HDFC', popularFor: ['family', 'shopkeeper'] },
  { id: 'canara', name: 'Canara Bank', code: 'CNRB', logoText: 'CAN', popularFor: ['gig', 'senior'] },
  { id: 'bob', name: 'Bank of Baroda', code: 'BARB', logoText: 'BOB', popularFor: ['shopkeeper'] },
  { id: 'boi', name: 'Bank of India', code: 'BKID', logoText: 'BOI', popularFor: ['shg'] },
  { id: 'icici', name: 'ICICI Bank', code: 'ICIC', logoText: 'ICICI', popularFor: ['family'] },
  { id: 'paytm', name: 'Paytm Payments Bank', code: 'PYTM', logoText: 'PYTM', popularFor: ['gig', 'shopkeeper'] },
  { id: 'phonepe', name: 'PhonePe Account Aggregator', code: 'PPAY', logoText: 'PPe', popularFor: ['student', 'gig'] }
];

export default function Consent({ onComplete }) {
  const { persona, t, hasConsented, setHasConsented } = usePersona();

  const [selectedFips, setSelectedFips] = useState(() => {
    return INSTITUTIONS
      .filter((inst) => inst.popularFor.includes(persona.id))
      .map((inst) => inst.id);
  });
  const [duration, setDuration] = useState('12_months');
  const [frequency, setFrequency] = useState('daily');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['5', '4', '8', '2']);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const toggleFip = (id) => {
    setSelectedFips((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  const handleApprove = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setHasConsented(true);
      if (onComplete) onComplete();
    }, 900);
  };

  const handleRevoke = () => {
    setHasConsented(false);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto bg-[#FDFBF7] rounded-3xl border border-[#EDE7DC] shadow-lg overflow-hidden">
        {/* AA Header Banner - Deep Plum with Muted Gold */}
        <div className="bg-[#51243A] text-[#F8F4EC] p-6 sm:p-9 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#DFC486]">
                RBI Regulated Account Aggregator Protocol
              </span>
            </div>
            {hasConsented && (
              <span className="text-xs font-semibold px-3 py-1 bg-[#3A1929] border border-[#C6A15B]/30 rounded-full text-[#DFC486] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B]" /> Active
              </span>
            )}
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Sahamati AA Digital Consent
          </h1>
          <p className="text-xs sm:text-sm text-[#F8F4EC]/85 font-editorial italic leading-relaxed">
            Encrypted statement pipeline consolidating balances, recurring debits, and deposit maturities for {persona.name}.
            Read-only, zero credentials shared.
          </p>
        </div>

        {/* Wizard Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block font-editorial text-lg font-bold text-[#24232A] mb-1">
                  1. Authorize Financial Institutions
                </label>
                <p className="text-xs text-[#54525C] font-editorial italic mb-3.5">
                  Select repositories under Aadhaar registration for {persona.label}:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {INSTITUTIONS.map((inst) => {
                    const isSelected = selectedFips.includes(inst.id);
                    return (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => toggleFip(inst.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-[#51243A] bg-[#51243A]/5 ring-1 ring-[#51243A]'
                            : 'border-[#EDE7DC] hover:border-[#C6A15B]/60 bg-white'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-editorial font-bold text-sm ${
                            isSelected
                              ? 'bg-[#51243A] text-[#F8F4EC]'
                              : 'bg-[#EDE7DC] text-[#24232A]'
                          }`}
                        >
                          {inst.logoText}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#24232A] truncate">
                            {inst.name}
                          </p>
                          <p className="text-[10px] text-[#54525C] font-mono">
                            {inst.code}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consent Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#24232A] mb-1.5">
                    Consent Validity Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-[#EDE7DC] rounded-xl px-3 py-2.5 text-[#24232A] focus:outline-none focus:ring-2 focus:ring-[#51243A]"
                  >
                    <option value="3_months">3 Months (Short audit)</option>
                    <option value="6_months">6 Months (Semi-annual)</option>
                    <option value="12_months">12 Months (Curated pace)</option>
                    <option value="24_months">24 Months (Multi-year plan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#24232A] mb-1.5">
                    Sync Cadence
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-[#EDE7DC] rounded-xl px-3 py-2.5 text-[#24232A] focus:outline-none focus:ring-2 focus:ring-[#51243A]"
                  >
                    <option value="daily">Daily Automated Fetch</option>
                    <option value="weekly">Weekly Summary Fetch</option>
                    <option value="on_demand">On-Demand Discretionary</option>
                  </select>
                </div>
              </div>

              {/* Security Safeguards */}
              <div className="bg-[#EDE7DC]/40 rounded-2xl p-4 border border-[#EDE7DC] text-xs text-[#24232A] space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 font-editorial text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
                  Your Consent Rights & Privacy Safeguards
                </div>
                <ul className="space-y-1 text-[11px] text-[#54525C] font-editorial italic list-disc list-inside">
                  <li>256-bit asymmetric cryptography regulated by Reserve Bank of India</li>
                  <li>One-click revocable consent at any time without fees</li>
                  <li>Statement summaries only; transaction authority or balance debits impossible</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={selectedFips.length === 0}
                  className="flex-1 py-3.5 px-4 bg-[#51243A] hover:bg-[#3A1929] disabled:opacity-50 text-[#F8F4EC] rounded-xl text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Approve ({selectedFips.length} Repositories)
                  <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
                </button>
                {hasConsented && (
                  <button
                    type="button"
                    onClick={onComplete}
                    className="py-3 px-4 bg-[#EDE7DC] hover:bg-[#EDE7DC]/80 text-[#24232A] rounded-xl text-xs font-semibold transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-[#51243A]/10 text-[#51243A] rounded-full flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6 text-[#C6A15B]" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#24232A]">
                  Account Aggregator Authentication
                </h3>
                <p className="text-xs text-[#54525C] font-editorial italic mt-1 max-w-sm mx-auto">
                  A verification code was dispatched to the mobile number registered with your Aadhaar for {persona.name}.
                </p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#EDE7DC] space-y-2 text-xs">
                <div className="flex justify-between text-[#54525C]">
                  <span>Authorized FIPs:</span>
                  <span className="font-bold text-[#24232A]">{selectedFips.length} Connected</span>
                </div>
                <div className="flex justify-between text-[#54525C]">
                  <span>Consent Validity:</span>
                  <span className="font-bold text-[#24232A]">{duration.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-[#54525C]">
                  <span>Audit Purpose:</span>
                  <span className="font-bold text-[#24232A]">Holistic Wealth & Liquidity Calibration</span>
                </div>
              </div>

              {/* Simulated OTP */}
              <div>
                <label className="block text-center text-xs font-bold uppercase tracking-wider text-[#24232A] mb-2">
                  Enter 4-Digit Sahamati OTP
                </label>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[idx] = e.target.value.slice(-1);
                        setOtp(newOtp);
                      }}
                      className="w-12 h-12 text-center font-editorial text-2xl font-bold bg-white border border-[#EDE7DC] rounded-xl text-[#24232A] focus:outline-none focus:ring-2 focus:ring-[#51243A]"
                    />
                  ))}
                </div>
                <p className="text-center text-[11px] text-[#54525C] font-editorial italic mt-2">
                  Pre-filled sandbox token for seamless verification
                </p>
              </div>

              <div className="pt-3 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isAuthorizing}
                  className="w-full py-3.5 px-4 bg-[#51243A] hover:bg-[#3A1929] disabled:opacity-60 text-[#F8F4EC] rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isAuthorizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C6A15B]" />
                      Authenticating AA Session...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#C6A15B]" />
                      Confirm & Ratify Consent
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#54525C] hover:text-[#24232A] py-1 font-editorial italic"
                >
                  ← Modify selected institutions or duration
                </button>
              </div>
            </div>
          )}

          {hasConsented && step === 1 && (
            <div className="border-t border-[#EDE7DC] pt-4 flex items-center justify-between">
              <span className="text-xs text-[#54525C] font-editorial italic">
                Revoke previously granted permissions?
              </span>
              <button
                type="button"
                onClick={handleRevoke}
                className="text-xs text-rose-700 hover:text-rose-900 font-bold"
              >
                Revoke AA License
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
