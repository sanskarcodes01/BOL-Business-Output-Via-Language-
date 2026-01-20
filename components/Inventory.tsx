
import React from 'react';
import { InventoryItem } from '../types';
import { Plus, Minus, Search, MoreHorizontal } from 'lucide-react';

interface Props {
  t: any;
  inventory: InventoryItem[];
  onUpdate: (item: string, qty: number, action: 'ADD' | 'REMOVE') => void;
}

const Inventory: React.FC<Props> = ({ t, inventory, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{t.inventory}</h2>
        <div className="flex gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t.search} 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2">
            <Plus size={18} />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-sm border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">In Stock</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{item.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-md">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <p className={`font-bold ${item.quantity < 10 ? 'text-red-500' : ''}`}>
                        {item.quantity} {item.unit}
                      </p>
                      {item.quantity < 10 && (
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Low Stock</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onUpdate(item.name, 1, 'REMOVE')}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <button 
                        onClick={() => onUpdate(item.name, 1, 'ADD')}
                        className="p-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 rounded-lg transition-all"
                      >
                        <Plus size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg ml-2">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
