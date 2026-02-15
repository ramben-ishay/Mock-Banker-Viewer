"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { useApp, Toast as ToastType } from "@/lib/vip-context";

const icons: Record<ToastType["type"], React.ReactNode> = {
  success: <CheckCircle size={20} className="text-status-green-700" />,
  info: <Info size={20} className="text-status-blue-700" />,
  warning: <AlertTriangle size={20} className="text-status-orange-700" />,
  danger: <XCircle size={20} className="text-status-red-700" />,
};

const bgColors: Record<ToastType["type"], string> = {
  success: "bg-status-green-100",
  info: "bg-status-blue-100",
  warning: "bg-status-orange-100",
  danger: "bg-status-red-100",
};

export function ToastContainer() {
  const { state, dispatch } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 max-w-[460px]">
      <AnimatePresence>
        {state.toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-cta shadow-fluffy ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <span className="flex-1 text-sm text-neutral-900">
              {toast.message}
            </span>
            <button
              onClick={() =>
                dispatch({ type: "REMOVE_TOAST", payload: toast.id })
              }
              className="p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
