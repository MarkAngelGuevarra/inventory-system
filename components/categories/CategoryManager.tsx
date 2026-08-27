"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Category, CategoryFormData } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CategoryManagerProps {
  categories: Category[];
  productCounts: Record<string, number>;
  onAdd: (data: CategoryFormData) => void;
  onUpdate: (id: string, data: Partial<CategoryFormData>) => void;
  onDelete: (id: string, name: string) => void;
}

const emptyForm: CategoryFormData = { name: "", color: CATEGORY_COLORS[0], description: "" };

export default function CategoryManager({
  categories, productCounts, onAdd, onUpdate, onDelete
}: CategoryManagerProps) {
  const [form, setForm] = useState<CategoryFormData>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({ name: cat.name, color: cat.color, description: cat.description ?? "" });
  };

  const cancel = () => {
    setEditId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const validate = () => {
    if (!form.name.trim()) { setErrors({ name: "Name is required" }); return false; }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editId) {
      onUpdate(editId, form);
    } else {
      onAdd(form);
    }
    cancel();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          {editId ? "Edit Category" : "New Category"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name <span className="text-red-500">*</span></label>
            <input
              className={cn("input", errors.name && "border-red-400")}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Electronics"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <input
              className="input"
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional description…"
            />
          </div>

          <div>
            <label className="label">Color</label>
            <div className="flex gap-2 flex-wrap mt-1">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color }))}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-all",
                    form.color === color ? "border-slate-900 scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary flex-1 justify-center">
              <Plus className="w-4 h-4" />
              {editId ? "Save Changes" : "Create Category"}
            </button>
            {editId && (
              <button type="button" onClick={cancel} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category List */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">
            All Categories
            <span className="ml-2 text-xs font-normal text-slate-500">({categories.length})</span>
          </h3>
        </div>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Tag className="w-8 h-8 mb-2" />
            <p className="text-sm">No categories yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  <Tag className="w-4 h-4" style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{cat.name}</p>
                  <p className="text-xs text-slate-500">
                    {productCounts[cat.id] ?? 0} product{productCounts[cat.id] !== 1 ? "s" : ""}
                    {cat.description ? ` · ${cat.description}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-1.5 rounded-md hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {deleteConfirm === cat.id ? (
                    <>
                      <button
                        onClick={() => { onDelete(cat.id, cat.name); setDeleteConfirm(null); }}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded-md"
                      >Confirm</button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md"
                      >Cancel</button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(cat.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      disabled={(productCounts[cat.id] ?? 0) > 0}
                      title={(productCounts[cat.id] ?? 0) > 0 ? "Remove all products first" : "Delete"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
