import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "StockFlow — Inventory Management",
  description: "Modern inventory management system built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <Sidebar />
        <main className="ml-64 min-h-screen flex flex-col">
          {children}
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: "14px",
              borderRadius: "10px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
