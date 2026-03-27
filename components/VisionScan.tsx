
import React, { useState } from 'react';
import { Camera, Upload, Check, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { parseBillImage } from '../services/geminiService';
import { Transaction } from '../types';

interface Props {
  t: any;
  onAddBatch: (txn: Omit<Transaction, 'id' | 'date'>) => void;
}

const VisionScan: React.FC<Props> = ({ t, onAddBatch }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setImagePreview(reader.result as string);
      setIsScanning(true);
      const items = await parseBillImage(base64);
      setScannedItems(items);
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const removeItem = (index: number) => {
    setScannedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirmAll = () => {
    scannedItems.forEach(item => {
      onAddBatch({
        type: 'EXPENSE',
        category: 'Purchase',
        item: item.item,
        amount: item.total || (item.price * item.quantity),
        source: 'VISION'
      });
    });
    setScannedItems([]);
    setImagePreview(null);
    alert(t.saveSuccess);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t.scanBill}</h2>
      </div>

      {!imagePreview ? (
        <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Camera size={32} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg">{t.uploadBill}</h3>
            <p className="text-slate-500">{t.supportedFormats}</p>
          </div>
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold cursor-pointer shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            <Upload size={18} />
            <span>{t.selectFile}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden aspect-auto max-h-[500px] border border-slate-200 dark:border-slate-700">
               <img src={imagePreview} alt="Bill Preview" className="w-full h-full object-contain" />
            </div>
            <button onClick={() => setImagePreview(null)} className="w-full py-3 bg-slate-200 dark:bg-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all">
              {t.discardRescan}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">{t.verifyData}</h3>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">{t.aiExtracted}</span>
              </div>

              {isScanning ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                  <p className="font-medium animate-pulse">{t.processing}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700">
                        <th className="pb-3 font-medium">{t.item}</th>
                        <th className="pb-3 font-medium">{t.qty}</th>
                        <th className="pb-3 font-medium">{t.total}</th>
                        <th className="pb-3 font-medium">{t.action}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scannedItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-50 dark:border-slate-700/50">
                          <td className="py-4 font-semibold">{item.item}</td>
                          <td className="py-4 text-slate-500">{item.quantity} {item.unit}</td>
                          <td className="py-4 font-bold">₹{item.total || (item.price * item.quantity)}</td>
                          <td className="py-4">
                            <button onClick={() => removeItem(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {scannedItems.length === 0 && (
                    <div className="flex flex-col items-center py-12 text-slate-400">
                      <AlertCircle size={32} className="mb-2" />
                      <p>{t.noItemsDetected}</p>
                    </div>
                  )}

                  {scannedItems.length > 0 && (
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                       <div>
                         <p className="text-slate-400 text-xs">{t.grandTotal}</p>
                         <p className="text-2xl font-bold">₹{scannedItems.reduce((acc, curr) => acc + (curr.total || (curr.price * curr.quantity)), 0).toLocaleString()}</p>
                       </div>
                       <button onClick={handleConfirmAll} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-green-500/20 transition-all flex items-center gap-2">
                         <Check size={20} />
                         {t.confirm}
                       </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionScan;
