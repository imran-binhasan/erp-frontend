export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  statusCode?: number;
}

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: { _id: string; name: string; permissions: string[] };
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  imageUrl: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  product: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  _id: string;
  customer: string | Customer;
  items: SaleItem[];
  grandTotal: number;
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  count: number;
}

export interface DashboardRecentSale {
  _id: string;
  customer: string | Customer;
  items: SaleItem[];
  grandTotal: number;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  totalRevenue: number;
  weekRevenue: number;
  weekSales: number;
  salesTrend: SalesTrendPoint[];
  recentSales: DashboardRecentSale[];
  lowStockProducts: Product[];
}
