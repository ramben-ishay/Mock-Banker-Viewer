"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Users, Eye, BookOpen, Send, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, Tag } from "@/components/ui/Badge";
import { DOCUMENTS, ENGAGEMENT_TIMELINES, RECOMMENDATIONS, VIPS } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DocumentAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const doc = DOCUMENTS.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="text-center py-16 text-neutral-600 bg-neutral-200 rounded-popup">
        <p>Document not found.</p>
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 transition-colors mt-4"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
    );
  }

  // Gather all VIP engagement for this document
  const vipEngagement: {
    vipId: string;
    vipName: string;
    avatar: { initials: string; color: string };
    company: string;
    actionType: string;
    completionPercent: number;
    date: string;
  }[] = [];

  for (const [vipId, entries] of Object.entries(ENGAGEMENT_TIMELINES)) {
    for (const entry of entries) {
      if (entry.documentId === id) {
        const vip = VIPS.find((v) => v.id === vipId);
        if (vip) {
          vipEngagement.push({
            vipId,
            vipName: vip.name,
            avatar: vip.avatar,
            company: vip.company,
            actionType: entry.actionType,
            completionPercent: entry.completionPercent,
            date: entry.date,
          });
        }
      }
    }
  }

  // Gather VIPs who have been recommended this document but have not engaged
  const recommendedVips: {
    vipId: string;
    vipName: string;
    avatar: { initials: string; color: string };
    company: string;
    relevanceScore: number;
    shared: boolean;
  }[] = [];

  for (const [vipId, recs] of Object.entries(RECOMMENDATIONS)) {
    for (const rec of recs) {
      if (rec.documentId === id && !rec.dismissed) {
        const vip = VIPS.find((v) => v.id === vipId);
        if (vip) {
          recommendedVips.push({
            vipId,
            vipName: vip.name,
            avatar: vip.avatar,
            company: vip.company,
            relevanceScore: rec.relevanceScore,
            shared: rec.shared,
          });
        }
      }
    }
  }

  const readCount = vipEngagement.filter((e) => e.actionType === "read").length;
  const openedCount = vipEngagement.filter((e) => e.actionType === "opened").length;
  const notOpenedCount = vipEngagement.filter((e) => e.actionType === "not_opened").length;
  const sharedCount = vipEngagement.filter((e) => e.actionType === "shared").length;
  const avgCompletion =
    vipEngagement.length > 0
      ? Math.round(
          vipEngagement.reduce((sum, e) => sum + e.completionPercent, 0) /
            vipEngagement.length
        )
      : 0;

  const actionLabel = (actionType: string) => {
    switch (actionType) {
      case "read":
        return { label: "Read", variant: "green" as const };
      case "opened":
        return { label: "Opened", variant: "orange" as const };
      case "not_opened":
        return { label: "Not Opened", variant: "red" as const };
      case "shared":
        return { label: "Shared", variant: "blue" as const };
      default:
        return { label: actionType, variant: "blue" as const };
    }
  };

  return (
    <div>
      {/* Back Nav */}
      <Link
        href="/documents"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Documents
      </Link>

      {/* Document Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-000 border border-neutral-300 rounded-popup p-6 mb-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-cta bg-brand-100 flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-brand-500" />
            </div>
            <div>
              <h5 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 mb-1">
                {doc.title}
              </h5>
              <p className="text-sm text-neutral-600 mb-3">
                Published {formatDate(doc.date)}
                {doc.version && ` · ${doc.version}`}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {doc.topics.map((topic) => (
                  <Tag key={topic}>{topic}</Tag>
                ))}
              </div>
            </div>
          </div>
          <a href={`/viewer/${doc.id}`}>
            <Button variant="primary" size="md" icon={<ExternalLink size={16} />}>
              Open in Factify
            </Button>
          </a>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Recipients", value: vipEngagement.length, icon: Users, color: "text-brand-500", bg: "bg-brand-100" },
          { label: "Read", value: readCount, icon: BookOpen, color: "text-status-green-700", bg: "bg-status-green-100" },
          { label: "Opened", value: openedCount, icon: Eye, color: "text-status-orange-700", bg: "bg-status-orange-100" },
          { label: "Not Opened", value: notOpenedCount, icon: FileText, color: "text-status-red-700", bg: "bg-status-red-100" },
          { label: "Avg Completion", value: `${avgCompletion}%`, icon: BarChart3, color: "text-brand-500", bg: "bg-brand-100" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-neutral-000 border border-neutral-300 rounded-popup p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-cta ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.color} />
              </div>
              <span className="text-xs text-neutral-600">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold font-[family-name:var(--font-heading)] text-neutral-950">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* VIP Engagement Table */}
      {vipEngagement.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-neutral-000 border border-neutral-300 rounded-popup p-5 mb-6"
        >
          <h6 className="text-lg font-bold font-[family-name:var(--font-heading)] text-neutral-950 mb-4">
            VIP Engagement
          </h6>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-300">
                  <th className="text-left py-3 px-2 font-semibold text-neutral-700">VIP</th>
                  <th className="text-left py-3 px-2 font-semibold text-neutral-700">Company</th>
                  <th className="text-center py-3 px-2 font-semibold text-neutral-700">Status</th>
                  <th className="text-center py-3 px-2 font-semibold text-neutral-700">Completion</th>
                  <th className="text-left py-3 px-2 font-semibold text-neutral-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {vipEngagement.map((entry) => {
                  const config = actionLabel(entry.actionType);
                  return (
                    <tr key={`${entry.vipId}-${entry.date}`} className="border-b border-neutral-200 last:border-0">
                      <td className="py-3 px-2">
                        <Link href={`/vips/${entry.vipId}`} className="flex items-center gap-2 hover:text-brand-500 transition-colors">
                          <Avatar initials={entry.avatar.initials} color={entry.avatar.color} size="sm" />
                          <span className="font-medium text-neutral-950">{entry.vipName}</span>
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-neutral-600">{entry.company}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={config.variant} size="sm">{config.label}</Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${entry.completionPercent}%`,
                                backgroundColor:
                                  entry.completionPercent >= 70
                                    ? "var(--color-status-green-500)"
                                    : entry.completionPercent >= 30
                                    ? "var(--color-status-orange-500)"
                                    : "var(--color-status-red-500)",
                              }}
                            />
                          </div>
                          <span className="text-xs text-neutral-700 w-8 text-right">
                            {entry.completionPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-neutral-600">{formatDate(entry.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Pending Recommendations */}
      {recommendedVips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-neutral-000 border border-neutral-300 rounded-popup p-5"
        >
          <h6 className="text-lg font-bold font-[family-name:var(--font-heading)] text-neutral-950 mb-4">
            Recommended To (Not Yet Shared)
          </h6>
          <div className="flex flex-col gap-3">
            {recommendedVips.map((rec) => (
              <div key={rec.vipId} className="flex items-center justify-between p-3 bg-neutral-100 rounded-cta">
                <Link href={`/vips/${rec.vipId}`} className="flex items-center gap-3 hover:text-brand-500 transition-colors">
                  <Avatar initials={rec.avatar.initials} color={rec.avatar.color} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-neutral-950">{rec.vipName}</p>
                    <p className="text-xs text-neutral-600">{rec.company}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={rec.relevanceScore > 70 ? "green" : rec.relevanceScore >= 40 ? "orange" : "red"}
                    size="sm"
                  >
                    {rec.relevanceScore}% match
                  </Badge>
                  {rec.shared && (
                    <Badge variant="green" size="sm">
                      <Send size={12} className="mr-1" /> Shared
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {vipEngagement.length === 0 && recommendedVips.length === 0 && (
        <div className="text-center py-16 text-neutral-600 bg-neutral-200 rounded-popup">
          <p>No engagement data yet for this document.</p>
        </div>
      )}
    </div>
  );
}
