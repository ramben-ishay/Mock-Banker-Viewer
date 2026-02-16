"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/vip-context";
import { VIP, PredefinedVipSuggestion } from "@/lib/types";
import { PREDEFINED_VIP_SUGGESTIONS } from "@/lib/data";
import { VipAiSynthesisAnimation } from "@/components/vips/VipAiSynthesisAnimation";

interface AddVipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AddVipPhase = "name-input" | "synthesis";

export function AddVipModal({ isOpen, onClose }: AddVipModalProps) {
  const { dispatch, addToast } = useApp();
  const router = useRouter();

  const [phase, setPhase] = useState<AddVipPhase>("name-input");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [pendingSuggestion, setPendingSuggestion] = useState<PredefinedVipSuggestion | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const [createdVipId, setCreatedVipId] = useState<string | null>(null);
  const [createdVipName, setCreatedVipName] = useState<string>("");
  const [createdVipInitials, setCreatedVipInitials] = useState<string>("AA");
  const [createdVipInterests, setCreatedVipInterests] = useState<string[]>([]);

  // Reset local state when the modal closes.
  useEffect(() => {
    if (isOpen) return;
    setPhase("name-input");
    setName("");
    setErrors({});
    setShowDropdown(false);
    setHighlightedIndex(0);
    setPendingSuggestion(null);
    setCreatedVipId(null);
    setCreatedVipName("");
    setCreatedVipInitials("AA");
    setCreatedVipInterests([]);
  }, [isOpen]);

  // Autofocus the hero input when opening (only in input phase).
  useEffect(() => {
    if (!isOpen) return;
    if (phase !== "name-input") return;
    const t = window.setTimeout(() => nameInputRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [isOpen, phase]);

  const matchingSuggestions = useMemo(() => {
    if (!name.trim() || pendingSuggestion) return [];
    const q = name.toLowerCase();
    return PREDEFINED_VIP_SUGGESTIONS.filter((s) =>
      s.name.toLowerCase().startsWith(q)
    );
  }, [name, pendingSuggestion]);

  const ghostText = useMemo(() => {
    if (matchingSuggestions.length === 0 || !name.trim()) return "";
    return matchingSuggestions[highlightedIndex]?.name.slice(name.length) || "";
  }, [matchingSuggestions, name, highlightedIndex]);

  // Step 1: Name selected via Tab or click, only fills name
  const applyNameSelection = useCallback(
    (suggestion: PredefinedVipSuggestion) => {
      setName(suggestion.name);
      setPendingSuggestion(suggestion);
      setShowDropdown(false);
      setHighlightedIndex(0);
    },
    []
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setPendingSuggestion(null);
    setShowDropdown(val.trim().length > 0);
    setHighlightedIndex(0);
    setErrors((prev) => {
      if (!prev.name) return prev;
      const next = { ...prev };
      delete next.name;
      return next;
    });
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If the user hits Tab immediately, accept the top suggestion (Alexandra).
    if (e.key === "Tab" && !name.trim() && PREDEFINED_VIP_SUGGESTIONS.length > 0) {
      e.preventDefault();
      applyNameSelection(PREDEFINED_VIP_SUGGESTIONS[0]);
    } else if (e.key === "Tab" && ghostText && matchingSuggestions.length > 0) {
      e.preventDefault();
      applyNameSelection(matchingSuggestions[highlightedIndex]);
    } else if (e.key === "ArrowDown" && showDropdown && matchingSuggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < matchingSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp" && showDropdown && matchingSuggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : matchingSuggestions.length - 1
      );
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const beginSynthesis = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Type a name to continue";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const suggestion =
      pendingSuggestion ||
      PREDEFINED_VIP_SUGGESTIONS.find(
        (s) => s.name.toLowerCase() === name.trim().toLowerCase()
      ) ||
      (ghostText && matchingSuggestions.length > 0
        ? matchingSuggestions[highlightedIndex]
        : null);

    if (!suggestion) {
      setErrors({
        name: "Press Tab to select a suggested VIP (e.g., Alexandra).",
      });
      return;
    }

    const normalizedName = suggestion.name.trim();
    const initials = normalizedName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const colors = ["#444aff", "#5ad45a", "#ffa537", "#f6554f", "#4a92ff"];
    const color =
      suggestion.avatarColor || colors[Math.floor(Math.random() * colors.length)];

    const vipId = `vip-${Date.now()}`;
    const newVip: VIP = {
      id: vipId,
      name: normalizedName,
      email: suggestion.email,
      company: suggestion.company || "",
      role: suggestion.role || "",
      aum: suggestion.aum || "",
      interests: suggestion.interests || [],
      communicationNotes: suggestion.communicationNotes || "",
      docsShared: 0,
      avgCompletion: 0,
      lastActive: new Date().toISOString().split("T")[0],
      lastMeeting: suggestion.pastCommunications?.[0]?.date || "",
      readingProfile: suggestion.readingProfile || "New VIP, no reading history yet.",
      pastCommunications: suggestion.pastCommunications || [],
      avatar: { initials, color },
    };

    dispatch({ type: "ADD_VIP", payload: newVip });
    setCreatedVipId(vipId);
    setCreatedVipName(normalizedName);
    setCreatedVipInitials(initials);
    setCreatedVipInterests((suggestion.interests || []).slice(0, 5));

    router.prefetch(`/vips/${vipId}`);
    addToast(
      `Building ${normalizedName.split(" ")[0]}'s coverage profile...`,
      "info"
    );
    setPhase("synthesis");
  }, [
    addToast,
    dispatch,
    ghostText,
    highlightedIndex,
    matchingSuggestions,
    name,
    pendingSuggestion,
    router,
  ]);

  const handleSynthesisComplete = useCallback(() => {
    if (!createdVipId) return;
    onClose();
    router.push(`/vips/${createdVipId}`);
  }, [createdVipId, onClose, router]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={phase === "name-input" ? "Add VIP" : undefined}
      maxWidth={phase === "name-input" ? "max-w-xl" : "max-w-2xl"}
      preventClose={phase === "synthesis"}
      exitVariant={phase === "synthesis" ? "expand" : "shrink"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {phase === "synthesis" ? (
          <motion.div
            key="synthesis"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="py-1"
          >
            <VipAiSynthesisAnimation
              vipName={createdVipName || pendingSuggestion?.name || name || "VIP"}
              vipInitials={createdVipInitials}
              interests={createdVipInterests}
              onComplete={handleSynthesisComplete}
            />
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-popup"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{
                  opacity: pendingSuggestion ? [0.35, 0.6, 0.35] : [0.22, 0.38, 0.22],
                  scale: pendingSuggestion ? [0.98, 1.04, 0.98] : [0.98, 1.02, 0.98],
                }}
                transition={{
                  duration: pendingSuggestion ? 1.6 : 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-24 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(68,74,255,0.35), transparent 55%), radial-gradient(circle at 70% 60%, rgba(255,127,246,0.22), transparent 52%), radial-gradient(circle at 50% 80%, rgba(68,74,255,0.18), transparent 55%)",
                }}
              />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                beginSynthesis();
              }}
              className="relative z-10 flex flex-col items-center gap-5 py-8"
            >
              <div className="flex flex-col items-center text-center gap-1">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600">
                  Add VIP
                </div>
                <div className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
                  Enter client name
                </div>
                <div className="text-sm text-neutral-600">
                  Tab to match from CRM records.
                </div>
              </div>

              <div className="w-full max-w-[520px] px-1">
                <div className="relative">
                  {/* Ghost text layer */}
                  <div className="absolute inset-0 h-14 px-5 flex items-center pointer-events-none overflow-hidden">
                    <span className="text-transparent whitespace-pre text-2xl font-semibold tracking-tight">
                      {name}
                    </span>
                    <motion.span
                      key={ghostText}
                      initial={{ opacity: 0, x: -2 }}
                      animate={{ opacity: ghostText ? 1 : 0, x: 0 }}
                      transition={{ duration: 0.14 }}
                      className="text-neutral-400 whitespace-pre text-2xl font-semibold tracking-tight"
                    >
                      {ghostText}
                    </motion.span>
                  </div>

                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="Add Name"
                    value={name}
                    onChange={handleNameChange}
                    onKeyDown={handleNameKeyDown}
                    onFocus={() => {
                      if (name.trim() && !pendingSuggestion) setShowDropdown(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowDropdown(false), 200);
                    }}
                    className={`relative w-full h-14 px-5 bg-neutral-000/70 border rounded-2xl text-neutral-950 placeholder-neutral-500 transition-all duration-200 outline-none backdrop-blur-xl text-2xl font-semibold tracking-tight ${
                      errors.name
                        ? "border-status-red-700"
                        : pendingSuggestion
                          ? "border-brand-300 shadow-[0_0_0_4px_rgba(68,74,255,0.12)]"
                          : "border-neutral-300 hover:border-neutral-500 focus:border-brand-300"
                    }`}
                    autoComplete="off"
                  />

                  {/* Dropdown suggestions */}
                  {showDropdown && matchingSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-000/95 border border-neutral-300 rounded-2xl shadow-fluffy z-50 max-h-56 overflow-y-auto backdrop-blur-xl">
                      {matchingSuggestions.map((suggestion, idx) => (
                        <button
                          key={suggestion.email}
                          type="button"
                          className={`w-full text-left px-4 py-3 flex flex-col transition-colors cursor-pointer ${
                            idx === highlightedIndex
                              ? "bg-brand-100"
                              : "hover:bg-neutral-200"
                          }`}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          onMouseDown={(e) => {
                            // Avoid blur before selection.
                            e.preventDefault();
                          }}
                          onClick={() => applyNameSelection(suggestion)}
                        >
                          <span className="text-sm font-semibold text-neutral-950">
                            {suggestion.name}
                          </span>
                          <span className="text-xs text-neutral-600">
                            {suggestion.role}, {suggestion.company}
                          </span>
                        </button>
                      ))}
                      <div className="px-4 py-2 text-[10px] text-neutral-500 border-t border-neutral-200">
                        Tab to accept · Arrow keys to navigate
                      </div>
                    </div>
                  )}
                </div>

                <div className="min-h-[18px] mt-2">
                  {errors.name ? (
                    <span className="text-xs text-status-red-700">{errors.name}</span>
                  ) : pendingSuggestion ? (
                    <span className="text-xs text-brand-500">
                      CRM match: {pendingSuggestion.company}
                    </span>
                  ) : ghostText ? (
                    <span className="text-xs text-neutral-600">Press Tab to accept</span>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-3 justify-end w-full mt-2">
                <Button variant="secondary" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!pendingSuggestion && !name.trim()}
                >
                  Next
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
