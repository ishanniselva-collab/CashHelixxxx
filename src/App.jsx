import React, { useState } from 'react';
import { PersonaProvider, usePersona } from './context/PersonaContext.jsx';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import Home from './pages/Home.jsx';
import Accounts from './pages/Accounts.jsx';
import Insights from './pages/Insights.jsx';
import Goals from './pages/Goals.jsx';
import Consent from './pages/Consent.jsx';
import VoiceAssistant from './features/voice/VoiceAssistant.jsx';

function AppContent() {
  const { persona, hasConsented } = usePersona();
  const [activeTab, setActiveTab] = useState('home');
  const [showConsentFlow, setShowConsentFlow] = useState(false);

  // If user has not consented yet on first run, show the Account Aggregator onboarding
  if (!hasConsented && showConsentFlow) {
    return <Consent onComplete={() => setShowConsentFlow(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#24232A] flex flex-col font-sans selection:bg-[#C6A15B]/30 selection:text-[#51243A]">
      {/* Top Navigation Bar with Persona Switcher & Language Selector */}
      <Header onOpenConsent={() => setShowConsentFlow(true)} />

      {/* Main Tab Content */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && <Home />}
        {activeTab === 'accounts' && <Accounts />}
        {activeTab === 'insights' && <Insights persona={persona} />}
        {activeTab === 'goals' && <Goals />}
      </main>

      {/* Floating Voice Assistant (Mounted Globally - Contract Intact) */}
      <VoiceAssistant />

      {/* Account Aggregator Fullscreen Modal when explicitly opened */}
      {showConsentFlow && (
        <div className="fixed inset-0 z-50 bg-[#24232A]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl my-8">
            <button
              type="button"
              onClick={() => setShowConsentFlow(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#24232A]/80 text-[#F8F4EC] hover:bg-[#51243A] flex items-center justify-center text-xs transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
            <Consent onComplete={() => setShowConsentFlow(false)} />
          </div>
        </div>
      )}

      {/* Fixed Bottom Tab Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <PersonaProvider>
      <AppContent />
    </PersonaProvider>
  );
}
