/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PersonaProvider, usePersona } from './context/PersonaContext.jsx';
import Insights from './pages/Insights.jsx';
import VoiceAssistant from './features/voice/VoiceAssistant.jsx';
import { ShieldCheck, UserCheck, Globe, Sparkles } from 'lucide-react';

function Header() {
  const { persona, personaId, setPersonaId, lang, setLang, allPersonas } = usePersona();

  return (
    <header className="sticky top-0 z-40 bg-[#F8F4EC]/95 backdrop-blur-md border-b border-[#E8E2D5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs">
            CH
          </div>
          <div>
            <div className="font-serif font-bold text-lg tracking-tight text-[#24232A]">
              CashHelix
            </div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-emerald-800 -mt-0.5">
              Financial Well-Being
            </div>
          </div>
        </div>

        {/* Global Controls: Persona Switcher & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <label htmlFor="persona-select" className="sr-only">Select Persona</label>
            <div className="flex items-center gap-1.5 bg-white border border-[#D5CEC0] rounded-xl px-2.5 py-1.5 shadow-2xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <select
                id="persona-select"
                value={personaId}
                onChange={(e) => setPersonaId(e.target.value)}
                className="text-xs font-semibold text-[#24232A] bg-transparent focus:outline-hidden cursor-pointer"
              >
                {allPersonas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-white border border-[#D5CEC0] rounded-xl p-1 shadow-2xs text-xs font-semibold">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                lang === 'en' ? 'bg-emerald-800 text-white' : 'text-[#666258] hover:text-[#24232A]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                lang === 'hi' ? 'bg-emerald-800 text-white' : 'text-[#666258] hover:text-[#24232A]'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('ta')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                lang === 'ta' ? 'bg-emerald-800 text-white' : 'text-[#666258] hover:text-[#24232A]'
              }`}
            >
              தமிழ்
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}

function MainContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#24232A]">
      <Header />
      <div className="flex-1">
        <Insights />
      </div>
      <footer className="border-t border-[#E8E2D5] py-6 text-center text-xs text-[#736F66]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CashHelix India · Financial health scoring, leakage detection & seasonal planning</span>
          <span className="font-mono">Local Mock Sandbox · 6 Personas Active</span>
        </div>
      </footer>
      {/* Floating Globally Mounted Voice Assistant */}
      <VoiceAssistant />
    </div>
  );
}

export default function App() {
  return (
    <PersonaProvider>
      <MainContent />
    </PersonaProvider>
  );
}
