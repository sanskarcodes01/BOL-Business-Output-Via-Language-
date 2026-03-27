
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Loader2, CheckCircle2, Volume2 } from 'lucide-react';
import { parseVoiceIntent } from '../services/geminiService';
import { Language, ParsedIntent } from '../types';

interface Props {
  t: any;
  lang: Language;
  onClose: () => void;
  onIntent: (intent: ParsedIntent) => void;
}

const VoiceModal: React.FC<Props> = ({ t, lang, onClose, onIntent }) => {
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Basic Web Speech API Setup
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      let langCode = 'en-IN';
      if (lang === 'hi') langCode = 'hi-IN';
      else if (lang === 'gu') langCode = 'gu-IN';
      else if (lang === 'pa') langCode = 'pa-IN';
      
      recognitionRef.current.lang = langCode;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
        if (event.results[current].isFinal) {
           handleProcess(result);
        }
      };

      recognitionRef.current.start();
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [lang]);

  const handleProcess = async (text: string) => {
    setIsProcessing(true);
    const intent = await parseVoiceIntent(text);
    setIsProcessing(false);
    onIntent(intent);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Mic className="text-blue-600" />
              {t.voiceCommand}
            </h2>
            <p className="text-slate-500 mt-1">{t.placeholderVoice}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 space-y-8">
          <div className={`relative ${isListening ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
            <div className={`absolute inset-0 bg-blue-500/20 rounded-full animate-ping ${!isListening && 'hidden'}`}></div>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isListening ? 'bg-blue-600 shadow-xl shadow-blue-500/40' : 'bg-slate-100 dark:bg-slate-700'}`}>
              {isProcessing ? <Loader2 size={48} className="text-white animate-spin" /> : <Mic size={48} className={isListening ? 'text-white' : 'text-slate-400'} />}
            </div>
          </div>

          <div className="text-center w-full min-h-[4rem]">
            {transcript ? (
              <p className="text-xl font-medium px-4">"{transcript}"</p>
            ) : (
              <p className="text-slate-400 animate-pulse">{isListening ? t.listening : t.thinking}</p>
            )}
            {isProcessing && (
              <p className="text-blue-600 font-bold mt-4 flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                {t.processing}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => { if(recognitionRef.current) recognitionRef.current.start(); }}
            disabled={isListening || isProcessing}
            className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
          >
            {t.startListening}
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;
