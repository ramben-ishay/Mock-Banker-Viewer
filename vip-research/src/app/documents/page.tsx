"use client";

import React, { useState } from "react";
import { DOCUMENTS, DOCUMENT_ALERTS, MOCK_VIPS } from "@/lib/mock-data";
import { Tag } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { ExternalLink, Search, FileText, AlertCircle, Send, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DocumentShareModal } from "@/components/recommendations/DocumentShareModal";
import { VIP, Document } from "@/lib/types";

interface ShareAlertState {
  document: Document;
  previousVersion: string;
  vips: VIP[];
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shareAlert, setShareAlert] = useState<ShareAlertState | null>(null);

  const filteredDocs = DOCUMENTS.filter((doc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-neutral-950">
            Research Documents
          </h5>
          <p className="text-sm text-neutral-600 mt-1">
            {DOCUMENTS.length} documents in your research library
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
        />
        <input
          type="text"
          placeholder="Search by title or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-neutral-000 border border-neutral-300 rounded-cta text-sm text-neutral-950 placeholder-neutral-500 outline-none focus:border-brand-300 transition-colors"
        />
      </div>

      {/* Document Version Alerts */}
      {DOCUMENT_ALERTS.map((alert) => {
        const alertDoc = DOCUMENTS.find((d) => d.id === alert.documentId);
        const affectedVips = alert.affectedVipIds
          .map((vid) => MOCK_VIPS.find((v) => v.id === vid))
          .filter(Boolean);
        if (!alertDoc) return null;
        return (
          <motion.div
            key={alert.documentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-status-orange-100 border border-status-orange-500 rounded-popup p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-status-orange-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h6 className="text-sm font-semibold text-neutral-950">
                    New Version Available: {alertDoc.title}
                  </h6>
                </div>
                <p className="text-sm text-neutral-800 mb-3">{alert.message}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-neutral-600">Previously read by:</span>
                  <div className="flex items-center gap-2">
                    {affectedVips.map((vip) => vip && (
                      <Link key={vip.id} href={`/vips/${vip.id}`} className="flex items-center gap-1.5 hover:text-brand-500 transition-colors">
                        <Avatar initials={vip.avatar.initials} color={vip.avatar.color} size="sm" />
                        <span className="text-xs font-medium text-neutral-900">{vip.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send size={14} />}
                  onClick={() => {
                    if (alertDoc) {
                      setShareAlert({
                        document: alertDoc,
                        previousVersion: alert.previousVersion,
                        vips: affectedVips.filter((v): v is VIP => v !== undefined),
                      });
                    }
                  }}
                >
                  Share updated version with them
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDocs.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-neutral-000 border border-neutral-300 rounded-popup p-5 hover:shadow-fluffy hover:border-neutral-400 transition-all duration-200"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-cta bg-brand-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-neutral-950 font-[family-name:var(--font-heading)] leading-tight mb-1">
                  {doc.title}
                </div>
                <p className="text-xs text-neutral-600">
                  Published {formatDate(doc.date)}
                  {doc.version && ` · ${doc.version}`}
                </p>
              </div>
            </div>

            {/* Topic Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {doc.topics.map((topic) => (
                <Tag key={topic}>{topic}</Tag>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link href={`/viewer/${doc.id}`} className="flex-1">
                <Button variant="primary" size="sm" icon={<ExternalLink size={14} />} className="w-full">
                  Open in Factify
                </Button>
              </Link>
              <Link href={`/document/${doc.id}`}>
                <Button variant="secondary" size="sm" icon={<BarChart3 size={14} />}>
                  Analytics
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-16 text-neutral-600">
          <p>No documents match your search.</p>
        </div>
      )}

      {/* Share Updated Document Modal */}
      {shareAlert && (
        <DocumentShareModal
          isOpen={!!shareAlert}
          onClose={() => setShareAlert(null)}
          document={shareAlert.document}
          previousVersion={shareAlert.previousVersion}
          vips={shareAlert.vips}
        />
      )}
    </div>
  );
}
