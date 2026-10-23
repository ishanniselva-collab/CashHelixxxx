import React, { useState } from 'react';
import { usePersona } from '../context/PersonaContext.jsx';
import { personas } from '../data/personas.js';
import { ShieldCheck, ChevronDown, Globe } from 'lucide-react';

export default function Header({ onOpenConsent }) {
  const { persona, personaId, setPersonaId, lang, setLang, hasConsented, t } = usePersona();
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const personaList = Object.values(personas);

  return (
    <header className="sticky top-0 z-30 bg-[#F8F4EC]/95 backdrop-blur-md border-b border-[#EDE7DC] px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single Text Element Wordmark in Editorial Serif */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#51243A] text-[#F8F4EC] flex items-center justify-center font-editorial text-lg font-bold shadow-xs">
            CH
          </div>
          <div>
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#24232A] whitespace-nowrap">
              CashHelix
            </span>
          </div>
        </div>

        {/* Zone 2: Editorial Persona Switcher & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Persona Switcher Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsPersonaOpen(!isPersonaOpen);
                setIsLangOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#FDFBF7] hover:bg-white border border-[#EDE7DC] rounded-xl text-xs font-semibold text-[#24232A] shadow-2xs transition-colors"
            >
              <span className="max-w-[120px] sm:max-w-[170px] truncate">
                {persona.name}
              </span>
              <span className="hidden md:inline text-[#54525C] font-normal font-editorial italic">
                · {t(`persona_${persona.id}`)}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
            </button>

            {isPersonaOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsPersonaOpen(false)}
                />
                <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-76 bg-[#FDFBF7] rounded-2xl shadow-xl border border-[#EDE7DC] py-2 z-30 animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#54525C] border-b border-[#EDE7DC]/70 mb-1">
                    {t('switchPersona')}
                  </div>
                  {personaList.map((p) => {
                    const isSelected = p.id === personaId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPersonaId(p.id);
                          setIsPersonaOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                          isSelected ? 'bg-[#51243A]/5 text-[#51243A]' : 'hover:bg-[#EDE7DC]/40 text-[#24232A]'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold font-editorial mt-0.5 shrink-0 ${
                            isSelected ? 'bg-[#51243A] text-[#F8F4EC]' : 'bg-[#EDE7DC] text-[#24232A]'
                          }`}
                        >
                          {p.id.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate leading-tight font-editorial text-sm">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-[#54525C] truncate leading-snug">
                            {p.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Language Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsPersonaOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FDFBF7] hover:bg-white border border-[#EDE7DC] rounded-xl text-xs font-semibold text-[#24232A] transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span className="uppercase text-[11px] tracking-wider font-semibold">
                {lang}
              </span>
            </button>

            {isLangOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsLangOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-36 bg-[#FDFBF7] rounded-xl shadow-lg border border-[#EDE7DC] py-1.5 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setLang('en');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between ${
                      lang === 'en' ? 'bg-[#51243A]/10 text-[#51243A] font-bold' : 'text-[#24232A] hover:bg-[#EDE7DC]/40'
                    }`}
                  >
                    <span>English</span>
                    <span className="text-[10px] text-[#54525C]">EN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang('hi');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between ${
                      lang === 'hi' ? 'bg-[#51243A]/10 text-[#51243A] font-bold' : 'text-[#24232A] hover:bg-[#EDE7DC]/40'
                    }`}
                  >
                    <span>हिन्दी</span>
                    <span className="text-[10px] text-[#54525C]">HI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang('ta');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between ${
                      lang === 'ta' ? 'bg-[#51243A]/10 text-[#51243A] font-bold' : 'text-[#24232A] hover:bg-[#EDE7DC]/40'
                    }`}
                  >
                    <span>தமிழ்</span>
                    <span className="text-[10px] text-[#54525C]">TA</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Zone 3: 1 Primary Action (AA Regulatory Status / Trigger) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenConsent}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              hasConsented
                ? 'bg-[#51243A]/8 text-[#51243A] border border-[#51243A]/20 hover:bg-[#51243A]/12'
                : 'bg-[#51243A] text-[#F8F4EC] hover:bg-[#3A1929] shadow-xs'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span className="hidden sm:inline">
              {hasConsented ? t('connectedAA') : t('connectAA')}
            </span>
            <span className="sm:hidden">
              {hasConsented ? 'AA' : 'Link'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
