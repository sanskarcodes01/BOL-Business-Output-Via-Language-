
import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { Shield, MessageCircle, CreditCard, Bell, Mic, User, Store, Languages } from 'lucide-react';
import VoiceModal from './VoiceModal';

interface Props {
  t: any;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const SettingsView: React.FC<Props> = ({ t, user, onUpdateUser, lang, setLang }) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">{t.settings}</h2>

      <section className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t.profileSettings}</h3>
              <p className="text-sm text-slate-500">{t.manageIdentity}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsVoiceActive(true)}
            className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
            title="Update with Voice"
          >
            <Mic size={20} />
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">{t.businessName}</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={user.businessName}
                onChange={(e) => onUpdateUser({ ...user, businessName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder={t.enterBusinessName}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">{t.ownerName}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={user.ownerName}
                onChange={(e) => onUpdateUser({ ...user, ownerName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder={t.enterOwnerName}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <Languages size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t.languageSettings}</h3>
            <p className="text-sm text-slate-500">{t.chooseLanguage}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'हिन्दी' },
            { code: 'gu', label: 'ગુજરાતી' },
            { code: 'pa', label: 'ਪੰਜਾਬੀ' }
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code as Language)}
              className={`p-4 rounded-xl border-2 transition-all ${
                lang === l.code 
                  ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
            >
              <span className={`text-lg font-bold block mb-1 ${
                l.code === 'gu' ? 'font-gujarati' : l.code === 'pa' ? 'font-punjabi' : ''
              }`}>
                {l.label}
              </span>
              {lang === l.code && <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{t.active}</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold">{t.whatsappStatus}</h3>
              <p className="text-sm text-slate-500">{t.autoSendReceipts}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={user.whatsappEnabled} 
              onChange={() => onUpdateUser({ ...user, whatsappEnabled: !user.whatsappEnabled })} 
              className="sr-only peer" 
            />
            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <CreditCard size={24} />
            </div>
            <div>
              <h3 className="font-bold">{t.subscription}</h3>
              <p className="text-sm text-slate-500">{t.currentPlan} {user.subscription}</p>
            </div>
          </div>
          <button className="text-blue-600 font-bold hover:underline">{t.upgradePlan}</button>
        </div>

        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center">
            <Bell size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">{t.notifications}</h3>
            <p className="text-sm text-slate-500">{t.reminders}</p>
          </div>
          <select className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm px-3 py-1 outline-none">
            <option>{t.enabled}</option>
            <option>{t.disabled}</option>
          </select>
        </div>
      </section>

      <section className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-6 flex items-center gap-4">
        <Shield className="text-red-500" size={32} />
        <div className="flex-1">
           <h3 className="font-bold text-red-700 dark:text-red-400">{t.securityCenter}</h3>
           <p className="text-sm text-red-600 dark:text-red-300 opacity-80">{t.enableBiometric}</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20">
          {t.activate}
        </button>
      </section>

      {isVoiceActive && (
        <VoiceModal 
          t={t} 
          lang={lang}
          onClose={() => setIsVoiceActive(false)} 
          onIntent={(intent) => {
            if (intent.action === 'UPDATE_PROFILE') {
              const updates: Partial<UserProfile> = {};
              if (intent.businessName) updates.businessName = intent.businessName;
              if (intent.ownerName) updates.ownerName = intent.ownerName;
              if (Object.keys(updates).length > 0) {
                onUpdateUser({ ...user, ...updates });
              }
            }
            setIsVoiceActive(false);
          }}
        />
      )}
    </div>
  );
};

export default SettingsView;
