"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  /**
   * When true, disable overlay/Escape/X close.
   * Useful for short, non-interruptible demo animations.
   */
  preventClose?: boolean;
  /** Controls the dialog exit animation feel. */
  exitVariant?: "shrink" | "expand";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  preventClose = false,
  exitVariant = "shrink",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (preventClose) return;
      onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, preventClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-neutral-800/50"
            onClick={preventClose ? undefined : onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: exitVariant === "expand" ? 1.02 : 0.95,
            }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${maxWidth} bg-neutral-000 rounded-popup shadow-overlay max-h-[85vh] overflow-y-auto`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-300">
                <h6 className="text-lg font-bold font-[family-name:var(--font-heading)] text-neutral-950">
                  {title}
                </h6>
                <button
                  onClick={preventClose ? undefined : onClose}
                  disabled={preventClose}
                  className={`p-1 rounded-cta transition-colors cursor-pointer ${
                    preventClose
                      ? "text-neutral-400 cursor-not-allowed"
                      : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
