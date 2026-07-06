export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock';
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
}
