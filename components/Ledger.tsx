import React, { useState } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, Search, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { LedgerEntry } from '../types';
import { sendWhatsAppMessage } from '../services/whatsappService';

interface Props {
  t: any;
  ledger: LedgerEntry[];
  onAddEntry: (entry: Omit<LedgerEntry, 'id' | 'date' | 'status'>) => void;
  onSettleEntry: (id: string) => void;
  onEditEntry: (entry: LedgerEntry) => void;
}

const Ledger: React.FC<Props> = ({ t, ledger, onAddEntry, onSettleEntry, onEditEntry }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [whatsappStatus, setWhatsappStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [newEntry, setNewEntry] = useState({
    customerName: '',
    phoneNumber: '',
    amount: '',
    type: 'GAVE' as 'GAVE' | 'GOT',
    notes: ''
  });

  const totalGave = ledger.filter(l => l.type === 'GAVE' && l.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
  const totalGot = ledger.filter(l => l.type === 'GOT' && l.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalGave - totalGot;

  const filteredLedger = ledger.filter(l => 
    l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.notes && l.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const customerSummary = Object.entries(
    ledger.filter(l => l.status === 'PENDING').reduce((acc, curr) => {
      if (!acc[curr.customerName]) {
        acc[curr.customerName] = { gave: 0, got: 0 };
      }
      if (curr.type === 'GAVE') acc[curr.customerName].gave += curr.amount;
      if (curr.type === 'GOT') acc[curr.customerName].got += curr.amount;
      return acc;
    }, {} as Record<string, { gave: number, got: number }>)
  ).map(([name, totals]: [string, any]) => ({
    name,
    gave: totals.gave,
    got: totals.got,
    net: totals.gave - totals.got
  })).filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.customerName || !newEntry.amount) return;
    
    onAddEntry({
      customerName: newEntry.customerName,
      phoneNumber: newEntry.phoneNumber,
      amount: Number(newEntry.amount),
      type: newEntry.type,
      notes: newEntry.notes
    });
    
    setNewEntry({ customerName: '', phoneNumber: '', amount: '', type: 'GAVE', notes: '' });
    setIsAdding(false);
  };

  const handleSendWhatsApp = async (entry: LedgerEntry) => {
    if (!entry.phoneNumber) {
      setWhatsappStatus({ type: 'error', message: 'No phone number provided.' });
      return;
    }

    const message = `B.O.L Receipt\n\nCustomer: ${entry.customerName}\nAmount: ₹${entry.amount}\nType: ${entry.type === 'GAVE' ? 'Udhaar (Credit)' : 'Advance (Debit)'}\nDate: ${new Date(entry.date).toLocaleDateString()}\nNotes: ${entry.notes || '-'}\n\nThank you for your business!`;

    try {
      await sendWhatsAppMessage(entry.phoneNumber, message);
      setWhatsappStatus({ type: 'success', message: t.whatsappSent });
      setTimeout(() => setWhatsappStatus(null), 3000);
    } catch (error: any) {
      setWhatsappStatus({ type: 'error', message: t.whatsappError });
      setTimeout(() => setWhatsappStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {whatsappStatus && (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-xl shadow-lg border animate-in slide-in-from-right duration-300 ${
          whatsappStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {whatsappStatus.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.ledger}</h1>
          <p className="text-slate-500">{t.netBalance}: <span className={`font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{Math.abs(netBalance).toLocaleString()} {netBalance >= 0 ? `(${t.youGot})` : `(${t.youGave})`}</span></p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          {t.addEntry}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{t.youGave}</p>
            <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">₹{totalGave.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
            <ArrowDownLeft size={24} />
          </div>
          <div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t.youGot}</p>
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">₹{totalGot.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{t.addEntry}</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input 
              type="text" 
              placeholder={t.customerName}
              value={newEntry.customerName}
              onChange={e => setNewEntry({...newEntry, customerName: e.target.value})}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input 
              type="text" 
              placeholder={t.phoneNumber}
              value={newEntry.phoneNumber}
              onChange={e => setNewEntry({...newEntry, phoneNumber: e.target.value})}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="number" 
              placeholder={t.amount}
              value={newEntry.amount}
              onChange={e => setNewEntry({...newEntry, amount: e.target.value})}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select 
              value={newEntry.type}
              onChange={e => setNewEntry({...newEntry, type: e.target.value as 'GAVE' | 'GOT'})}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="GAVE">{t.gave}</option>
              <option value="GOT">{t.got}</option>
            </select>
            <input 
              type="text" 
              placeholder={t.notes}
              value={newEntry.notes}
              onChange={e => setNewEntry({...newEntry, notes: e.target.value})}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
                {t.confirm}
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold rounded-xl transition-all">
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm mb-6">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-lg">{t.customerBalances}</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-medium">{t.customerName}</th>
                <th className="p-4 font-medium">{t.youGave}</th>
                <th className="p-4 font-medium">{t.youGot}</th>
                <th className="p-4 font-medium">{t.netBalance}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {customerSummary.map((customer, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium">{customer.name}</td>
                  <td className="p-4 text-red-600 dark:text-red-400 font-medium">₹{customer.gave.toLocaleString()}</td>
                  <td className="p-4 text-green-600 dark:text-green-400 font-medium">₹{customer.got.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`font-bold ${customer.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {customer.net >= 0 ? '+' : '-'}₹{Math.abs(customer.net).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              {customerSummary.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    {t.noTransactions}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-lg">{t.recentTransactions}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-medium">{t.date}</th>
                <th className="p-4 font-medium">{t.customerName}</th>
                <th className="p-4 font-medium">{t.amount}</th>
                <th className="p-4 font-medium">{t.notes}</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium">
                    {entry.customerName}
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${entry.type === 'GAVE' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {entry.type === 'GAVE' ? '-' : '+'}₹{entry.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {entry.notes || '-'}
                  </td>
                  <td className="p-4">
                    {entry.status === 'SETTLED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-lg text-xs font-bold">
                        <CheckCircle2 size={14} /> {t.settled}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg text-xs font-bold">
                        <Clock size={14} /> {t.pending}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {entry.status === 'PENDING' && (
                      <button 
                        onClick={() => onSettleEntry(entry.id)}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                      >
                        {t.markSettled}
                      </button>
                    )}
                    <button 
                      onClick={() => setEditingEntry(entry)}
                      className="text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mr-3"
                    >
                      {t.edit || 'Edit'}
                    </button>
                    <button 
                      onClick={() => handleSendWhatsApp(entry)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 rounded-lg text-xs font-bold transition-colors border border-green-100 dark:border-green-900/30"
                      title={t.sendWhatsApp}
                    >
                      <MessageSquare size={14} />
                      {t.sendWhatsApp || 'Send Receipt'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLedger.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    {t.noTransactions}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingEntry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-xl mb-4">{t.editEntry || 'Edit Entry'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onEditEntry(editingEntry);
              setEditingEntry(null);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.customerName}</label>
                <input 
                  type="text" 
                  value={editingEntry.customerName}
                  onChange={e => setEditingEntry({...editingEntry, customerName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.phoneNumber}</label>
                <input 
                  type="text" 
                  value={editingEntry.phoneNumber || ''}
                  onChange={e => setEditingEntry({...editingEntry, phoneNumber: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.amount}</label>
                <input 
                  type="number" 
                  value={editingEntry.amount}
                  onChange={e => setEditingEntry({...editingEntry, amount: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.type || 'Type'}</label>
                <select 
                  value={editingEntry.type}
                  onChange={e => setEditingEntry({...editingEntry, type: e.target.value as 'GAVE' | 'GOT'})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GAVE">{t.gave}</option>
                  <option value="GOT">{t.got}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.notes}</label>
                <input 
                  type="text" 
                  value={editingEntry.notes || ''}
                  onChange={e => setEditingEntry({...editingEntry, notes: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingEntry(null)} className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold rounded-xl py-3 transition-all">
                  {t.cancel}
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 transition-all">
                  {t.save || 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ledger;
