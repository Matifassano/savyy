
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
  title: string;
  benefits: string;
  valid_until: string;
  cardtype: string;
  payment_network: string;
  link_promotion: string;
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
