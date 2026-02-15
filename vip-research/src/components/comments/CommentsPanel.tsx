"use client";

import React, { useState } from "react";
import { CommentThread } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/vip-context";
import { Send, MessageCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface CommentsPanelProps {
  vipId: string;
  threads: CommentThread[];
}

export function CommentsPanel({ vipId, threads }: CommentsPanelProps) {
  const { dispatch } = useApp();
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const handleReply = (threadId: string) => {
    const text = replyTexts[threadId];
    if (!text?.trim()) return;

    dispatch({
      type: "ADD_REPLY",
      payload: { vipId, threadId, text: text.trim() },
    });
    setReplyTexts((prev) => ({ ...prev, [threadId]: "" }));
  };

  if (threads.length === 0) {
    return (
      <div className="w-full bg-neutral-000 border border-neutral-300 rounded-popup p-4 shadow-tight max-h-[calc(100vh-160px)] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={18} className="text-brand-500" />
          <h6 className="text-sm font-semibold font-[family-name:var(--font-heading)] text-neutral-950">
            Comments
          </h6>
        </div>
        <p className="text-sm text-neutral-600 text-center py-8">
          No comments yet. Share a document to start the conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-000 border border-neutral-300 rounded-popup p-4 shadow-tight max-h-[calc(100vh-160px)] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={18} className="text-brand-500" />
        <h6 className="text-sm font-semibold font-[family-name:var(--font-heading)] text-neutral-950">
          Comments
        </h6>
      </div>

      <div className="flex flex-col gap-5">
        {threads.map((thread, ti) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ti * 0.1 }}
          >
            {/* Document context */}
            <a
              href={`/viewer/${thread.documentId}?vipId=${vipId}`}
              className="text-xs text-neutral-600 mb-1 truncate hover:text-brand-500 transition-colors flex items-center gap-1"
            >
              {thread.documentTitle}
              <ExternalLink size={10} className="flex-shrink-0 opacity-50" />
            </a>

            {/* Quote */}
            <div className="border-l-[3px] border-brand-400 pl-3 mb-3 bg-brand-100 rounded-r-cta py-2 pr-2">
              <p className="text-xs text-neutral-800 italic leading-relaxed">
                &ldquo;{thread.quoteText}&rdquo;
              </p>
            </div>

            {/* Comments */}
            <div className="flex flex-col gap-2.5">
              {thread.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <Avatar
                    initials={comment.author.initials}
                    color={comment.author.color}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-neutral-900">
                        {comment.author.name}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(comment.timestamp).toLocaleTimeString(
                          "en-US",
                          { hour: "numeric", minute: "2-digit" }
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-800 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply input */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Reply..."
                value={replyTexts[thread.id] || ""}
                onChange={(e) =>
                  setReplyTexts((prev) => ({
                    ...prev,
                    [thread.id]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleReply(thread.id);
                }}
                className="flex-1 h-7 px-2 text-xs bg-neutral-100 border border-neutral-300 rounded-cta placeholder-neutral-500 outline-none focus:border-brand-300"
              />
              <Button
                variant="primary"
                size="xsm"
                onClick={() => handleReply(thread.id)}
                className="px-1.5"
              >
                <Send size={12} />
              </Button>
            </div>

            {/* Separator */}
            {ti < threads.length - 1 && (
              <div className="border-t border-neutral-200 mt-4" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
