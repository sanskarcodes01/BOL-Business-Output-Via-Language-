import React, { useState } from 'react';
import { Package, Mic, Store, BookOpen, ArrowRight, CheckCircle2, Languages } from 'lucide-react';
import { Language } from '../types';

interface Props {
  onLogin: (name: string, business: string) => void;
  t: any;
  lang: string;
  onSetLang: (lang: Language) => void;
}

const LandingPage: React.FC<Props> = ({ onLogin, t, lang, onSetLang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(name || 'Demo User', business || 'Demo Store');
  };

  const getLangName = () => {
    switch(lang) {
      case 'en': return 'English';
      case 'hi': return 'हिन्दी';
      case 'gu': return 'ગુજરાતી';
      case 'pa': return 'ਪੰਜਾਬੀ';
      default: return 'English';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="B.O.L Logo" className="w-10 h-10 rounded-lg shadow-sm" referrerPolicy="no-referrer" />
          <h1 className="font-bold text-2xl tracking-tight">{t.appName}</h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
          {(['en', 'hi', 'gu', 'pa'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => onSetLang(l)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                lang === l 
                  ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : l === 'gu' ? 'ગુજરાતી' : 'ਪੰਜਾਬੀ'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Hero & Features */}
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-xl mx-auto lg:mx-0">
            <h2 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
              {t.empowering}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12">
              {t.landingSubtitle}
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400 mt-1">
                  <Mic size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{t.feature1Title}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t.feature1Desc}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-2xl text-green-600 dark:text-green-400 mt-1">
                  <Store size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{t.feature2Title}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t.feature2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-2xl text-orange-600 dark:text-orange-400 mt-1">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{t.feature3Title}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t.feature3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 bg-white dark:bg-slate-800 p-8 lg:p-16 flex flex-col justify-center border-l border-slate-200 dark:border-slate-700">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{isLogin ? t.welcomeTo + ' ' + t.appName : t.signup}</h2>
              <p className="text-slate-500 dark:text-slate-400">
                {isLogin ? t.login : t.getStarted}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.fullName}</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Rahul Kumar"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.businessName}</label>
                    <input 
                      type="text" 
                      value={business}
                      onChange={e => setBusiness(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Rahul Kirana Store"
                      required={!isLogin}
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">{t.phoneNumber}</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t.password}</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all mt-6 flex items-center justify-center gap-2"
              >
                {isLogin ? t.login : t.signup}
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isLogin ? t.dontHaveAccount : t.alreadyHaveAccount}{' '}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  {isLogin ? t.signup : t.login}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
