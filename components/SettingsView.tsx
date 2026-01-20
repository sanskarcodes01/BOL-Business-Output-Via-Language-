
import React from 'react';
import { UserProfile } from '../types';
import { Shield, MessageCircle, CreditCard, Bell } from 'lucide-react';

interface Props {
  t: any;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const SettingsView: React.FC<Props> = ({ t, user, onUpdateUser }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">{t.settings}</h2>

      <section className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold">{t.whatsappStatus}</h3>
              <p className="text-sm text-slate-500">Auto-send receipts to customers</p>
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
              <p className="text-sm text-slate-500">Current plan: {user.subscription}</p>
            </div>
          </div>
          <button className="text-blue-600 font-bold hover:underline">Upgrade Plan</button>
        </div>

        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center">
            <Bell size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Notifications</h3>
            <p className="text-sm text-slate-500">Reminders for low stock and payments</p>
          </div>
          <select className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm px-3 py-1 outline-none">
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>
      </section>

      <section className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-6 flex items-center gap-4">
        <Shield className="text-red-500" size={32} />
        <div className="flex-1">
           <h3 className="font-bold text-red-700 dark:text-red-400">Security Center</h3>
           <p className="text-sm text-red-600 dark:text-red-300 opacity-80">Enable biometric lock for voice commands</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20">
          Activate
        </button>
      </section>
    </div>
  );
};

export default SettingsView;
