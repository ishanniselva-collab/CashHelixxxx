import React, { createContext, useContext, useState, useEffect } from 'react';
import { PERSONAS as personas } from "../data/personas.js";
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
  const allPersonas = Object.values(personas);

  const t = (key) => {
    if (!key) return '';
    const langDict = translations[lang] || translations.en;
    if (langDict[key] !== undefined) return langDict[key];
    if (key.includes('.')) {
      const parts = key.split('.');
      let cur = langDict;
      for (const p of parts) {
        if (cur && cur[p] !== undefined) cur = cur[p];
        else { cur = undefined; break; }
      }
      if (cur !== undefined && typeof cur !== 'object') return cur;
      let enCur = translations.en;
      for (const p of parts) {
        if (enCur && enCur[p] !== undefined) enCur = enCur[p];
        else { enCur = undefined; break; }
      }
      if (enCur !== undefined && typeof enCur !== 'object') return enCur;
    }
    return translations.en[key] || key;
  };

  const getTranslationFn = (targetLang = lang) => {
    return translations[targetLang] || translations.en;
  };

  return (
    <PersonaContext.Provider
      value={{
        persona,
        personaId,
        setPersonaId,
        allPersonas,
        lang,
        setLang,
        hasConsented,
        setHasConsented,
        t,
        getTranslation: getTranslationFn,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export { getTranslation } from '../i18n.js';

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
