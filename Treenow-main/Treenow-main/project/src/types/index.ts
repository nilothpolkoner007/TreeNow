export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'tree-care' | 'bonsai' | 'agriculture';
  subcategory?: string;
  stock: number;
  image: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'tree-care' | 'bonsai' | 'krishi-help' | 'blog';
  author: string;
  publishedAt: string;
  image: string;
  tags: string[];
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  instructor: string;
  category: 'tree-care' | 'bonsai';
  image: string;
  price: number;
}

// Existing interfaces remain unchanged
export interface CartItem {
  productId: string;
  quantity: number;
  type: 'wait' | 'packet';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
  deliveryAddress: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

export interface DiagnosisResult {
  treeSpecies: string;
  problem?: string;
  solution?: string;
  recommendedProducts?: string[];
}