"use client";

import { useState } from "react";
import { Pencil, Trash2, AlertTriangle, XCircle, CheckCircle, ChevronUp, ChevronDown, Package2 } from "lucide-react";
import { ProductWithCategory } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: ProductWithCategory[];
  onEdit: (product: ProductWithCategory) => void;
  onDelete: (id: string, name: string) => void;
}

function StockBadge({ status }: { status: ProductWithCategory["stockStatus"] }) {
  if (status === "in-stock") return (
    <span className="badge-in-stock">
      <CheckCircle className="w-3 h-3" />
      In Stock
    </span>
  );
  if (status === "low-stock") return (
    <span className="badge-low-stock">
      <AlertTriangle className="w-3 h-3" />
      Low Stock
    </span>
  );
  return (
    <span className="badge-out-of-stock">
      <XCircle className="w-3 h-3" />
      Out of Stock
    </span>
  );
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-20 text-center">
        <Package2 className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">No products found</p>
        <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Product</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">SKU</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Category</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Qty</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Cost</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Sale Price</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Total Value</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/60 transition-colors group">
                {/* Product */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                      style={{ backgroundColor: product.category?.color ?? "#94a3b8" }}
                    >
                      {product.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 truncate max-w-[160px]">{product.name}</p>
                      {product.location && (
                        <p className="text-xs text-slate-400">📍 {product.location}</p>
                      )}
                    </div>
                  </div>
                </td>
                {/* SKU */}
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{product.sku}</td>
                {/* Category */}
                <td className="px-4 py-3">
                  {product.category ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${product.category.color}18`,
                        color: product.category.color,
                        border: `1px solid ${product.category.color}30`,
                      }}
                    >
                      {product.category.name}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
                {/* Qty */}
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    "font-semibold",
                    product.stockStatus === "out-of-stock" ? "text-red-600" :
                    product.stockStatus === "low-stock" ? "text-amber-600" : "text-slate-900"
                  )}>
                    {product.quantity}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/{product.minQuantity}</span>
                </td>
                {/* Cost */}
                <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(product.price)}</td>
                {/* Sale Price */}
                <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(product.salePrice)}</td>
                {/* Total Value */}
                <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCurrency(product.totalValue)}</td>
                {/* Status */}
                <td className="px-4 py-3"><StockBadge status={product.stockStatus} /></td>
                {/* Updated */}
                <td className="px-4 py-3 text-xs text-slate-400">{formatDate(product.updatedAt)}</td>
                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 rounded-md hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirm === product.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { onDelete(product.id, product.name); setDeleteConfirm(null); }}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/40">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium">{products.length}</span> product{products.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
