import React, { useState } from 'react';
import { usePersona } from '../context/PersonaContext.jsx';
import { formatINR, formatDate } from '../utils/formatters.js';
import {
  Compass,
  Calendar,
  Plus,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function Goals() {
  const { persona, t } = usePersona();

  const [goalsList, setGoalsList] = useState(() => persona.goals || []);
  const [missedMonthsMap, setMissedMonthsMap] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    saved: '',
    deadline: '2027-06-30'
  });

  const calculateMonthsRemaining = (deadlineStr) => {
    const target = new Date(deadlineStr);
    const current = new Date('2026-10-22');
    let months = (target.getFullYear() - current.getFullYear()) * 12 + (target.getMonth() - current.getMonth());
    return Math.max(1, months);
  };

  const handleToggleMissedMonth = (goalId) => {
    setMissedMonthsMap((prev) => {
      const currentMissed = prev[goalId] || 0;
      return {
        ...prev,
        [goalId]: currentMissed === 0 ? 1 : currentMissed === 1 ? 2 : 0
      };
    });
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    const created = {
      id: `goal_custom_${Date.now()}`,
      name: newGoal.name,
      target: Number(newGoal.target),
      saved: Number(newGoal.saved || 0),
      deadline: newGoal.deadline
    };

    setGoalsList((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewGoal({ name: '', target: '', saved: '', deadline: '2027-06-30' });
  };

  React.useEffect(() => {
    setGoalsList(persona.goals || []);
    setMissedMonthsMap({});
  }, [persona]);

  return (
    <div className="space-y-8 pb-28 pt-6 px-4 sm:px-8 max-w-4xl mx-auto">
      {/* Modern Wealth Editorial Goal GPS Banner */}
      <div className="bg-[#51243A] text-[#F8F4EC] rounded-3xl p-6 sm:p-10 shadow-lg border border-[#3A1929] relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#C6A15B]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#DFC486]">
              {t('goalGpsTitle')}
            </span>
          </div>
          <span className="text-[11px] font-editorial italic text-[#DFC486] border border-[#C6A15B]/30 rounded-full px-3 py-0.5 bg-[#3A1929]">
            Reverse Amortization
          </span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-white mb-2">
          Curated Goal GPS Navigator
        </h1>
        <p className="text-xs sm:text-sm text-[#F8F4EC]/85 font-editorial italic max-w-xl mb-6 leading-relaxed">
          {t('goalGpsSubtitle')}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#F8F4EC] text-[#51243A] hover:bg-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#C6A15B]" />
            {t('createNewGoal')}
          </button>
        </div>
      </div>

      {/* Goal GPS Cards */}
      <div className="space-y-5">
        {goalsList.map((goal) => {
          const remainingAmount = Math.max(0, goal.target - goal.saved);
          const baseMonths = calculateMonthsRemaining(goal.deadline);
          const missedMonths = missedMonthsMap[goal.id] || 0;
          const effectiveMonths = Math.max(1, baseMonths - missedMonths);

          const baseMonthlyNeeded = Math.ceil(remainingAmount / baseMonths);
          const recalculatedMonthly = Math.ceil(remainingAmount / effectiveMonths);
          const deltaIncrease = recalculatedMonthly - baseMonthlyNeeded;

          const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));

          return (
            <div
              key={goal.id}
              className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 border border-[#EDE7DC] shadow-2xs space-y-4 hover:border-[#C6A15B]/60 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#24232A]">
                    {goal.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#54525C] font-editorial italic mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Target Horizon: {formatDate(goal.deadline)}</span>
                    <span className="text-[#C6A15B]">·</span>
                    <span>{baseMonths} Months Horizon</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-auto self-start">
                  <button
                    type="button"
                    onClick={() => handleToggleMissedMonth(goal.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      missedMonths > 0
                        ? 'bg-[#C6A15B]/15 border-[#C6A15B] text-[#51243A] font-bold'
                        : 'bg-white border-[#EDE7DC] text-[#54525C] hover:border-[#C6A15B]'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>
                      {missedMonths === 0
                        ? 'Simulate Missed Month'
                        : missedMonths === 1
                        ? '1 Month Missed'
                        : '2 Months Missed'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Progress Bar in Gold and Plum */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#24232A]">
                  <span className="font-editorial italic">Funding Ratio: {pct}%</span>
                  <span className="tabular-nums">
                    <strong className="text-[#51243A] font-bold">{formatINR(goal.saved)}</strong> of {formatINR(goal.target)}
                  </span>
                </div>
                <div className="w-full bg-[#EDE7DC] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#51243A] to-[#C6A15B] h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Reverse Calculated Rate Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="bg-white p-4.5 rounded-2xl border border-[#EDE7DC]">
                  <span className="text-[10px] text-[#54525C] font-semibold uppercase tracking-wider block">
                    {t('monthlyPaceNeeded')} ({baseMonths} Mo Plan)
                  </span>
                  <div className="font-editorial text-2xl font-bold text-[#24232A] tabular-nums mt-1">
                    {formatINR(baseMonthlyNeeded)} <span className="text-xs font-normal text-[#54525C]">/ month</span>
                  </div>
                  <span className="text-[11px] text-[#54525C] font-editorial italic mt-0.5 block">
                    Remaining corpus: {formatINR(remainingAmount)}
                  </span>
                </div>

                <div
                  className={`p-4.5 rounded-2xl border transition-all ${
                    missedMonths > 0
                      ? 'bg-[#C6A15B]/15 border-[#C6A15B]'
                      : 'bg-[#51243A]/5 border-[#51243A]/15'
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider block text-[#51243A]">
                    {missedMonths > 0 ? t('missedMonthImpact') : 'Pace Calibration'}
                  </span>
                  <div
                    className={`font-editorial text-2xl font-bold tabular-nums mt-1 ${
                      missedMonths > 0 ? 'text-[#51243A]' : 'text-[#51243A]'
                    }`}
                  >
                    {formatINR(recalculatedMonthly)} <span className="text-xs font-normal text-[#54525C]">/ month</span>
                  </div>
                  <span className="text-[11px] font-editorial italic block mt-0.5">
                    {missedMonths > 0 ? (
                      <span className="text-[#51243A] font-semibold">
                        +{formatINR(deltaIncrease)} / mo catch-up across remaining {effectiveMonths} months
                      </span>
                    ) : (
                      <span className="text-[#54525C]">
                        Pace optimal · Ready by {formatDate(goal.deadline)}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#24232A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EDE7DC] space-y-4">
            <div className="flex justify-between items-center border-b border-[#EDE7DC] pb-3">
              <h3 className="font-editorial text-2xl font-bold text-[#24232A]">Initialize Goal GPS</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#54525C] hover:text-[#24232A] text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#24232A] mb-1">
                  Goal Title / Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electric Vehicle Reserve, Gold Loan Settlement"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  required
                  className="w-full p-3 bg-white border border-[#EDE7DC] rounded-xl text-[#24232A] focus:outline-none focus:ring-2 focus:ring-[#51243A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#24232A] mb-1">
                    Target Capital (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    required
                    className="w-full p-3 bg-white border border-[#EDE7DC] rounded-xl text-[#24232A] focus:outline-none focus:ring-2 focus:ring-[#51243A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#24232A] mb-1">
                    Current Deposit (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={newGoal.saved}
                    onChange={(e) => setNewGoal({ ...newGoal, saved: e.target.value })}
                    className="w-full p-3 bg-white border border-[#EDE7DC] rounded-xl text-[#24232A] focus:outline-none focus:ring-2 focus:ring-[#51243A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#24232A] mb-1">
                  Target Maturity Date
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full p-3 bg-white border border-[#EDE7DC] rounded-xl text-[#24232A] focus:outline-none focus:ring-2 focus:ring-[#51243A]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#51243A] hover:bg-[#3A1929] text-[#F8F4EC] rounded-xl font-bold transition-colors shadow-xs"
                >
                  Configure Goal GPS
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-3 bg-[#EDE7DC] hover:bg-[#EDE7DC]/80 text-[#24232A] rounded-xl font-medium"
                >
                  Dismiss
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
