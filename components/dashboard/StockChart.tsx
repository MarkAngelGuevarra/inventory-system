"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface StockChartProps {
  data: { category: string; quantity: number; value: number }[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#f97316"];

export default function StockChart({ data }: StockChartProps) {
  if (!data.length) return null;

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Stock by Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "12px",
            }}
            cursor={{ fill: "#f1f5f9" }}
          />
          <Bar dataKey="quantity" radius={[4, 4, 0, 0]} name="Qty">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
