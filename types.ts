
export type Language = 'en' | 'hi';

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

export interface ParsedIntent {
  action: 'ADD_STOCK' | 'REMOVE_STOCK' | 'RECORD_SALE' | 'RECORD_PAYMENT' | 'UNKNOWN';
  item?: string;
  amount?: number;
  quantity?: number;
  unit?: string;
  entity?: string;
  category?: string;
}
