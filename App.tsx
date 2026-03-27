
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  LayoutDashboard, 
  Package, 
  ScanLine, 
  BarChart3, 
  Settings, 
  Mic, 
  Languages, 
  Moon, 
  Sun,
  User,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { Language, UserProfile, Transaction, InventoryItem, LedgerEntry } from './types';
import { translations } from './translations';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import VisionScan from './components/VisionScan';
import Reports from './components/Reports';
import SettingsView from './components/SettingsView';
import VoiceModal from './components/VoiceModal';
import Ledger from './components/Ledger';
import LandingPage from './components/LandingPage';
import WhatsAppConnect from './components/WhatsAppConnect';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<UserProfile>({
    businessName: "Kishore Kirana Store",
    ownerName: "Kishore Kumar",
    subscription: "BASIC",
    whatsappEnabled: true,
    theme: 'light'
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const socketRef = useRef<any>(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions || []);
          setInventory(data.inventory || []);
          setLedger(data.ledger || []);
          setUser(data.user || user);
          setTheme(data.user?.theme || 'light');
        }
      } catch (error) {
        console.error("Failed to fetch data from server:", error);
      }
    };

    const savedAuth = localStorage.getItem('bol_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);

    const savedLang = localStorage.getItem('bol_lang');
    if (savedLang) setLang(savedLang as Language);

    fetchData();

    // Socket Setup for Real-time Updates
    socketRef.current = io();
    socketRef.current.on('data:updated', (data: any) => {
      setTransactions(data.transactions);
      setInventory(data.inventory);
      setLedger(data.ledger);
      setUser(data.user);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Sync Data to Server
  const syncWithServer = async (updates: any) => {
    if (!isAuthenticated) return;
    setIsSyncing(true);
    try {
      const response = await fetch('/api/data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Sync failed");
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('bol_theme', theme);
    if (isAuthenticated && user.theme !== theme) {
      syncWithServer({ user: { ...user, theme } });
    }
  }, [theme, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('bol_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('bol_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  const t = translations[lang];

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'hi' : prev === 'hi' ? 'gu' : prev === 'gu' ? 'pa' : 'en';
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getLangName = (l: Language) => {
    switch(l) {
      case 'en': return 'English';
      case 'hi': return 'हिन्दी';
      case 'gu': return 'ગુજરાતી';
      case 'pa': return 'ਪੰਜਾਬੀ';
    }
  };

  const getFontClass = () => {
    switch(lang) {
      case 'gu': return 'font-gujarati';
      case 'pa': return 'font-punjabi';
      default: return 'font-sans';
    }
  };

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };

  const addTransaction = (txn: Omit<Transaction, 'id' | 'date'>) => {
    const newTxn = {
      ...txn,
      id: generateId(),
      date: new Date().toISOString()
    };
    const updated = [newTxn, ...transactions];
    setTransactions(updated);
    syncWithServer({ transactions: updated });
  };

  const updateInventory = (item: string, qty: number, action: 'ADD' | 'REMOVE') => {
    let updated: InventoryItem[] = [];
    const existing = inventory.find(i => i.name.toLowerCase() === item.toLowerCase());
    if (existing) {
      updated = inventory.map(i => i.name.toLowerCase() === item.toLowerCase() 
        ? { ...i, quantity: action === 'ADD' ? i.quantity + qty : Math.max(0, i.quantity - qty) }
        : i
      );
    } else if (action === 'ADD') {
      updated = [...inventory, { id: generateId(), name: item, quantity: qty, unit: 'pcs', category: 'General' }];
    } else {
      updated = inventory;
    }
    setInventory(updated);
    syncWithServer({ inventory: updated });
  };

  const addLedgerEntry = (entry: Omit<LedgerEntry, 'id' | 'date' | 'status'>) => {
    const newEntry: LedgerEntry = {
      ...entry,
      id: generateId(),
      date: new Date().toISOString(),
      status: 'PENDING'
    };
    const updated = [newEntry, ...ledger];
    setLedger(updated);
    syncWithServer({ ledger: updated });
  };

  const settleLedgerEntry = (id: string) => {
    const updated = ledger.map(l => l.id === id ? { ...l, status: 'SETTLED' } : l);
    setLedger(updated);
    syncWithServer({ ledger: updated });
  };

  const editLedgerEntry = (updatedEntry: LedgerEntry) => {
    const updated = ledger.map(l => l.id === updatedEntry.id ? updatedEntry : l);
    setLedger(updated);
    syncWithServer({ ledger: updated });
  };

  const handleLogin = (name: string, business: string) => {
    const updatedUser = { ...user, ownerName: name, businessName: business };
    setUser(updatedUser);
    setIsAuthenticated(true);
    syncWithServer({ user: updatedUser });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const onUpdateUser = (u: UserProfile) => {
    setUser(u);
    syncWithServer({ user: u });
  };

  if (!isAuthenticated) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <LandingPage 
          onLogin={handleLogin} 
          t={t} 
          lang={lang} 
          onSetLang={setLang} 
        />
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 ${getFontClass()}`}>
        {/* Sidebar for Desktop */}
        <div className="fixed left-0 top-0 h-full w-20 lg:w-64 flex flex-col border-r border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 z-50">
          <div className="p-6 flex items-center gap-3">
            <img src="/logo.svg" alt="B.O.L Logo" className="w-10 h-10 rounded-lg shadow-sm" referrerPolicy="no-referrer" />
            <h1 className="font-bold text-xl hidden lg:block">{t.appName}</h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label={t.dashboard} />
            <NavLink to="/inventory" icon={<Package size={20} />} label={t.inventory} />
            <NavLink to="/scan" icon={<ScanLine size={20} />} label={t.billing} />
            <NavLink to="/ledger" icon={<BookOpen size={20} />} label={t.ledger} />
            <NavLink to="/whatsapp" icon={<MessageSquare size={20} />} label={t.whatsappLink || 'WhatsApp Link'} />
            <NavLink to="/reports" icon={<BarChart3 size={20} />} label={t.reports} />
            <NavLink to="/settings" icon={<Settings size={20} />} label={t.settings} />
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
            <button onClick={toggleLang} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <Languages size={20} className="text-blue-600" />
              <span className="text-sm font-medium hidden lg:block">{getLangName(lang)}</span>
            </button>
            <div className="flex items-center justify-between p-3 lg:px-4">
               <div className="flex items-center gap-3">
                 <User size={20} className="text-slate-400" />
                 <div className="hidden lg:block">
                   <p className="text-xs font-bold text-blue-600">{user.subscription}</p>
                   <p className="text-sm font-medium truncate">{user.ownerName}</p>
                 </div>
               </div>
               <button 
                 onClick={handleLogout}
                 className="text-xs text-red-500 hover:underline hidden lg:block"
               >
                 Logout
               </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="pl-20 lg:pl-64 min-h-screen pb-24">
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
             <div className="flex flex-col">
               <div className="flex items-center gap-2">
                 <h2 className="text-lg font-bold">{t.appName}</h2>
                 {isSyncing && <RefreshCw size={12} className="text-blue-500 animate-spin" />}
               </div>
               <p className="text-xs text-slate-500">{t.tagline}</p>
             </div>
             <div className="flex items-center gap-4">
               <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                 {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
               </button>
               <button onClick={() => setIsVoiceActive(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                 <Mic size={18} />
                 <span className="hidden md:inline">{t.startListening}</span>
               </button>
             </div>
          </header>

          <div className="p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard t={t} transactions={transactions} inventory={inventory} ledger={ledger} />} />
              <Route path="/inventory" element={<Inventory t={t} inventory={inventory} onUpdate={updateInventory} />} />
              <Route path="/scan" element={<VisionScan t={t} onAddBatch={addTransaction} />} />
              <Route path="/ledger" element={<Ledger t={t} ledger={ledger} onAddEntry={addLedgerEntry} onSettleEntry={settleLedgerEntry} onEditEntry={editLedgerEntry} />} />
              <Route path="/whatsapp" element={<WhatsAppConnect t={t} />} />
              <Route path="/reports" element={<Reports t={t} transactions={transactions} />} />
              <Route path="/settings" element={<SettingsView t={t} user={user} onUpdateUser={onUpdateUser} lang={lang} setLang={setLang} />} />
            </Routes>
          </div>
        </main>

        {/* Voice Command Modal Overlay */}
        {isVoiceActive && (
          <VoiceModal 
            t={t} 
            lang={lang}
            onClose={() => setIsVoiceActive(false)} 
            onIntent={(intent) => {
              // Handle Intent
              if (intent.action === 'ADD_STOCK' && intent.item && intent.quantity) {
                updateInventory(intent.item, intent.quantity, 'ADD');
              } else if (intent.action === 'REMOVE_STOCK' && intent.item && intent.quantity) {
                updateInventory(intent.item, intent.quantity, 'REMOVE');
              } else if (intent.action === 'RECORD_SALE' && intent.amount) {
                addTransaction({
                  type: 'INCOME',
                  category: 'Sales',
                  item: intent.item || 'Generic Item',
                  amount: intent.amount,
                  source: 'VOICE'
                });
              } else if (intent.action === 'RECORD_PAYMENT' && intent.amount) {
                addTransaction({
                  type: 'EXPENSE',
                  category: intent.category || 'Vendor Payment',
                  item: intent.item || 'Service',
                  amount: intent.amount,
                  entity: intent.entity,
                  source: 'VOICE'
                });
              }
              setIsVoiceActive(false);
            }}
          />
        )}
      </div>
    </Router>
  );
};

const NavLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
      {icon}
      <span className="text-sm font-semibold hidden lg:block">{label}</span>
    </Link>
  );
};

export default App;
