"use client";

import React, { useState, use } from "react";
import { useApp } from "@/lib/vip-context";
import { EngagementStats } from "@/components/engagement/EngagementStats";
import { AiInsightBanner } from "@/components/engagement/AiInsightBanner";
import { EngagementTimeline } from "@/components/engagement/EngagementTimeline";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { ShareModal } from "@/components/recommendations/ShareModal";
import { CommentsPanel } from "@/components/comments/CommentsPanel";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Badge";
import { AI_INSIGHTS, SUGGESTED_ACTIONS } from "@/lib/mock-data";
import { formatRelativeDate, formatDate } from "@/lib/utils";
import { ArrowLeft, Sparkles, MessageSquare, Building2, Briefcase, DollarSign, BookOpen, Phone, Mail, CalendarDays, Users, BarChart3 } from "lucide-react";
import { Recommendation } from "@/lib/types";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function VipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, dispatch, addToast } = useApp();
  const [shareModalRec, setShareModalRec] = useState<Recommendation | null>(null);
  const [showComments, setShowComments] = useState(false);

  const vip = state.vips.find((v) => v.id === id);
  const timeline = state.engagementTimelines[id] || [];
  const openedDocIds = new Set(timeline.map((t) => t.documentId));
  const recommendations = (state.recommendations[id] || []).filter(
    (r) => !r.dismissed && !openedDocIds.has(r.documentId)
  );
  const insight = AI_INSIGHTS[id];
  const suggestedActions = SUGGESTED_ACTIONS[id] || [];
  const commentThreads = state.commentThreads[id] || [];

  if (!vip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-neutral-600">VIP not found. Connect your CRM first.</p>
        <Link href="/vips">
          <Button variant="primary">Go to My VIPs</Button>
        </Link>
      </div>
    );
  }

  const handleDismiss = (recId: string) => {
    dispatch({
      type: "DISMISS_RECOMMENDATION",
      payload: { vipId: id, recommendationId: recId },
    });
  };

  const commTypeIcon = (type: "call" | "email" | "meeting") => {
    switch (type) {
      case "call":
        return <Phone size={14} className="text-brand-500" />;
      case "email":
        return <Mail size={14} className="text-brand-500" />;
      case "meeting":
        return <CalendarDays size={14} className="text-brand-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Back Nav */}
      <Link
        href="/vips"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to My VIPs
      </Link>

      {/* VIP Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center gap-6 mb-10 pb-8 border-b border-neutral-300"
      >
        <div className="relative">
          <Avatar initials={vip.avatar.initials} color={vip.avatar.color} size="lg" className="w-24 h-24 text-2xl ring-4 ring-white shadow-lg" />
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-status-green-500 rounded-full border-4 border-white shadow-sm" title="Active" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
              {vip.name}
            </h2>
            <div className="px-2 py-0.5 bg-brand-100 text-brand-700 text-[10px] font-bold uppercase tracking-widest rounded-md border border-brand-200">
              VIP Client
            </div>
          </div>
          <p className="text-lg text-neutral-600 font-medium">{vip.role} <span className="text-neutral-300 mx-2">|</span> {vip.company}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {vip.interests.map((interest) => (
              <Tag key={interest} className="bg-neutral-100 text-neutral-700 font-bold px-3 py-1 text-[11px] uppercase tracking-wider border border-neutral-300/50">{interest}</Tag>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="lg"
            icon={<MessageSquare size={20} />}
            onClick={() => setShowComments(!showComments)}
            className="shadow-sm"
          >
            {showComments ? "Hide Comments" : "Comments"}
            {commentThreads.length > 0 && (
              <span className="ml-2 w-6 h-6 rounded-full bg-status-red-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                {commentThreads.length}
              </span>
            )}
          </Button>
          <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/20">
            Edit Profile
          </Button>
        </div>
      </motion.div>

      <div className="flex gap-6 items-start">
        {/* Main Content */}
        <div className="flex-1 min-w-0">

          {/* ============ CLIENT PROFILE ============ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                <Users size={18} className="text-neutral-700" />
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
                Client Profile
              </h3>
            </div>

            {/* Compact info row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-neutral-300 rounded-lg p-4 flex items-center gap-4 shadow-tight hover:shadow-fluffy transition-shadow duration-300">
                <div className="w-10 h-10 rounded-cta bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                  <Building2 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-0.5">Company</p>
                  <p className="text-[15px] font-bold text-neutral-950" title={vip.company}>{vip.company}</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-300 rounded-lg p-4 flex items-center gap-4 shadow-tight hover:shadow-fluffy transition-shadow duration-300">
                <div className="w-10 h-10 rounded-cta bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                  <Briefcase size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-0.5">Role</p>
                  <p className="text-[15px] font-bold text-neutral-950" title={vip.role}>{vip.role}</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-300 rounded-lg p-4 flex items-center gap-4 shadow-tight hover:shadow-fluffy transition-shadow duration-300">
                <div className="w-10 h-10 rounded-cta bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                  <DollarSign size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-0.5">AUM</p>
                  <p className="text-[15px] font-bold text-status-green-700">{vip.aum}</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-300 rounded-lg p-4 flex items-center gap-4 shadow-tight hover:shadow-fluffy transition-shadow duration-300">
                <div className="w-10 h-10 rounded-cta bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                  <CalendarDays size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-0.5">Last Meeting</p>
                  <p className="text-[15px] font-bold text-neutral-950">{formatDate(vip.lastMeeting)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reading Profile card */}
              <div className="bg-white border border-neutral-300 rounded-lg p-6 shadow-tight relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100/50 blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <BookOpen size={20} className="text-brand-500" />
                  <h4 className="text-base font-bold text-neutral-950">Reading Profile</h4>
                </div>
                <p className="text-[15px] text-neutral-700 leading-relaxed font-medium relative z-10 italic">
                  &quot;{vip.readingProfile}&quot;
                </p>
              </div>

              {/* Recent Communications */}
              {vip.pastCommunications.length > 0 && (
                <div className="bg-white border border-neutral-300 rounded-lg p-6 shadow-tight">
                  <h4 className="text-base font-bold text-neutral-950 mb-5 flex items-center gap-3">
                    <MessageSquare size={18} className="text-neutral-400" />
                    Recent Communications
                  </h4>
                  <div className="flex flex-col gap-4">
                    {vip.pastCommunications.map((comm, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-100 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                          {commTypeIcon(comm.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-brand-700 uppercase tracking-widest">{comm.type}</span>
                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{formatDate(comm.date)}</span>
                          </div>
                          <p className="text-sm text-neutral-800 leading-snug font-medium">{comm.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ============ ENGAGEMENT SECTION ============ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                <BarChart3 size={18} className="text-neutral-700" />
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
                Engagement Overview
              </h3>
            </div>

            <EngagementStats
              docsShared={vip.docsShared}
              avgCompletion={vip.avgCompletion}
              lastActive={formatRelativeDate(vip.lastActive)}
            />

            {/* AI Insight */}
            {insight && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6"
              >
                <AiInsightBanner insight={insight} />
              </motion.div>
            )}

            {/* Suggested Actions */}
            {suggestedActions.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-3">AI Suggested Next Steps</p>
                <div className="flex flex-wrap gap-3">
                  {suggestedActions.map((action) => (
                    <Button key={action} variant="secondary" size="md" className="bg-white border-neutral-300 font-bold text-[13px] hover:border-brand-300 hover:text-brand-600 shadow-sm">
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="mt-10">
                <h4 className="text-sm font-bold text-neutral-950 mb-4 tracking-tight">
                  Activity History
                </h4>
                <div className="bg-white border border-neutral-300 rounded-lg p-6 shadow-tight">
                  <EngagementTimeline entries={timeline} vipId={id} />
                </div>
              </div>
            )}
          </section>

          {/* ============ RECOMMENDATIONS SECTION ============ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <Sparkles size={18} className="text-brand-500" />
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
                Recommended Research
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              <AnimatePresence mode="popLayout">
                {recommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    vipId={id}
                    onShare={() => setShareModalRec(rec)}
                    onDismiss={() => handleDismiss(rec.id)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {recommendations.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-neutral-600 bg-neutral-100 rounded-lg border-2 border-dashed border-neutral-300"
              >
                <Sparkles size={32} className="mx-auto text-brand-300 mb-3" />
                <p className="text-lg font-bold text-neutral-950 tracking-tight">All caught up!</p>
                <p className="text-neutral-600 mt-1">No new research matches for {vip.name} at this time.</p>
              </motion.div>
            )}
          </section>
        </div>

        {/* Comments Panel (slide over) */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 340 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 overflow-hidden sticky top-10 self-start"
            >
              <CommentsPanel vipId={id} threads={commentThreads} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      {shareModalRec && (
        <ShareModal
          isOpen={!!shareModalRec}
          onClose={() => setShareModalRec(null)}
          recommendation={shareModalRec}
          vipName={vip.name}
          vipId={id}
        />
      )}
    </div>
  );
}
