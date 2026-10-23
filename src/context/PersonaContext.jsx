import React, { createContext, useContext, useState, useMemo } from 'react';
import { PERSONAS } from '../data/personas.js';

/**
 * @typedef {'gig' | 'student' | 'shopkeeper' | 'family' | 'senior' | 'shg'} PersonaId
 * @typedef {'en' | 'hi' | 'ta'} Language
 * 
 * @typedef {Object} PersonaContextType
 * @property {any} persona
 * @property {PersonaId} personaId
 * @property {(id: string) => void} setPersonaId
 * @property {Language} lang
 * @property {(lang: Language) => void} setLang
 * @property {any[]} allPersonas
 */

/** @type {React.Context<PersonaContextType>} */
const PersonaContext = createContext(/** @type {any} */ ({
  persona: PERSONAS.gig,
  personaId: 'gig',
  setPersonaId: () => {},
  lang: 'en',
  setLang: () => {},
  allPersonas: Object.values(PERSONAS),
}));

export function PersonaProvider({ children, initialPersonaId = 'gig', initialLang = 'en' }) {
  const [personaId, setPersonaId] = useState(initialPersonaId);
  const [lang, setLang] = useState(initialLang);

  const persona = useMemo(() => {
    return PERSONAS[personaId] || PERSONAS.gig;
  }, [personaId]);

  const value = useMemo(() => ({
    persona,
    personaId,
    setPersonaId,
    lang,
    setLang,
    allPersonas: Object.values(PERSONAS)
  }), [persona, personaId, lang]);

  return (
    <PersonaContext.Provider value={value}>
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
