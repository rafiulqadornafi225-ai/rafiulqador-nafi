export interface Jersey {
  id: string;
  country: string;
  name: string;
  priceBDT: number;
  priceUSD: number;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  badgeColor: string; // e.g., 'bg-yellow-500'
  accentColor: string; // e.g., 'text-yellow-400'
  bgGradient: string; // e.g., 'from-yellow-900/20 to-green-900/10'
}

export interface Order {
  id: string;
  jerseyId: string;
  jerseyName: string;
  countryName: string;
  size: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  timestamp: string;
  status: 'Pending Verification' | 'Verified' | 'Shipped' | 'Delivered';
  customNumber?: string;
  customName?: string;
}

export interface VisitorLog {
  id: string;
  name: string;
  location: string;
  device: string;
  action: string;
  timestamp: string;
  ip: string;
  isReal?: boolean;
}

