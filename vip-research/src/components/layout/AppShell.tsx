"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { AppProvider } from "@/lib/vip-context";
import { ToastContainer } from "@/components/ui/Toast";

import { motion, AnimatePresence } from "framer-motion";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isViewerRoute = pathname.startsWith("/viewer");
  const isLandingPage = pathname === "/";
  const shellStyle = { "--sidebar-width": "240px" } as React.CSSProperties;

  return (
    <AppProvider>
      {isViewerRoute || isLandingPage ? (
        /* Full screen viewer or landing page without sidebar chrome */
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      ) : (
        <div className="flex min-h-screen bg-neutral-100" style={shellStyle}>
          <Sidebar />
          <main className="flex-1 ml-[var(--sidebar-width)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-6xl mx-auto px-10 py-12"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
      <ToastContainer />
    </AppProvider>
  );
}
