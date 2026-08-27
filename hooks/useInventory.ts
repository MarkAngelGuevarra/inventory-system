"use client";

import { useCallback, useEffect, useState } from "react";
import { getProducts, saveProducts } from "@/lib/storage";
import { Product, ProductFormData } from "@/lib/types";
import { generateId } from "@/lib/utils";
import toast from "react-hot-toast";

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    setProducts(getProducts());
    setIsLoading(false);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!isLoading) {
      saveProducts(products);
    }
  }, [products, isLoading]);

  const addProduct = useCallback((data: ProductFormData) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: generateId("prod"),
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [newProduct, ...prev]);
    toast.success(`"${data.name}" added to inventory`);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, data: Partial<ProductFormData>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      )
    );
    toast.success("Product updated successfully");
  }, []);

  const deleteProduct = useCallback((id: string, name: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success(`"${name}" removed from inventory`);
  }, []);

  const adjustQuantity = useCallback((id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newQty = Math.max(0, p.quantity + delta);
        return { ...p, quantity: newQty, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  return { products, isLoading, addProduct, updateProduct, deleteProduct, adjustQuantity };
}
