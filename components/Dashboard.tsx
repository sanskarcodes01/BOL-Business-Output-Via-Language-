
import React from 'react';
import { Transaction, InventoryItem } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingBag, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  t: any;
  transactions: Transaction[];
  inventory: InventoryItem[];
}

const Dashboard: React.FC<Props> = ({ t, transactions, inventory }) => {
  const totalSales = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const lowStock = inventory.filter(i => i.quantity < 10);

  // Group transactions for the chart
  const chartData = transactions.slice(0, 7).reverse().map(txn => ({
    name: new Date(txn.date).toLocaleDateString([], { day: 'numeric', month: 'short' }),
    amount: txn.amount,
    type: txn.type
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t.totalSales} 
          value={`₹${totalSales.toLocaleString()}`} 
          trend="+12%" 
          color="blue" 
          icon={<ShoppingBag />} 
        />
        <StatCard 
          title={t.dailyExpenses} 
          value={`₹${totalExpenses.toLocaleString()}`} 
          trend="-2%" 
          color="red" 
          icon={<ArrowDownRight />} 
        />
        <StatCard 
          title={t.lowStock} 
          value={lowStock.length.toString()} 
          color="orange" 
          icon={<AlertCircle />} 
        />
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl">
           <p className="text-indigo-100 text-sm font-medium">B.O.L Credit Score</p>
           <h3 className="text-3xl font-bold mt-1">742</h3>
           <p className="text-xs text-indigo-200 mt-2">Unlock business loans up to ₹5 Lakh</p>
           <button className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs px-4 py-2 rounded-full font-bold transition-all">
             Check Offers
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Sales Activity</h3>
            <select className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-xs font-semibold px-3 py-1.5 outline-none">
              <option>Last 7 Days</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-lg mb-4">{t.recentTransactions}</h3>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {transactions.slice(0, 5).map(txn => (
              <div key={txn.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${txn.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {txn.type === 'INCOME' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{txn.item}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.type === 'INCOME' ? '+' : '-'} ₹{txn.amount}
                </p>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No transactions yet</p>}
          </div>
          <button className="mt-6 w-full py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
            View All History
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, trend?: string, color: string, icon: React.ReactNode }> = ({ title, value, trend, color, icon }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold mt-1">{value}</h4>
    </div>
  );
};

export default Dashboard;
