"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";

interface VipAiSynthesisAnimationProps {
  vipName: string;
  vipInitials: string;
  interests?: string[];
  onComplete: () => void;
}

type Step = {
  label: string;
  sublabel: string;
  ms: number; // time at which this step becomes active
};

const STEPS: Step[] = [
  { label: "Importing CRM Intelligence", sublabel: "Loading profile, engagement history, and mandate parameters", ms: 0 },
  { label: "Mapping Investment Preferences", sublabel: "Constructing client-specific relevance model", ms: 1500 },
  { label: "Scoring Research Library", sublabel: "Matching reports against client mandate", ms: 3000 },
  { label: "Ranking Recommendations", sublabel: "Ordering by relevance and recent engagement signals", ms: 4500 },
  { label: "Finalizing Coverage Profile", sublabel: "Preparing client-ready briefing", ms: 5400 },
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function VipAiSynthesisAnimation({
  vipName,
  vipInitials,
  interests = [],
  onComplete,
}: VipAiSynthesisAnimationProps) {
  const [activeStep, setActiveStep] = useState(0);

  const tagList = useMemo(() => {
    const cleaned = interests
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 4);
    return cleaned.length > 0 ? cleaned : ["Macro", "FX", "Commodities", "ESG"];
  }, [interests]);

  const particles = useMemo(() => {
    // Deterministic particles to avoid visual "jump" on re-render.
    const rand = mulberry32(42);
    const count = 18;
    return Array.from({ length: count }).map((_, i) => {
      const side = Math.floor(rand() * 4); // 0 top, 1 right, 2 bottom, 3 left
      const spread = rand() * 260 - 130;
      const distance = 210 + rand() * 90;
      const start =
        side === 0
          ? { x: spread, y: -distance }
          : side === 1
            ? { x: distance, y: spread }
            : side === 2
              ? { x: spread, y: distance }
              : { x: -distance, y: spread };
      const delay = rand() * 0.8 + i * 0.03;
      const size = clamp(3 + rand() * 4, 3, 6);
      const hue = rand() > 0.55 ? "rgba(68,74,255,1)" : "rgba(255,127,246,1)";
      return { ...start, delay, size, hue };
    });
  }, []);

  useEffect(() => {
    const timeouts: number[] = [];
    STEPS.forEach((s, idx) => {
      const t = window.setTimeout(() => setActiveStep(idx), s.ms);
      timeouts.push(t);
    });

    // Total duration: ~5.8s
    const done = window.setTimeout(() => onComplete(), 5800);
    timeouts.push(done);

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [onComplete]);

  const vipFirstName = useMemo(() => vipName.split(" ")[0] || vipName, [vipName]);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
            Preparing {vipFirstName}
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600">
            AI coverage synthesis
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <Sparkles size={14} className="text-brand-500" />
          Live analysis
        </div>
      </div>

      {/* Main panel */}
      <div className="mt-4 relative w-full p-1 rounded-2xl overflow-hidden">
        {/* Animated gradient border */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(0deg, rgba(68,74,255,1), rgba(255,127,246,1), rgba(68,74,255,1))",
              "linear-gradient(120deg, rgba(68,74,255,1), rgba(255,127,246,1), rgba(68,74,255,1))",
              "linear-gradient(240deg, rgba(68,74,255,1), rgba(255,127,246,1), rgba(68,74,255,1))",
              "linear-gradient(360deg, rgba(68,74,255,1), rgba(255,127,246,1), rgba(68,74,255,1))",
            ],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />

        <div className="relative w-full bg-neutral-000/70 rounded-[14px] border border-neutral-200/50 overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4 p-5">
            {/* Visualization */}
            <div className="relative min-h-[260px] rounded-2xl bg-white/55 border border-neutral-200/70 overflow-hidden">
              {/* Soft vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(68,74,255,0.12), transparent 55%), radial-gradient(circle at 70% 60%, rgba(255,127,246,0.10), transparent 55%)",
                }}
              />

              {/* Particles streaming in */}
              <div className="absolute inset-0 flex items-center justify-center">
                {particles.map((p, idx) => (
                  <motion.span
                    key={idx}
                    className="absolute rounded-full"
                    style={{
                      width: p.size,
                      height: p.size,
                      background: p.hue,
                      boxShadow: "0 0 18px rgba(68,74,255,0.22)",
                    }}
                    initial={{ x: p.x, y: p.y, opacity: 0, scale: 0.8 }}
                    animate={{
                      x: [p.x, 0],
                      y: [p.y, 0],
                      opacity: [0, 0.9, 0],
                      scale: [0.75, 1, 0.6],
                    }}
                    transition={{
                      duration: 1.55,
                      delay: p.delay,
                      repeat: Infinity,
                      repeatDelay: 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Central shield */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: activeStep >= 2 ? [1, 1.05, 1] : [1, 1.03, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(68,74,255,0.00)",
                      "0 0 0 10px rgba(68,74,255,0.06)",
                      "0 0 0 0 rgba(68,74,255,0.00)",
                    ],
                  }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.35)), linear-gradient(135deg, rgba(68,74,255,0.9), rgba(255,127,246,0.75))",
                  }}
                >
                  <div className="absolute inset-0 rounded-full opacity-40" />
                  <div className="relative z-10 text-neutral-950 font-bold text-2xl tracking-tight">
                    {vipInitials}
                  </div>
                </motion.div>
              </div>

              {/* Orbiting tags */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {tagList.slice(0, 3).map((tag, idx) => {
                  const radius = 92 + idx * 18;
                  const duration = 6.5 + idx * 1.2;
                  return (
                    <motion.div
                      key={tag}
                      className="absolute"
                      animate={{ rotate: 360 }}
                      transition={{ duration, repeat: Infinity, ease: "linear" }}
                    >
                      <div
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                        style={{
                          transform: `translateX(${radius}px)`,
                          background: "rgba(255,255,255,0.72)",
                          borderColor: "rgba(68,74,255,0.18)",
                          color: "rgba(20,20,20,0.9)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                        }}
                      >
                        {tag}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Document scan */}
              <div className="absolute left-4 right-4 bottom-4">
                <div className="grid grid-cols-3 gap-2">
                  {["Research Brief", "Macro Note", "Coverage"].map((t, idx) => (
                    <div
                      key={t}
                      className="relative h-16 rounded-xl border border-neutral-200 bg-white/65 overflow-hidden"
                    >
                      <div className="absolute inset-0 p-2">
                        <div className="h-2 w-2/3 bg-neutral-200 rounded blur-[1px]" />
                        <div className="h-2 w-1/2 bg-neutral-100 rounded blur-[1px] mt-1.5" />
                        <div className="h-2 w-3/4 bg-neutral-100 rounded blur-[1px] mt-3" />
                      </div>
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          opacity: activeStep >= 2 ? 1 : 0,
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        <motion.div
                          className="absolute top-0 bottom-0 w-1/3"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(68,74,255,0.18), transparent)",
                          }}
                          animate={{ left: ["-40%", "120%"] }}
                          transition={{
                            duration: 1.45,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: idx * 0.22,
                          }}
                        />
                      </motion.div>

                      <motion.div
                        className="absolute right-2 bottom-2 text-[10px] font-bold px-2 py-1 rounded-full"
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: activeStep >= 2 ? 1 : 0, y: activeStep >= 2 ? 0 : 2 }}
                        transition={{ duration: 0.25, delay: 0.15 + idx * 0.1 }}
                        style={{
                          background: "rgba(68,74,255,0.10)",
                          color: "rgba(68,74,255,0.95)",
                          border: "1px solid rgba(68,74,255,0.18)",
                        }}
                      >
                        {92 + idx * 3}% match
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Steps list */}
            <div className="flex flex-col gap-3">
              {STEPS.map((s, idx) => {
                const isActive = idx === activeStep;
                const isDone = idx < activeStep;
                return (
                  <div
                    key={s.label}
                    className={`flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-all ${
                      isActive
                        ? "border-brand-200 bg-brand-100"
                        : "border-neutral-200 bg-white/40"
                    }`}
                  >
                    <div className="pt-0.5">
                      {isDone ? (
                        <div className="w-6 h-6 rounded-full bg-status-green-100 text-status-green-700 flex items-center justify-center">
                          <Check size={14} />
                        </div>
                      ) : isActive ? (
                        <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-500 border border-brand-200 flex items-center justify-center">
                          <Loader2 size={14} className="animate-spin" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200 flex items-center justify-center text-[11px] font-bold">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-neutral-950">
                        {s.label}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {s.sublabel}
                      </div>
                    </div>
                  </div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: activeStep >= 4 ? 1 : 0, y: activeStep >= 4 ? 0 : 4 }}
                transition={{ duration: 0.25 }}
                className="mt-1 text-[10px] text-neutral-600 uppercase tracking-[0.22em]"
              >
                Ready in a moment
              </motion.div>
            </div>
          </div>

          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: activeStep >= 3 ? [0, 0.55, 0] : 0,
            }}
            transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent)",
              transform: "translateX(-30%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
