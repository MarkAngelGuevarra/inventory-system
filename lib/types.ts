// ─── Core Types ───────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  quantity: number;
  minQuantity: number; // Low stock threshold
  price: number;       // Unit price (cost)
  salePrice: number;   // Selling price
  supplier?: string;
  description?: string;
  location?: string;   // Warehouse / shelf location
  createdAt: string;
  updatedAt: string;
}

// ─── Derived / View Types ─────────────────────────────────────────────────────

export interface ProductWithCategory extends Product {
  category: Category | null;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  totalValue: number; // quantity × price
}

export interface InventoryStats {
  totalProducts: number;
  totalQuantity: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoryBreakdown: { category: string; quantity: number; value: number }[];
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type CategoryFormData = Omit<Category, "id" | "createdAt">;

// ─── Filter / Sort Types ─────────────────────────────────────────────────────

export type SortField = "name" | "sku" | "quantity" | "price" | "updatedAt";
export type SortOrder = "asc" | "desc";

export interface FilterState {
  search: string;
  categoryId: string;
  stockStatus: "all" | "in-stock" | "low-stock" | "out-of-stock";
  sortField: SortField;
  sortOrder: SortOrder;
}
