export interface User {
  id: number;
  name: string;
  email: string;
  title: string;
  orders: number;
  role: 'Admin' | 'Standard';
  status: 'Active' | 'Suspended';
  phone?: string;
  accountCreated?: string;
  deliveryAddress?: string;
}

export interface UserStats {
  totalUsers: number;
  adminCount: number;
  activeToday: number;
  suspendedCount: number;
}

export interface Purchase {
  id: number;
  item: string;
  type: 'Bundle' | 'Track' | 'Merch';
  date: string;
  status: 'Published' | 'In Transit';
}

export interface UserDetails extends User {
  phone: string;
  accountCreated: string;
  deliveryAddress: string;
  purchases: Purchase[];
} 