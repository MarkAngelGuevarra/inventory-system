"use client";

import { useMemo } from "react";
import Header from "@/components/layout/Header";
import CategoryManager from "@/components/categories/CategoryManager";
import { useCategories } from "@/hooks/useCategories";
import { useInventory } from "@/hooks/useInventory";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { products } = useInventory();

  // Count products per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Categories"
        subtitle={`${categories.length} categories · organize your inventory`}
      />
      <div className="flex-1 p-6">
        <CategoryManager
          categories={categories}
          productCounts={productCounts}
          onAdd={addCategory}
          onUpdate={updateCategory}
          onDelete={deleteCategory}
        />
      </div>
    </div>
  );
}
