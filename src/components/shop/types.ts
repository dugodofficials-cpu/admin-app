export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  status: 'Active' | 'Sold Out';
} 