"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  BarChart3,
  Settings,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",  href: "/dashboard",   icon: LayoutDashboard },
  { label: "Products",   href: "/products",    icon: Package },
  { label: "Categories", href: "/categories",  icon: Tags },
  { label: "Analytics",  href: "/analytics",   icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f172a] flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Boxes className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">StockFlow</p>
          <p className="text-slate-400 text-xs">Inventory Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider px-3 pb-2">
          Main Menu
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 flex-shrink-0 transition-colors",
                isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
              )} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-150 group"
        >
          <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
          Settings
        </Link>
        <div className="mt-3 px-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">Admin User</p>
              <p className="text-slate-500 text-xs truncate">admin@stockflow.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
