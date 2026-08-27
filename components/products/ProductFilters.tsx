"use client";

import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Category, FilterState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  categories: Category[];
}

const stockOptions = [
  { value: "all",           label: "All Stock" },
  { value: "in-stock",      label: "In Stock" },
  { value: "low-stock",     label: "Low Stock" },
  { value: "out-of-stock",  label: "Out of Stock" },
];

const sortOptions = [
  { value: "updatedAt", label: "Last Updated" },
  { value: "name",      label: "Name (A–Z)" },
  { value: "sku",       label: "SKU" },
  { value: "quantity",  label: "Quantity" },
  { value: "price",     label: "Price" },
];

export default function ProductFilters({ filters, onChange, categories }: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Search name, SKU, supplier…"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* Category filter */}
        <div className="relative">
          <select
            className="input pr-8 appearance-none cursor-pointer"
            value={filters.categoryId}
            onChange={(e) => onChange({ categoryId: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Stock status filter */}
        <div className="relative">
          <select
            className="input pr-8 appearance-none cursor-pointer"
            value={filters.stockStatus}
            onChange={(e) => onChange({ stockStatus: e.target.value as FilterState["stockStatus"] })}
          >
            {stockOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            className="input pr-8 appearance-none cursor-pointer"
            value={filters.sortField}
            onChange={(e) => onChange({ sortField: e.target.value as FilterState["sortField"] })}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Sort order toggle */}
        <button
          onClick={() => onChange({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}
          className="btn-secondary px-3"
          title="Toggle sort order"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {filters.sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>
    </div>
  );
}
