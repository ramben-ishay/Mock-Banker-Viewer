"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useApp } from "@/lib/vip-context";
import { Recommendation, QuoteSuggestion as QuoteSuggestionType } from "@/lib/types";
import { QUOTE_SUGGESTIONS, DOCUMENTS } from "@/lib/mock-data";
import { Send, ChevronDown, ChevronUp, Check, X, Quote, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation;
  vipName: string;
  vipId: string;
}

function generatePersonalizedComment(vipName: string, quoteText: string): string {
  const firstName = vipName.split(" ")[0];
  const snippet = quoteText.length > 60 ? quoteText.substring(0, 60) + "..." : quoteText;
  const templates = [
    `Hi ${firstName}, following our discussion last week, this finding on "${snippet}" could be particularly relevant for your portfolio.`,
    `${firstName}, this passage caught my attention given your current positioning. The data on "${snippet}" may inform your next allocation decision.`,
    `Hi ${firstName}, I wanted to flag this specific insight: "${snippet}". It connects directly to the themes we discussed in our last meeting.`,
  ];
  const index = Math.abs(quoteText.length % templates.length);
  return templates[index];
}

export function ShareModal({
  isOpen,
  onClose,
  recommendation,
  vipName,
  vipId,
}: ShareModalProps) {
  const { dispatch, addToast } = useApp();
  const [message, setMessage] = useState(
    `Hi ${vipName},\n\nI thought you'd find this research particularly relevant given your current interests. ${recommendation.aiExplanation}\n\nLet me know if you'd like to discuss any of the key findings.\n\nBest regards`
  );
  const [showQuotes, setShowQuotes] = useState(false);
  const [quotes, setQuotes] = useState<
    (QuoteSuggestionType & { comment: string; status: "pending" | "approved" | "rejected" })[]
  >(
    (QUOTE_SUGGESTIONS[recommendation.documentId] || []).map((q, idx) => ({
      ...q,
      comment: generatePersonalizedComment(vipName, q.quoteText),
      status: "pending" as const,
    }))
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Research"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        {/* Document and VIP info */}
        <div className="bg-neutral-200 rounded-cta p-3">
          <p className="text-sm text-neutral-600">Sharing with</p>
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
          label="Personalized Message"
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
              <Quote size={16} className="text-brand-500" />
              Add a Comment
              {quotes.filter((q) => q.status === "approved").length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-status-green-100 text-status-green-700 text-xs rounded-xsm">
                  {quotes.filter((q) => q.status === "approved").length} approved
                </span>
              )}
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
                  <p className="text-xs text-neutral-600">
                    AI suggested key passages from the document. Approve to
                    attach as annotations. Comments are pre filled with personalized suggestions.
                  </p>
                  <AnimatePresence>
                    {pendingQuotes.map((quote) => (
                      <motion.div
                        key={quote.id}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
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
                            <input
                              type="text"
                              placeholder="Add your comment on this passage..."
                              value={quote.comment}
                              onChange={(e) =>
                                handleCommentChange(quote.id, e.target.value)
                              }
                              className="w-full h-8 px-3 text-sm bg-neutral-000 border border-neutral-300 rounded-cta placeholder-neutral-500 outline-none focus:border-brand-300 mb-2"
                            />
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
                    ))}
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
