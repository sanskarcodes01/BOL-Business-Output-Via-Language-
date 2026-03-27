import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { QrCode, CheckCircle2, XCircle, RefreshCw, LogOut, MessageSquare } from 'lucide-react';

interface Props {
  t: any;
}

const WhatsAppConnect: React.FC<Props> = ({ t }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'qr' | 'connecting'>('connecting');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = io();

    socket.on('whatsapp:qr', (qr: string) => {
      setQrCode(qr);
      setStatus('qr');
    });

    socket.on('whatsapp:status', (newStatus: 'connected' | 'disconnected' | 'qr') => {
      setStatus(newStatus);
      if (newStatus === 'connected') setQrCode(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout from WhatsApp?')) return;
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp/logout', { method: 'POST' });
      if (response.ok) {
        setStatus('connecting');
        setQrCode(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <MessageSquare size={40} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">WhatsApp Link</h1>
        <p className="text-slate-500 mb-8">
          Link your WhatsApp account to send receipts and manage business directly from your number.
        </p>

        <div className="flex justify-center mb-8">
          {status === 'connected' ? (
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl p-6 flex flex-col items-center gap-4 w-full max-w-sm">
              <CheckCircle2 size={64} className="text-green-600" />
              <div>
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Connected</h3>
                <p className="text-sm text-green-600/80">Your WhatsApp is linked and ready.</p>
              </div>
              <button 
                onClick={handleLogout}
                disabled={loading}
                className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700 font-bold transition-colors disabled:opacity-50"
              >
                <LogOut size={18} />
                Logout Account
              </button>
            </div>
          ) : status === 'qr' && qrCode ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border-4 border-slate-100 dark:border-slate-700 inline-block shadow-inner">
                <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
              </div>
              <div className="flex items-center justify-center gap-2 text-amber-600 font-medium bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full">
                <RefreshCw size={16} className="animate-spin" />
                Scan this QR code with WhatsApp
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Open WhatsApp on your phone {'>'} Settings {'>'} Linked Devices {'>'} Link a Device
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-12">
              <RefreshCw size={48} className="text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium">Connecting to WhatsApp service...</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
              <QrCode size={16} className="text-blue-600" />
              No API Needed
            </h4>
            <p className="text-xs text-slate-500">Uses your existing WhatsApp account directly.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              Auto Receipts
            </h4>
            <p className="text-xs text-slate-500">Send digital receipts to customers instantly.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
              <XCircle size={16} className="text-red-600" />
              Secure
            </h4>
            <p className="text-xs text-slate-500">Your data stays encrypted and private.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConnect;
