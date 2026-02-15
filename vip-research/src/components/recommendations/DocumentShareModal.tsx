"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { useApp } from "@/lib/vip-context";
import { VIP, Document } from "@/lib/types";
import { Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  previousVersion: string;
  vips: VIP[];
}

export function DocumentShareModal({
  isOpen,
  onClose,
  document: doc,
  previousVersion,
  vips,
}: DocumentShareModalProps) {
  const { dispatch, addToast } = useApp();
  const [selectedVipIds, setSelectedVipIds] = useState<string[]>(
    vips.map((v) => v.id)
  );
  const [message, setMessage] = useState(
    `Hi,\n\nA new version of "${doc.title}" (${doc.version}) is now available, replacing the ${previousVersion} edition you previously reviewed.\n\nI wanted to make sure you have the latest data and analysis. Please take a look when you get a chance.\n\nBest regards`
  );
  const [sent, setSent] = useState(false);

  const toggleVip = (id: string) => {
    setSelectedVipIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    selectedVipIds.forEach((vipId) => {
      dispatch({
        type: "SHARE_DOCUMENT",
        payload: {
          vipId,
          recommendationId: `alert-${doc.id}`,
          documentId: doc.id,
          documentTitle: doc.title,
        },
      });
    });

    setSent(true);

    const names = vips
      .filter((v) => selectedVipIds.includes(v.id))
      .map((v) => v.name.split(" ")[0]);

    const label =
      names.length <= 2
        ? names.join(" and ")
        : `${names.slice(0, 2).join(", ")} and ${names.length - 2} more`;

    addToast(`Updated "${doc.title}" shared with ${label}`);

    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Updated Document"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-4">
        {/* Document info */}
        <div className="bg-neutral-200 rounded-cta p-3">
          <p className="text-xs text-neutral-600 mb-0.5">Document</p>
          <p className="text-sm font-semibold text-neutral-950">{doc.title}</p>
          <p className="text-xs text-neutral-600 mt-1">
            {previousVersion} &rarr; {doc.version}
          </p>
        </div>

        {/* VIP selection */}
        <div>
          <p className="text-sm font-semibold text-neutral-900 mb-2">
            Share with
          </p>
          <div className="flex flex-col gap-2">
            {vips.map((vip) => {
              const isSelected = selectedVipIds.includes(vip.id);
              return (
                <button
                  key={vip.id}
                  onClick={() => toggleVip(vip.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-cta border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "border-brand-500 bg-brand-100"
                      : "border-neutral-300 bg-neutral-000 hover:border-neutral-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-xsm border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-brand-500 bg-brand-500"
                        : "border-neutral-400 bg-neutral-000"
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <Avatar
                    initials={vip.avatar.initials}
                    color={vip.avatar.color}
                    size="sm"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-950">
                      {vip.name}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {vip.company}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <Textarea
          label="Personalized Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px]"
        />

        {/* Actions */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 py-3 text-status-green-700 font-semibold text-sm"
            >
              <Check size={18} />
              Sent successfully
            </motion.div>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-end gap-3 mt-1 pb-1"
            >
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<Send size={16} />}
                onClick={handleSend}
                disabled={selectedVipIds.length === 0}
              >
                Share with {selectedVipIds.length}{" "}
                {selectedVipIds.length === 1 ? "VIP" : "VIPs"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
