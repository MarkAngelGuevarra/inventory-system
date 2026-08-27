"use client";

import { useCallback, useEffect, useState } from "react";
import { getCategories, saveCategories } from "@/lib/storage";
import { Category, CategoryFormData } from "@/lib/types";
import { generateId } from "@/lib/utils";
import toast from "react-hot-toast";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCategories(getCategories());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveCategories(categories);
    }
  }, [categories, isLoading]);

  const addCategory = useCallback((data: CategoryFormData) => {
    const newCategory: Category = {
      ...data,
      id: generateId("cat"),
      createdAt: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    toast.success(`Category "${data.name}" created`);
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, data: Partial<CategoryFormData>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    toast.success("Category updated");
  }, []);

  const deleteCategory = useCallback((id: string, name: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success(`Category "${name}" deleted`);
  }, []);

  return { categories, isLoading, addCategory, updateCategory, deleteCategory };
}
