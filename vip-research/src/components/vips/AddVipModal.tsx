"use client";

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/vip-context";
import { VIP, PredefinedVipSuggestion } from "@/lib/types";
import {
  PREDEFINED_VIP_SUGGESTIONS,
} from "@/lib/mock-data";

interface AddVipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tracks which fields have been progressively filled via Tab
type PrototypeFillStage = "none" | "name" | "email" | "interests" | "notes" | "done";

const STAGE_ORDER: PrototypeFillStage[] = ["none", "name", "email", "interests", "notes", "done"];

function nextStage(current: PrototypeFillStage): PrototypeFillStage {
  const idx = STAGE_ORDER.indexOf(current);
  return idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : current;
}

function stageReached(current: PrototypeFillStage, target: PrototypeFillStage): boolean {
  return STAGE_ORDER.indexOf(current) >= STAGE_ORDER.indexOf(target);
}

// Typewriter animation hook
function useTypewriter(targetText: string, active: boolean, speed: number = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setDone(false);
      return;
    }
    if (!targetText) {
      setDisplayed("");
      setDone(true);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(targetText.slice(0, i));
      if (i >= targetText.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [targetText, active, speed]);

  return { displayed, done };
}

export function AddVipModal({ isOpen, onClose }: AddVipModalProps) {
  const { dispatch, addToast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<PredefinedVipSuggestion | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Progressive fill state
  const [fillStage, setFillStage] = useState<PrototypeFillStage>("none");
  const [pendingSuggestion, setPendingSuggestion] = useState<PredefinedVipSuggestion | null>(null);

  // Refs for focus management
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const interestsInputRef = useRef<HTMLTextAreaElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);

  // Typewriter animations for each field
  const emailTypewriter = useTypewriter(
    pendingSuggestion?.email || "",
    fillStage === "email",
    14
  );
  const interestsTypewriter = useTypewriter(
    pendingSuggestion?.interests.join(", ") || "",
    fillStage === "interests",
    10
  );
  const notesTypewriter = useTypewriter(
    pendingSuggestion?.communicationNotes || "",
    fillStage === "notes",
    8
  );

  // Sync typewriter output into form state
  useEffect(() => {
    if (fillStage === "email") {
      setEmail(emailTypewriter.displayed);
    }
  }, [emailTypewriter.displayed, fillStage]);

  useEffect(() => {
    if (fillStage === "interests") {
      setInterests(interestsTypewriter.displayed);
    }
  }, [interestsTypewriter.displayed, fillStage]);

  useEffect(() => {
    if (fillStage === "notes") {
      setNotes(notesTypewriter.displayed);
    }
  }, [notesTypewriter.displayed, fillStage]);

  // Auto advance to next stage when typewriter finishes
  useEffect(() => {
    if (fillStage === "email" && emailTypewriter.done && pendingSuggestion) {
      setEmail(pendingSuggestion.email);
    }
  }, [emailTypewriter.done, fillStage, pendingSuggestion]);

  useEffect(() => {
    if (fillStage === "interests" && interestsTypewriter.done && pendingSuggestion) {
      setInterests(pendingSuggestion.interests.join(", "));
    }
  }, [interestsTypewriter.done, fillStage, pendingSuggestion]);

  useEffect(() => {
    if (fillStage === "notes" && notesTypewriter.done && pendingSuggestion) {
      setNotes(pendingSuggestion.communicationNotes);
      // Mark as fully done and show the CRM badge
      setSelectedSuggestion(pendingSuggestion);
      setFillStage("done");
    }
  }, [notesTypewriter.done, fillStage, pendingSuggestion]);

  // Focus the right field when stage changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fillStage === "email") {
        emailInputRef.current?.focus();
      } else if (fillStage === "interests") {
        interestsInputRef.current?.focus();
      } else if (fillStage === "notes") {
        notesInputRef.current?.focus();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [fillStage]);

  const matchingSuggestions = useMemo(() => {
    if (!name.trim() || selectedSuggestion || pendingSuggestion) return [];
    const q = name.toLowerCase();
    return PREDEFINED_VIP_SUGGESTIONS.filter((s) =>
      s.name.toLowerCase().startsWith(q)
    );
  }, [name, selectedSuggestion, pendingSuggestion]);

  const ghostText = useMemo(() => {
    if (matchingSuggestions.length === 0 || !name.trim()) return "";
    return matchingSuggestions[highlightedIndex]?.name.slice(name.length) || "";
  }, [matchingSuggestions, name, highlightedIndex]);

  // Ghost text for email, interests, notes (shown before their stage is active)
  const emailGhost = useMemo(() => {
    if (!pendingSuggestion || stageReached(fillStage, "email")) return "";
    return pendingSuggestion.email;
  }, [pendingSuggestion, fillStage]);

  const interestsGhost = useMemo(() => {
    if (!pendingSuggestion || stageReached(fillStage, "interests")) return "";
    return pendingSuggestion.interests.join(", ");
  }, [pendingSuggestion, fillStage]);

  const notesGhost = useMemo(() => {
    if (!pendingSuggestion || stageReached(fillStage, "notes")) return "";
    return pendingSuggestion.communicationNotes;
  }, [pendingSuggestion, fillStage]);

  // Step 1: Name selected via Tab or click, only fills name
  const applyNameSelection = useCallback(
    (suggestion: PredefinedVipSuggestion) => {
      setName(suggestion.name);
      setPendingSuggestion(suggestion);
      setShowDropdown(false);
      setHighlightedIndex(0);
      setFillStage("name");
      // Focus email after a brief moment
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    },
    []
  );

  // Step 2+: Tab on subsequent fields triggers the fill animation
  const advancePrototypeFill = useCallback(() => {
    if (!pendingSuggestion) return false;
    const next = nextStage(fillStage);
    if (next !== fillStage && next !== "done") {
      setFillStage(next);
      return true;
    }
    return false;
  }, [pendingSuggestion, fillStage]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSelectedSuggestion(null);
    setPendingSuggestion(null);
    setFillStage("none");
    setEmail("");
    setInterests("");
    setNotes("");
    setShowDropdown(val.trim().length > 0);
    setHighlightedIndex(0);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Demo-friendly: if user hits Tab immediately, accept the top suggestion (Alexandra).
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

  const handleFieldTab = (e: React.KeyboardEvent, fieldStage: PrototypeFillStage) => {
    if (e.key === "Tab" && pendingSuggestion && !stageReached(fillStage, fieldStage)) {
      e.preventDefault();
      advancePrototypeFill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (email && !email.includes("@")) newErrors.email = "Invalid email address";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const suggestion = selectedSuggestion || pendingSuggestion;

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const colors = ["#444aff", "#5ad45a", "#ffa537", "#f6554f", "#4a92ff"];
    const color = suggestion
      ? suggestion.avatarColor
      : colors[Math.floor(Math.random() * colors.length)];

    const newVip: VIP = {
      id: `vip-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      company: suggestion?.company || "",
      role: suggestion?.role || "",
      aum: suggestion?.aum || "",
      interests: interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      communicationNotes: notes.trim(),
      docsShared: 0,
      avgCompletion: 0,
      lastActive: new Date().toISOString().split("T")[0],
      lastMeeting: suggestion
        ? suggestion.pastCommunications[0]?.date || ""
        : "",
      readingProfile: suggestion?.readingProfile || "New VIP, no reading history yet.",
      pastCommunications: suggestion?.pastCommunications || [],
      avatar: { initials, color },
    };

    dispatch({ type: "ADD_VIP", payload: newVip });
    addToast(`${name} has been added to your VIP list`);
    onClose();
    setName("");
    setEmail("");
    setInterests("");
    setNotes("");
    setErrors({});
    setSelectedSuggestion(null);
    setPendingSuggestion(null);
    setShowDropdown(false);
    setHighlightedIndex(0);
    setFillStage("none");
  };

  const showCrmBadge = selectedSuggestion || (pendingSuggestion && fillStage === "done");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add VIP Manually">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name input with autocomplete */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-neutral-900">
            Name *
          </label>
          <div className="relative">
            {/* Ghost text layer */}
            <div className="absolute inset-0 h-10 px-3 flex items-center pointer-events-none overflow-hidden">
              <span className="text-transparent whitespace-pre">{name}</span>
              <span className="text-neutral-400 whitespace-pre">{ghostText}</span>
            </div>
            {/* Actual input */}
            <input
              ref={nameInputRef}
              type="text"
              placeholder="Start typing a name..."
              value={name}
              onChange={handleNameChange}
              onKeyDown={handleNameKeyDown}
              onFocus={() => {
                if (name.trim() && !selectedSuggestion && !pendingSuggestion) setShowDropdown(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowDropdown(false), 200);
              }}
              className={`relative w-full h-10 px-3 bg-transparent border border-neutral-300 rounded-cta text-neutral-950 placeholder-neutral-500 transition-all duration-200 outline-none hover:border-neutral-500 focus:border-brand-300 ${
                errors.name ? "border-status-red-700" : ""
              }`}
              autoComplete="off"
            />
            {/* Dropdown suggestions */}
            {showDropdown && matchingSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-000 border border-neutral-300 rounded-cta shadow-fluffy z-50 max-h-48 overflow-y-auto">
                {matchingSuggestions.map((suggestion, idx) => (
                  <button
                    key={suggestion.email}
                    type="button"
                    className={`w-full text-left px-3 py-2.5 flex flex-col transition-colors ${
                      idx === highlightedIndex
                        ? "bg-brand-100"
                        : "hover:bg-neutral-200"
                    }`}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => applyNameSelection(suggestion)}
                  >
                    <span className="text-sm font-medium text-neutral-950">
                      {suggestion.name}
                    </span>
                    <span className="text-xs text-neutral-600">
                      {suggestion.role}, {suggestion.company}
                    </span>
                  </button>
                ))}
                <div className="px-3 py-1.5 text-[10px] text-neutral-500 border-t border-neutral-200">
                  Press Tab to accept · Arrow keys to navigate
                </div>
              </div>
            )}
          </div>
          {errors.name && (
            <span className="text-xs text-status-red-700">{errors.name}</span>
          )}
          {ghostText && (
            <span className="text-[10px] text-neutral-500 mt-0.5">
              Press Tab to autocomplete
            </span>
          )}
        </div>

        {/* Email input with progressive fill */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-neutral-900">
            Email *
          </label>
          <div className="relative">
            {/* Ghost text for upcoming autofill */}
            {emailGhost && (
              <div className="absolute inset-0 h-10 px-3 flex items-center pointer-events-none overflow-hidden">
                <span className="text-neutral-400 whitespace-pre">{emailGhost}</span>
              </div>
            )}
            <input
              ref={emailInputRef}
              type="email"
              placeholder={pendingSuggestion ? "" : "e.g., john@company.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleFieldTab(e, "email")}
              className={`relative w-full h-10 px-3 bg-transparent border border-neutral-300 rounded-cta text-neutral-950 placeholder-neutral-500 transition-all duration-200 outline-none hover:border-neutral-500 focus:border-brand-300 ${
                errors.email ? "border-status-red-700" : ""
              }`}
              autoComplete="off"
            />
          </div>
          {errors.email && (
            <span className="text-xs text-status-red-700">{errors.email}</span>
          )}
          {emailGhost && (
            <span className="text-[10px] text-neutral-500 mt-0.5">
              Press Tab to autofill email
            </span>
          )}
        </div>

        {/* Interests textarea with progressive fill */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-neutral-900">
            Interests
          </label>
          <div className="relative">
            {/* Ghost text for upcoming autofill */}
            {interestsGhost && (
              <div className="absolute inset-0 px-3 py-2 pointer-events-none overflow-hidden">
                <span className="text-neutral-400 whitespace-pre-wrap text-sm">{interestsGhost}</span>
              </div>
            )}
            <textarea
              ref={interestsInputRef}
              placeholder={pendingSuggestion ? "" : "Comma separated interests, e.g., Semiconductors, AI, ESG"}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              onKeyDown={(e) => handleFieldTab(e, "interests")}
              className="relative w-full min-h-[100px] px-3 py-2 bg-transparent border border-neutral-300 rounded-cta text-neutral-950 placeholder-neutral-500 transition-all duration-200 outline-none resize-y hover:border-neutral-500 focus:border-brand-300"
            />
          </div>
          {interestsGhost && (
            <span className="text-[10px] text-neutral-500 mt-0.5">
              Press Tab to autofill interests
            </span>
          )}
        </div>

        {/* Communication Notes textarea with progressive fill */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-neutral-900">
            Communication Notes
          </label>
          <div className="relative">
            {/* Ghost text for upcoming autofill */}
            {notesGhost && (
              <div className="absolute inset-0 px-3 py-2 pointer-events-none overflow-hidden">
                <span className="text-neutral-400 whitespace-pre-wrap text-sm">{notesGhost}</span>
              </div>
            )}
            <textarea
              ref={notesInputRef}
              placeholder={pendingSuggestion ? "" : "Optional notes about communication preferences..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={(e) => handleFieldTab(e, "notes")}
              className="relative w-full min-h-[100px] px-3 py-2 bg-transparent border border-neutral-300 rounded-cta text-neutral-950 placeholder-neutral-500 transition-all duration-200 outline-none resize-y hover:border-neutral-500 focus:border-brand-300"
            />
          </div>
          {notesGhost && (
            <span className="text-[10px] text-neutral-500 mt-0.5">
              Press Tab to autofill notes
            </span>
          )}
        </div>

        {/* Selection indicator */}
        {showCrmBadge && (
          <div className="flex items-center gap-2 px-3 py-2 bg-brand-100 rounded-cta text-xs text-brand-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Profile loaded from CRM: {(selectedSuggestion || pendingSuggestion)?.company}
          </div>
        )}

        <div className="flex gap-3 justify-end mt-2 pb-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add VIP
          </Button>
        </div>
      </form>
    </Modal>
  );
}
