"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/vips", label: "My VIPs", icon: Users },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[var(--sidebar-width)] bg-neutral-100 border-r border-neutral-300 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16">
        <div className="w-8 h-8 rounded-cta bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <span className="font-[family-name:var(--font-heading)] font-bold text-xl tracking-tight text-neutral-950">
          Factify
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-cta text-[15px] transition-all duration-200",
                    isActive
                      ? "bg-white text-brand-500 shadow-tight font-bold border border-neutral-300/50"
                      : "text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950 font-medium"
                  )}
                >
                  <item.icon size={18} className={cn(isActive ? "text-brand-500" : "text-neutral-600")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 bg-neutral-100/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-brand-500/10">
            YB
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-950">
              Your Banker
            </span>
            <span className="text-[11px] font-medium text-neutral-600 uppercase tracking-wider">
              Private Banking
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
