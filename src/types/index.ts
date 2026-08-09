export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  status: ProductStatus;
  categoryId: string;
  sellerId: string;
  category?: { id: string; name: string; slug: string };
  seller?: { id: string; name: string; email: string; avatar?: string | null };
  reviews?: Review[];
  _count?: { reviews: number; orders: number };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  user?: { id: string; name: string; avatar?: string | null };
  product?: { id: string; title: string; slug?: string };
  createdAt: string;
  updatedAt: string;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: ApiMeta;
  error?: { code: string; details?: unknown };
}
