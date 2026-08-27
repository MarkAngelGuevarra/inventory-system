"use client";

import { useMemo } from "react";
import {
  Package, DollarSign, AlertTriangle, TrendingUp, XCircle, Boxes
} from "lucide-react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import StockChart from "@/components/dashboard/StockChart";
import ValueChart from "@/components/dashboard/ValueChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useInventory } from "@/hooks/useInventory";
import { useCategories } from "@/hooks/useCategories";
import { calculateStats, enrichProduct, formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { products, isLoading: prodLoading } = useInventory();
  const { categories, isLoading: catLoading } = useCategories();

  const enriched = useMemo(
    () => products.map((p) => enrichProduct(p, categories)),
    [products, categories]
  );

  const stats = useMemo(
    () => calculateStats(enriched, categories),
    [enriched, categories]
  );

  if (prodLoading || catLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading inventory…</p>
        </div>
      </div>
    );
  }

  const alertCount = stats.lowStockCount + stats.outOfStockCount;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Dashboard"
        subtitle={`${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
      />

      <div className="flex-1 p-6 space-y-6">

        {/* Alert Banner */}
        {alertCount > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>
              <span className="font-semibold">{alertCount} item{alertCount !== 1 ? "s" : ""}</span>{" "}
              need attention — {stats.lowStockCount} low stock, {stats.outOfStockCount} out of stock.
            </span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            subtitle={`${stats.totalQuantity.toLocaleString()} total units`}
            icon={Boxes}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Inventory Value"
            value={formatCurrency(stats.totalValue)}
            subtitle="At cost price"
            icon={DollarSign}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockCount}
            subtitle="Below reorder threshold"
            icon={AlertTriangle}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
          />
          <StatCard
            title="Out of Stock"
            value={stats.outOfStockCount}
            subtitle="Needs immediate restocking"
            icon={XCircle}
            iconColor="text-red-600"
            iconBg="bg-red-50"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StockChart data={stats.categoryBreakdown} />
          <ValueChart data={stats.categoryBreakdown} />
        </div>

        {/* Bottom Row: Recent Activity + Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentActivity products={enriched} />
          </div>

          {/* Category summary */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat) => {
                const breakdown = stats.categoryBreakdown.find((b) => b.category === cat.name);
                const total = stats.totalQuantity || 1;
                const pct = Math.round(((breakdown?.quantity ?? 0) / total) * 100);
                return (
                  <li key={cat.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-slate-700 font-medium">{cat.name}</span>
                      </div>
                      <span className="text-slate-500">{breakdown?.quantity ?? 0} units</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
