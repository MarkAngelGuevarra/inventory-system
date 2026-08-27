import { Category, Product } from "./types";

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const PRODUCTS_KEY = "inventory_products";
const CATEGORIES_KEY = "inventory_categories";

// ─── Seed Data ───────────────────────────────────────────────────────────────

const defaultCategories: Category[] = [
  { id: "cat-1", name: "Electronics",  color: "#3b82f6", description: "Electronic devices and accessories", createdAt: new Date().toISOString() },
  { id: "cat-2", name: "Office Supplies", color: "#10b981", description: "Stationery and office equipment", createdAt: new Date().toISOString() },
  { id: "cat-3", name: "Furniture",    color: "#f59e0b", description: "Desks, chairs, and storage", createdAt: new Date().toISOString() },
  { id: "cat-4", name: "Clothing",     color: "#ec4899", description: "Apparel and accessories", createdAt: new Date().toISOString() },
];

const defaultProducts: Product[] = [
  {
    id: "prod-1", name: "Wireless Mouse", sku: "EL-001", categoryId: "cat-1",
    quantity: 45, minQuantity: 10, price: 25.00, salePrice: 39.99,
    supplier: "TechSupplies Co.", location: "A-01", description: "Ergonomic wireless mouse",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2", name: "USB-C Hub", sku: "EL-002", categoryId: "cat-1",
    quantity: 8, minQuantity: 10, price: 35.00, salePrice: 59.99,
    supplier: "TechSupplies Co.", location: "A-02", description: "7-in-1 USB-C Hub",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3", name: "Mechanical Keyboard", sku: "EL-003", categoryId: "cat-1",
    quantity: 0, minQuantity: 5, price: 80.00, salePrice: 129.99,
    supplier: "KeyboardWorld", location: "A-03", description: "TKL mechanical keyboard",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-4", name: "Ballpoint Pens (Box)", sku: "OS-001", categoryId: "cat-2",
    quantity: 120, minQuantity: 20, price: 5.00, salePrice: 9.99,
    supplier: "OfficeWorld", location: "B-01", description: "Box of 50 blue pens",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-5", name: "A4 Paper (Ream)", sku: "OS-002", categoryId: "cat-2",
    quantity: 3, minQuantity: 10, price: 4.50, salePrice: 8.99,
    supplier: "PaperCo", location: "B-02", description: "500-sheet A4 80gsm paper",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-6", name: "Ergonomic Chair", sku: "FU-001", categoryId: "cat-3",
    quantity: 12, minQuantity: 3, price: 250.00, salePrice: 399.99,
    supplier: "FurniturePlus", location: "C-01", description: "Adjustable ergonomic chair",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-7", name: "Standing Desk", sku: "FU-002", categoryId: "cat-3",
    quantity: 5, minQuantity: 2, price: 450.00, salePrice: 699.99,
    supplier: "FurniturePlus", location: "C-02", description: "Electric height-adjustable desk",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-8", name: "Company T-Shirt (L)", sku: "CL-001", categoryId: "cat-4",
    quantity: 25, minQuantity: 5, price: 8.00, salePrice: 19.99,
    supplier: "BrandWear", location: "D-01",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// ─── Categories ──────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  if (!isBrowser()) return defaultCategories;
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return JSON.parse(raw) as Category[];
  } catch {
    return defaultCategories;
  }
}

export function saveCategories(categories: Category[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// ─── Products ────────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  if (!isBrowser()) return defaultProducts;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return JSON.parse(raw) as Product[];
  } catch {
    return defaultProducts;
  }
}

export function saveProducts(products: Product[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function clearStorage(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(CATEGORIES_KEY);
}
