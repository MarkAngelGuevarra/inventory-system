"use client";

import { useMemo, useState } from "react";
import { Plus, Download, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import ProductTable from "@/components/products/ProductTable";
import ProductFilters from "@/components/products/ProductFilters";
import ProductModal from "@/components/products/ProductModal";
import { useInventory } from "@/hooks/useInventory";
import { useCategories } from "@/hooks/useCategories";
import { FilterState, ProductWithCategory } from "@/lib/types";
import { enrichProduct, exportToCSV, filterAndSortProducts } from "@/lib/utils";

const defaultFilters: FilterState = {
  search: "",
  categoryId: "",
  stockStatus: "all",
  sortField: "updatedAt",
  sortOrder: "desc",
};

export default function ProductsPage() {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useInventory();
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductWithCategory | null>(null);

  const enriched = useMemo(
    () => products.map((p) => enrichProduct(p, categories)),
    [products, categories]
  );

  const filtered = useMemo(
    () => filterAndSortProducts(enriched, filters),
    [enriched, filters]
  );

  const openAdd = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit = (p: ProductWithCategory) => { setEditProduct(p); setModalOpen(true); };

  const handleSubmit = (data: Parameters<typeof addProduct>[0]) => {
    if (editProduct) {
      updateProduct(editProduct.id, data);
    } else {
      addProduct(data);
    }
  };

  const handleExport = () => exportToCSV(filtered);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Products"
        subtitle={`${products.length} products · ${filtered.length} shown`}
      />

      <div className="flex-1 p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <ProductFilters
            filters={filters}
            onChange={(partial) => setFilters((f) => ({ ...f, ...partial }))}
            categories={categories}
          />
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handleExport} className="btn-secondary">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => setFilters(defaultFilters)}
              className="btn-secondary px-3"
              title="Reset filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={openAdd} className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <ProductTable
          products={filtered}
          onEdit={openEdit}
          onDelete={deleteProduct}
        />
      </div>

      {/* Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        editProduct={editProduct}
      />
    </div>
  );
}
