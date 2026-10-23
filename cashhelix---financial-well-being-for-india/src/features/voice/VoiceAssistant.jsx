import React, { useState, useEffect, useRef } from 'react';
import { usePersona } from '../../context/PersonaContext.jsx';
import { answerVoiceQuery, formatRupee } from '../insights/calc.js';
import { getTranslation } from '../i18n.js';
import { 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Sparkles, 
  Trash2, 
  AlertCircle,
  HelpCircle,
  CornerDownLeft
} from 'lucide-react';

export default function VoiceAssistant() {
  const { persona, lang } = usePersona();
  const t = getTranslation(lang);

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: lang === 'hi'
        ? `नमस्ते! मैं CashHelix वॉयस असिस्टेंट हूँ। आप मुझसे खर्च, बकाया बिल, हेल्थ स्कोर या त्योहार की बचत के बारे में पूछ सकते हैं।`
        : lang === 'ta'
        ? `வணக்கம்! நான் CashHelix குரல் உதவியாளர். உங்கள் செலவு, அடுத்த பில்கள் அல்லது நிதி ஆரோக்கியம் பற்றி கேட்கலாம்.`
        : `Hello! I'm your CashHelix Voice Assistant. Ask me anything about your spends, upcoming bills, health score, or festival savings.`,
      time: 'Just now'
    }
  ]);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Reset or re-welcome if language shifts
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  // Speak text using Web Speech API Synthesis
  const speakText = (text) => {
    if (isMuted || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('speechSynthesis error:', err);
    }
  };

  // Handle incoming query
  const processQuery = (queryText) => {
    if (!queryText || !queryText.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setSpeechError(null);

    // Compute answer from active persona
    const replyData = answerVoiceQuery(queryText, persona, lang);

    setTimeout(() => {
      const assistantMsg = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: replyData.text,
        category: replyData.category,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
      speakText(replyData.text);
    }, 250);
  };

  // Toggle voice listening
  const toggleListening = () => {
    setSpeechError(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setSpeechError(t.voice.speechUnsupported);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          processQuery(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError(t.voice.micError);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Recognition start failed:', err);
      setIsListening(false);
      setSpeechError(t.voice.micError);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    processQuery(inputText);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text: lang === 'hi'
          ? `चैट रीसेट कर दी गई है। आप कोई नया सवाल पूछ सकते हैं!`
          : lang === 'ta'
          ? `உரையாடல் மீட்டமைக்கப்பட்டது. புதிய கேள்விகளைக் கேட்கலாம்!`
          : `Chat reset. Ask me anything about ${persona.name}'s finances!`,
        time: 'Just now'
      }
    ]);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  return (
    <>
      {/* Floating Global Microphone Action Button */}
      {/* Floating Action Trigger Button - Elevated above BottomNav */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          aria-label={t.voice.buttonLabel}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-800 text-white shadow-xl hover:bg-emerald-900 active:scale-95 transition-all cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-emerald-700/20"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Mic className="w-6 h-6" />
              {/* Subtle pulsing badge */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Floating Chat & Voice Dialogue Sheet / Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 max-h-[580px] h-[520px] bg-white rounded-2xl border border-[#E8E2D5] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Panel Header */}
          <div className="bg-[#24232A] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#3A3832]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">
                  {t.voice.title}
                </h3>
                <p className="text-[11px] text-[#A6A29A]">
                  {persona.name} ({lang.toUpperCase()})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMuted(prev => !prev)}
                title={isMuted ? t.voice.unmuteSpoken : t.voice.muteSpoken}
                className="p-1.5 rounded-lg text-[#A6A29A] hover:text-white hover:bg-[#3A3832] transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-[#A6A29A] hover:text-white hover:bg-[#3A3832] transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#A6A29A] hover:text-white hover:bg-[#3A3832] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-[#FAF7F0] border-b border-[#E8E2D5] px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[#736F66] shrink-0 font-medium">{t.voice.suggestedQuestions}</span>
            {t.voice.sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => processQuery(q)}
                className="px-2.5 py-1 bg-white border border-[#E8E2D5] rounded-full text-[#3A3832] hover:border-emerald-700 hover:text-emerald-900 whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Conversation Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCFAF5]">
            {speechError && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{speechError}</span>
              </div>
            )}

            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div 
                  key={m.id} 
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-emerald-800 text-white rounded-br-xs'
                        : 'bg-white border border-[#E8E2D5] text-[#24232A] rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-[#8C877E] px-1 mt-0.5">
                    {m.time}
                  </span>
                </div>
              );
            })}

            {isListening && (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 animate-pulse">
                <Mic className="w-4 h-4 text-emerald-700 animate-bounce" />
                <span>{t.voice.listening}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Voice Controls Bottom Bar */}
          <div className="p-3 bg-white border-t border-[#E8E2D5]">
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
              {/* Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Stop listening' : 'Start speaking'}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                    : 'bg-[#FAF7F0] text-emerald-800 border-[#E8E2D5] hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input Fallback */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? t.voice.speakNow : t.voice.inputPlaceholder}
                className="flex-1 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs text-[#24232A] placeholder-[#8A857A] focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
