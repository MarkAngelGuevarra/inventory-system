import { ProductWithCategory } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import { Package, AlertTriangle, XCircle } from "lucide-react";

interface RecentActivityProps {
  products: ProductWithCategory[];
}

export default function RecentActivity({ products }: RecentActivityProps) {
  // Sort by most recently updated
  const recent = [...products]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Updates</h3>
      {recent.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
      ) : (
        <ul className="space-y-3">
          {recent.map((p) => (
            <li key={p.id} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${p.category?.color ?? "#94a3b8"}20` }}
              >
                {p.stockStatus === "out-of-stock" ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : p.stockStatus === "low-stock" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                ) : (
                  <Package className="w-4 h-4" style={{ color: p.category?.color ?? "#64748b" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                <p className="text-xs text-slate-500">
                  <span className="font-medium">{p.quantity}</span> units ·{" "}
                  {p.category?.name ?? "Uncategorized"}
                </p>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {formatRelativeDate(p.updatedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
