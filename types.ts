
export type Language = 'en' | 'hi' | 'gu' | 'pa';

export interface Transaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  item: string;
  amount: number;
  entity?: string; // e.g. "Ramu"
  source: 'VOICE' | 'VISION' | 'MANUAL';
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface UserProfile {
  businessName: string;
  ownerName: string;
  subscription: 'FREE' | 'BASIC' | 'PREMIUM';
  whatsappEnabled: boolean;
  theme: 'light' | 'dark';
}

export interface LedgerEntry {
  id: string;
  date: string;
  customerName: string;
  phoneNumber?: string;
  amount: number;
  type: 'GAVE' | 'GOT'; // GAVE = You lent money (Credit/Udhaar given), GOT = You received money (Debt/Advance)
  status: 'PENDING' | 'SETTLED';
  notes?: string;
}

export interface ParsedIntent {
  action: 'ADD_STOCK' | 'REMOVE_STOCK' | 'RECORD_SALE' | 'RECORD_PAYMENT' | 'UPDATE_PROFILE' | 'UNKNOWN';
  item?: string;
  amount?: number;
  quantity?: number;
  unit?: string;
  entity?: string;
  category?: string;
  businessName?: string;
  ownerName?: string;
}
