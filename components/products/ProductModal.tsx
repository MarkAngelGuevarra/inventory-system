"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Category, ProductFormData, ProductWithCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  categories: Category[];
  editProduct?: ProductWithCategory | null;
}

const emptyForm: ProductFormData = {
  name: "", sku: "", categoryId: "",
  quantity: 0, minQuantity: 5,
  price: 0, salePrice: 0,
  supplier: "", description: "", location: "",
};

export default function ProductModal({
  isOpen, onClose, onSubmit, categories, editProduct
}: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  useEffect(() => {
    if (editProduct) {
      const { id, createdAt, updatedAt, category, stockStatus, totalValue, ...rest } = editProduct;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editProduct, isOpen]);

  const set = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.sku.trim()) errs.sku = "SKU is required";
    if (!form.categoryId) errs.categoryId = "Please select a category";
    if (form.quantity < 0) errs.quantity = "Quantity cannot be negative";
    if (form.price < 0) errs.price = "Price cannot be negative";
    if (form.salePrice < 0) errs.salePrice = "Sale price cannot be negative";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {editProduct ? "Update product information" : "Fill in the product details below"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Row 1: Name + SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Product Name <span className="text-red-500">*</span></label>
              <input className={cn("input", errors.name && "border-red-400")}
                value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Wireless Mouse" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">SKU <span className="text-red-500">*</span></label>
              <input className={cn("input", errors.sku && "border-red-400")}
                value={form.sku} onChange={(e) => set("sku", e.target.value.toUpperCase())}
                placeholder="e.g. EL-001" />
              {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
            </div>
          </div>

          {/* Row 2: Category + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category <span className="text-red-500">*</span></label>
              <select className={cn("input", errors.categoryId && "border-red-400")}
                value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
            </div>
            <div>
              <label className="label">Location / Shelf</label>
              <input className="input" value={form.location ?? ""}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. A-01" />
            </div>
          </div>

          {/* Row 3: Qty + Min Qty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quantity <span className="text-red-500">*</span></label>
              <input type="number" min={0} className={cn("input", errors.quantity && "border-red-400")}
                value={form.quantity} onChange={(e) => set("quantity", Number(e.target.value))} />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="label">Low Stock Threshold</label>
              <input type="number" min={0} className="input"
                value={form.minQuantity} onChange={(e) => set("minQuantity", Number(e.target.value))} />
              <p className="text-xs text-slate-400 mt-1">Warn when qty ≤ this value</p>
            </div>
          </div>

          {/* Row 4: Cost + Sale Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Cost Price ($) <span className="text-red-500">*</span></label>
              <input type="number" min={0} step="0.01" className={cn("input", errors.price && "border-red-400")}
                value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="label">Sale Price ($) <span className="text-red-500">*</span></label>
              <input type="number" min={0} step="0.01" className={cn("input", errors.salePrice && "border-red-400")}
                value={form.salePrice} onChange={(e) => set("salePrice", Number(e.target.value))} />
            </div>
          </div>

          {/* Row 5: Supplier */}
          <div>
            <label className="label">Supplier</label>
            <input className="input" value={form.supplier ?? ""}
              onChange={(e) => set("supplier", e.target.value)}
              placeholder="e.g. TechSupplies Co." />
          </div>

          {/* Row 6: Description */}
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3}
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Optional product description…" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editProduct ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
