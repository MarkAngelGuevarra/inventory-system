"use client";

import Header from "@/components/layout/Header";
import { Boxes, Github, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Settings" subtitle="Application configuration" />
      <div className="flex-1 p-6 space-y-4 max-w-2xl">

        {/* App Info */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Boxes className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">StockFlow</h2>
              <p className="text-sm text-slate-500">v1.0.0 · Inventory Management System</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Framework", value: "Next.js 14" },
              { label: "Storage", value: "localStorage" },
              { label: "Deployment", value: "Vercel" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Data Management</h3>
          <p className="text-sm text-slate-500 mb-4">
            Your inventory data is stored locally in your browser&apos;s localStorage.
            It persists across sessions on this device.
          </p>
          <button
            onClick={() => {
              if (confirm("This will delete ALL inventory data and restore sample data. Are you sure?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Reset to Sample Data
          </button>
        </div>

        {/* Links */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Resources</h3>
          <div className="space-y-2">
            {[
              { icon: Github, label: "GitHub Repository", href: "https://github.com" },
              { icon: Globe, label: "Vercel Dashboard", href: "https://vercel.com/dashboard" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-sm group"
              >
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
