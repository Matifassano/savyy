
export interface Notification {
  id: number;
  title: string;
  description: string | null;
  time: string;
  read: boolean;
  user_id: string;
}

export interface Promotion {
  id: number;
  bank: string;
  bank_id: string;
  title: string;
  description: string;
  validUntil: string;
  category: string;
  isNew: boolean;
  cardType: string;
  expiration_date: string;
  link_promotion: string;
  isLimitedTime: boolean;
  isExclusive: boolean;
}

export interface ConnectedApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  description: string;
}

export interface FilterType {
  category: string;
  bank: string;
  promotionType: string;
  cardType: string;
} 
