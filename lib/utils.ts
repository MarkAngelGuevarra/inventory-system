import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category, FilterState, InventoryStats, Product, ProductWithCategory } from "./types";

// ─── Tailwind Class Utility ───────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoString));
}

export function formatRelativeDate(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(isoString);
}

// ─── Stock Status ─────────────────────────────────────────────────────────────

export function getStockStatus(
  quantity: number,
  minQuantity: number
): "in-stock" | "low-stock" | "out-of-stock" {
  if (quantity === 0) return "out-of-stock";
  if (quantity <= minQuantity) return "low-stock";
  return "in-stock";
}

// ─── Product Enrichment ───────────────────────────────────────────────────────

export function enrichProduct(
  product: Product,
  categories: Category[]
): ProductWithCategory {
  const category = categories.find((c) => c.id === product.categoryId) ?? null;
  return {
    ...product,
    category,
    stockStatus: getStockStatus(product.quantity, product.minQuantity),
    totalValue: product.quantity * product.price,
  };
}

// ─── Filtering & Sorting ──────────────────────────────────────────────────────

export function filterAndSortProducts(
  products: ProductWithCategory[],
  filters: FilterState
): ProductWithCategory[] {
  let result = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.supplier?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
    );
  }

  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }

  if (filters.stockStatus !== "all") {
    result = result.filter((p) => p.stockStatus === filters.stockStatus);
  }

  result.sort((a, b) => {
    let comparison = 0;
    switch (filters.sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "sku":
        comparison = a.sku.localeCompare(b.sku);
        break;
      case "quantity":
        comparison = a.quantity - b.quantity;
        break;
      case "price":
        comparison = a.price - b.price;
        break;
      case "updatedAt":
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }
    return filters.sortOrder === "asc" ? comparison : -comparison;
  });

  return result;
}

// ─── Stats Calculation ────────────────────────────────────────────────────────

export function calculateStats(
  products: ProductWithCategory[],
  categories: Category[]
): InventoryStats {
  const totalValue = products.reduce((sum, p) => sum + p.totalValue, 0);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  const categoryBreakdown = categories.map((cat) => {
    const catProducts = products.filter((p) => p.categoryId === cat.id);
    return {
      category: cat.name,
      quantity: catProducts.reduce((s, p) => s + p.quantity, 0),
      value: catProducts.reduce((s, p) => s + p.totalValue, 0),
    };
  });

  return {
    totalProducts: products.length,
    totalQuantity,
    totalValue,
    lowStockCount: products.filter((p) => p.stockStatus === "low-stock").length,
    outOfStockCount: products.filter((p) => p.stockStatus === "out-of-stock").length,
    categoryBreakdown,
  };
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportToCSV(products: ProductWithCategory[]): void {
  const headers = [
    "SKU", "Name", "Category", "Quantity", "Min Qty",
    "Cost Price", "Sale Price", "Total Value", "Supplier",
    "Location", "Stock Status", "Last Updated",
  ];

  const rows = products.map((p) => [
    p.sku,
    `"${p.name}"`,
    `"${p.category?.name ?? "Uncategorized"}"`,
    p.quantity,
    p.minQuantity,
    p.price.toFixed(2),
    p.salePrice.toFixed(2),
    p.totalValue.toFixed(2),
    `"${p.supplier ?? ""}"`,
    `"${p.location ?? ""}"`,
    p.stockStatus,
    formatDate(p.updatedAt),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inventory-export-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── ID Generation ────────────────────────────────────────────────────────────

export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Category Colors ──────────────────────────────────────────────────────────

export const CATEGORY_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ec4899",
  "#8b5cf6", "#f97316", "#06b6d4", "#84cc16",
];
