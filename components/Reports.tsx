
import React from 'react';
import { Transaction } from '../types';
import { Download, FileText, FileDown, PieChart } from 'lucide-react';

interface Props {
  t: any;
  transactions: Transaction[];
}

const Reports: React.FC<Props> = ({ t, transactions }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t.reports}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <FileText size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Monthly Business Report</h3>
            <p className="text-slate-500 mt-2">Comprehensive summary of sales, expenses, and inventory health for the current month.</p>
          </div>
          <div className="flex gap-4 w-full">
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all">
              <Download size={18} />
              PDF
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 py-4 rounded-2xl font-bold transition-all">
              <FileDown size={18} />
              Word
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <PieChart size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Tax & Ledger Statement</h3>
            <p className="text-slate-500 mt-2">Formatted export for accounting purposes. GST ready and reconciled with daily logs.</p>
          </div>
          <div className="flex gap-4 w-full">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 transition-all">
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold">Privacy & Data Control</h3>
            <p className="text-blue-100 mt-2 opacity-80">Your business data is yours. Export everything or wipe history permanently at any time.</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-bold transition-all">Export All (JSON)</button>
             <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-bold transition-all">Wipe History</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default Reports;
