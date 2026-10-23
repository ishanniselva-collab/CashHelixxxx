import React from 'react';
import { usePersona } from '../context/PersonaContext.jsx';
import { Home, Wallet, LineChart, Target } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { t } = usePersona();

  const tabs = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'accounts', label: t('navAccounts'), icon: Wallet },
    { id: 'insights', label: t('navInsights'), icon: LineChart },
    { id: 'goals', label: t('navGoals'), icon: Target },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F8F4EC]/95 backdrop-blur-md border-t border-[#EDE7DC] shadow-[0_-2px_12px_rgba(36,35,42,0.03)]">
      <div className="max-w-md md:max-w-xl mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors select-none ${
                isActive
                  ? 'text-[#51243A] font-bold'
                  : 'text-[#54525C] hover:text-[#24232A] font-normal'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#51243A] stroke-[2.4]' : 'stroke-[1.7]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#C6A15B] rounded-full" />
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1 truncate max-w-[70px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
