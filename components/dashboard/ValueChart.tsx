"use client";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ValueChartProps {
  data: { category: string; value: number }[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#f97316"];

export default function ValueChart({ data }: ValueChartProps) {
  const filtered = data.filter((d) => d.value > 0);
  if (!filtered.length) return null;

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Inventory Value by Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={filtered}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
          >
            {filtered.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              background: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "12px",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "#64748b", fontSize: "11px" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
