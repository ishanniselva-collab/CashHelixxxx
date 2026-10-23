import React, { createContext, useContext, useState, useEffect } from 'react';
import { personas } from '../data/personas.js';
import { translations } from '../i18n.js';

const PersonaContext = createContext(null);

export function PersonaProvider({ children }) {
  const [personaId, setPersonaIdState] = useState(() => {
    try {
      const saved = localStorage.getItem('cashhelix_persona_id');
      if (saved && personas[saved]) return saved;
    } catch {
      // localStorage may fail in restricted sandboxes
    }
    return 'gig';
  });

  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('cashhelix_lang');
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'ta')) return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  const [hasConsented, setHasConsentedState] = useState(() => {
    try {
      return localStorage.getItem('cashhelix_aa_consent') === 'true';
    } catch {
      return false;
    }
  });

  const setPersonaId = (id) => {
    if (personas[id]) {
      setPersonaIdState(id);
      try {
        localStorage.setItem('cashhelix_persona_id', id);
      } catch {
        // ignore
      }
    }
  };

  const setLang = (newLang) => {
    if (['en', 'hi', 'ta'].includes(newLang)) {
      setLangState(newLang);
      try {
        localStorage.setItem('cashhelix_lang', newLang);
      } catch {
        // ignore
      }
    }
  };

  const setHasConsented = (status) => {
    setHasConsentedState(status);
    try {
      localStorage.setItem('cashhelix_aa_consent', status ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  const persona = personas[personaId] || personas.gig;

  const t = (key) => {
    const langDict = translations[lang] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <PersonaContext.Provider
      value={{
        persona,
        personaId,
        setPersonaId,
        lang,
        setLang,
        hasConsented,
        setHasConsented,
        t,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
