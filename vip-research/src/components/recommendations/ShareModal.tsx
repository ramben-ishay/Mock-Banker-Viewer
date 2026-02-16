"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { AIPersonalizedBadge } from "@/components/ui/AIPersonalizedBadge";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { useApp } from "@/lib/vip-context";
import { Recommendation, QuoteSuggestion as QuoteSuggestionType } from "@/lib/types";
import { QUOTE_SUGGESTIONS } from "@/lib/data";
import { generatePersonalizedComment } from "@/lib/personalized-comments";
import { Send, ChevronDown, ChevronUp, Check, X, Sparkles, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation;
  vipName: string;
  vipId: string;
}

export function ShareModal({
  isOpen,
  onClose,
  recommendation,
  vipName,
  vipId,
}: ShareModalProps) {
  const { dispatch, addToast } = useApp();
  const vipFirstName = useMemo(() => vipName.split(" ")[0] || vipName, [vipName]);
  const [message, setMessage] = useState(
    `Hi ${vipName},\n\nI thought you'd find this research particularly relevant given your current interests. ${recommendation.aiExplanation}\n\nLet me know if you'd like to discuss any of the key findings.\n\nBest regards`
  );
  const [showQuotes, setShowQuotes] = useState(false);
  const [quotes, setQuotes] = useState<
    (QuoteSuggestionType & { comment: string; status: "pending" | "approved" | "rejected" })[]
  >(
    (QUOTE_SUGGESTIONS[recommendation.documentId] || []).map((q) => ({
      ...q,
      comment: generatePersonalizedComment(vipName, q.quoteText),
      status: "pending" as const,
    }))
  );
  const [didAnimateDrafts, setDidAnimateDrafts] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, { stage: "typing" | "done"; delayMs: number }>>(
    {}
  );

  const handleSend = () => {
    const approvedQuotes = quotes
      .filter((q) => q.status === "approved")
      .map((q) => ({
        quoteText: q.quoteText,
        comment: q.comment,
        pageReference: q.pageReference,
      }));

    dispatch({
      type: "SHARE_DOCUMENT",
      payload: {
        vipId,
        recommendationId: recommendation.id,
        documentId: recommendation.documentId,
        documentTitle: recommendation.documentTitle,
        approvedQuotes,
      },
    });
    addToast(`Research shared with ${vipName}`);
    onClose();
  };

  const handleApprove = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: "approved" } : q))
    );
  };

  const handleReject = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: "rejected" } : q))
    );
  };

  const handleCommentChange = (quoteId: string, comment: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, comment } : q))
    );
  };

  const pendingQuotes = quotes.filter((q) => q.status !== "rejected");
  const pendingDraftQuotes = quotes.filter((q) => q.status === "pending");
  const approvedCount = quotes.filter((q) => q.status === "approved").length;

  useEffect(() => {
    if (!showQuotes) return;
    if (didAnimateDrafts) return;
    setDidAnimateDrafts(true);

    // Only animate the initial AI drafts once (first time expanded).
    const nextDrafts: Record<string, { stage: "typing" | "done"; delayMs: number }> = {};
    pendingDraftQuotes.forEach((q, idx) => {
      nextDrafts[q.id] = { stage: "typing", delayMs: idx * 180 };
    });
    setDrafts(nextDrafts);
  }, [showQuotes, didAnimateDrafts, pendingDraftQuotes]);

  useEffect(() => {
    if (!isOpen) {
      setDrafts({});
      setDidAnimateDrafts(false);
      setShowQuotes(false);
    }
  }, [isOpen]);

  const quoteListVariants = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const quoteItemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Distribute Research"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        {/* Document and VIP info */}
        <div className="bg-neutral-200 rounded-cta p-3">
          <p className="text-sm text-neutral-600">Distributing to</p>
          <p className="text-base font-semibold text-neutral-950">
            {vipName}
          </p>
          <a
            href={`/viewer/${recommendation.documentId}?vipId=${vipId}`}
            className="text-sm text-neutral-700 mt-1 hover:text-brand-500 transition-colors inline-flex items-center gap-1"
          >
            {recommendation.documentTitle}
            <ExternalLink size={12} className="opacity-50 flex-shrink-0" />
          </a>
        </div>

        {/* Personalized Message */}
        <Textarea
          label="Coverage Note"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px]"
        />

        {/* Add a Comment (expandable) */}
        <div className="border border-neutral-300 rounded-popup overflow-hidden">
          <button
            onClick={() => setShowQuotes(!showQuotes)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-500" />
              AI-Generated Annotations
              <AnimatePresence mode="popLayout" initial={false}>
                {approvedCount > 0 && (
                  <motion.span
                    key={approvedCount}
                    initial={{ opacity: 0, scale: 0.95, y: -1 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -1 }}
                    className="ml-1 px-1.5 py-0.5 bg-status-green-100 text-status-green-700 text-xs rounded-xsm"
                  >
                    {approvedCount} approved
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            {showQuotes ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          <AnimatePresence>
            {showQuotes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 flex flex-col gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="rounded-cta border border-brand-200 bg-brand-100 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <AIPersonalizedBadge
                        variant="commenter"
                        label="AI Coverage Note"
                      />
                      <span className="text-[10px] text-neutral-600">
                        Approve to include as margin notes
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 mt-1">
                      <TypewriterText
                        text={`AI analyzed ${recommendation.documentTitle} and prepared ${pendingQuotes.length} personalized annotations for ${vipFirstName}.`}
                        speed={10}
                        startDelay={120}
                        showCursor={false}
                      />
                    </p>
                  </motion.div>
                  <AnimatePresence>
                    <motion.div
                      variants={quoteListVariants}
                      initial="hidden"
                      animate="show"
                      className="flex flex-col gap-3"
                    >
                      {pendingQuotes.map((quote) => {
                        const draft = drafts[quote.id];
                        const isTyping = draft?.stage === "typing";
                        const draftDelayMs = draft?.delayMs ?? 0;
                        return (
                      <motion.div
                        key={quote.id}
                        variants={quoteItemVariants}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 520, damping: 34 }}
                        animate={
                          quote.status === "approved"
                            ? { scale: 1.01 }
                            : { scale: 1 }
                        }
                        className={`border rounded-cta p-3 ${
                          quote.status === "approved"
                            ? "border-status-green-500 bg-status-green-100"
                            : "border-neutral-300"
                        }`}
                      >
                        {/* Quote text */}
                        <div className="border-l-[3px] border-brand-400 pl-3 mb-2">
                          <p className="text-sm text-neutral-800 italic leading-relaxed">
                            &ldquo;{quote.quoteText}&rdquo;
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {quote.pageReference}
                          </p>
                        </div>

                        {/* Comment input */}
                        {quote.status === "pending" && (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5 text-[10px] text-neutral-600">
                                <Sparkles size={12} className="text-brand-500" />
                                <span>{isTyping ? "AI writing" : "AI draft"}</span>
                              </div>
                              {isTyping && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDrafts((prev) => ({
                                      ...prev,
                                      [quote.id]: { stage: "done", delayMs: draftDelayMs },
                                    }))
                                  }
                                  className="text-[10px] font-semibold text-brand-500 hover:text-brand-700 transition-colors"
                                >
                                  Edit now
                                </button>
                              )}
                            </div>
                            {isTyping ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [quote.id]: { stage: "done", delayMs: draftDelayMs },
                                  }))
                                }
                                className="w-full text-left px-3 py-2 text-sm bg-neutral-000 border border-neutral-300 rounded-cta outline-none focus:border-brand-300 mb-2"
                                title="Click to edit immediately"
                              >
                                <TypewriterText
                                  text={quote.comment}
                                  speed={10}
                                  startDelay={draftDelayMs}
                                  editBackspaceChars={10}
                                  editPauseMs={260}
                                  onComplete={() =>
                                    setDrafts((prev) => ({
                                      ...prev,
                                      [quote.id]: { stage: "done", delayMs: draftDelayMs },
                                    }))
                                  }
                                />
                              </button>
                            ) : (
                              <textarea
                                placeholder="Add your note on this passage..."
                                value={quote.comment}
                                onChange={(e) =>
                                  handleCommentChange(quote.id, e.target.value)
                                }
                                className="w-full min-h-[56px] px-3 py-2 text-sm bg-neutral-000 border border-neutral-300 rounded-cta placeholder-neutral-500 outline-none focus:border-brand-300 mb-2 resize-none leading-relaxed"
                              />
                            )}
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                size="xsm"
                                icon={<Check size={14} />}
                                onClick={() => handleApprove(quote.id)}
                                className="bg-status-green-700 hover:bg-status-green-500"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="tertiary"
                                size="xsm"
                                icon={<X size={14} />}
                                onClick={() => handleReject(quote.id)}
                                className="text-status-red-700"
                              >
                                Reject
                              </Button>
                            </div>
                          </>
                        )}

                        {quote.status === "approved" && (
                          <p className="text-xs text-status-green-700 font-semibold flex items-center gap-1">
                            <Check size={14} /> Approved
                            {quote.comment && ` — "${quote.comment}"`}
                          </p>
                        )}
                      </motion.div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Send button */}
        <div className="flex justify-end gap-3 mt-2 pb-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<Send size={16} />}
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}
