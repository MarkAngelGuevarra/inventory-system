"use client";

import { useMemo } from "react";
import Header from "@/components/layout/Header";
import StockChart from "@/components/dashboard/StockChart";
import ValueChart from "@/components/dashboard/ValueChart";
import { useInventory } from "@/hooks/useInventory";
import { useCategories } from "@/hooks/useCategories";
import { calculateStats, enrichProduct, formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function AnalyticsPage() {
  const { products } = useInventory();
  const { categories } = useCategories();

  const enriched = useMemo(
    () => products.map((p) => enrichProduct(p, categories)),
    [products, categories]
  );
  const stats = useMemo(() => calculateStats(enriched, categories), [enriched, categories]);

  const topByValue = [...enriched].sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);
  const topByQty = [...enriched].sort((a, b) => b.quantity - a.quantity).slice(0, 5);

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Analytics" subtitle="Inventory insights and breakdowns" />

      <div className="flex-1 p-6 space-y-6">
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StockChart data={stats.categoryBreakdown} />
          <ValueChart data={stats.categoryBreakdown} />
        </div>

        {/* Summary Table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Category Breakdown</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Category</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Products</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Total Units</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Inventory Value</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.categoryBreakdown.map((row, i) => {
                const cat = categories.find((c) => c.name === row.category);
                const productCount = enriched.filter((p) => p.categoryId === cat?.id).length;
                const pct = stats.totalValue > 0 ? ((row.value / stats.totalValue) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat?.color ?? "#94a3b8" }} />
                        <span className="font-medium text-slate-800">{row.category}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-slate-600">{productCount}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-800">{row.quantity.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatCurrency(row.value)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-slate-600">{pct}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="px-5 py-3 font-semibold text-slate-900">Total</td>
                <td className="px-5 py-3 text-right font-semibold text-slate-900">{stats.totalProducts}</td>
                <td className="px-5 py-3 text-right font-semibold text-slate-900">{stats.totalQuantity.toLocaleString()}</td>
                <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatCurrency(stats.totalValue)}</td>
                <td className="px-5 py-3 text-right font-semibold text-slate-900">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top by Value */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Top 5 by Inventory Value</h3>
            <ul className="space-y-3">
              {topByValue.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4">#{i + 1}</span>
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: p.category?.color ?? "#94a3b8" }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.quantity} units @ {formatCurrency(p.price)}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{formatCurrency(p.totalValue)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top by Quantity */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Top 5 by Stock Quantity</h3>
            <ul className="space-y-3">
              {topByQty.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4">#{i + 1}</span>
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: p.category?.color ?? "#94a3b8" }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.category?.name ?? "Uncategorized"}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{p.quantity} <span className="text-slate-400 font-normal text-xs">units</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
