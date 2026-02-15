"use client";

import React from "react";
import { useApp } from "@/lib/vip-context";
import { DOCUMENTS, AI_INSIGHTS } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/Avatar";
import { Users, FileText, BarChart3, TrendingUp, Clock, Award, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const { state } = useApp();
  const vips = state.vips;

  const totalVips = vips.length;
  const totalDocs = DOCUMENTS.length;
  const totalShared = vips.reduce((sum, v) => sum + v.docsShared, 0);
  const avgCompletion =
    vips.length > 0
      ? Math.round(vips.reduce((sum, v) => sum + v.avgCompletion, 0) / vips.length)
      : 0;

  const sortedByCompletion = [...vips].sort(
    (a, b) => b.avgCompletion - a.avgCompletion
  );
  const topVip = sortedByCompletion[0];

  // VIPs with declining engagement (negative AI insights)
  const attentionNeeded = vips.filter(
    (vip) => AI_INSIGHTS[vip.id]?.type === "negative"
  );

  const stats = [
    {
      label: "Total VIPs",
      value: totalVips,
      icon: Users,
      color: "text-brand-500",
      bg: "bg-brand-100",
    },
    {
      label: "Research Library",
      value: totalDocs,
      icon: FileText,
      color: "text-status-green-700",
      bg: "bg-status-green-100",
    },
    {
      label: "Total Shared",
      value: totalShared,
      icon: TrendingUp,
      color: "text-status-orange-700",
      bg: "bg-status-orange-100",
    },
    {
      label: "Avg Completion",
      value: `${avgCompletion}%`,
      icon: BarChart3,
      color: "text-brand-500",
      bg: "bg-brand-100",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-[32px] font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
          Dashboard
        </h2>
        <p className="text-base text-neutral-600 mt-1.5 font-medium">
          Aggregate stats across all your VIP clients
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white border border-neutral-300 rounded-lg p-6 shadow-tight hover:shadow-fluffy transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-cta ${stat.bg} flex items-center justify-center shadow-sm`}
              >
                <stat.icon size={22} className={stat.color} />
              </div>
              <span className="text-sm font-bold text-neutral-700 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-4xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Attention Needed Section */}
      {attentionNeeded.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-status-red-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-status-red-500" />
            </div>
            <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
              Attention Needed
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {attentionNeeded.map((vip, index) => {
              const insight = AI_INSIGHTS[vip.id];
              return (
                <motion.div
                  key={vip.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link href={`/vips/${vip.id}`}>
                    <div className="bg-white border border-neutral-300 border-l-[6px] border-l-status-red-500 rounded-lg p-5 shadow-tight hover:shadow-fluffy hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar
                          initials={vip.avatar.initials}
                          color={vip.avatar.color}
                          size="md"
                        />
                        <div>
                          <p className="text-[15px] font-bold text-neutral-950">{vip.name}</p>
                          <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide">{vip.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3 px-2 py-1 bg-status-red-100 rounded-md w-fit">
                        <AlertTriangle size={14} className="text-status-red-700" />
                        <p className="text-[11px] font-bold text-status-red-700 uppercase tracking-wider">{insight.title}</p>
                      </div>
                      <p className="text-sm text-neutral-700 leading-relaxed italic">"{insight.body}"</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Most Active VIP */}
      {topVip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white border border-neutral-300 rounded-lg p-8 mb-12 shadow-tight relative overflow-hidden group"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-status-orange-100/50 blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-status-orange-200/50 transition-colors duration-500" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-status-orange-100 flex items-center justify-center">
              <Award size={18} className="text-status-orange-500" />
            </div>
            <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
              Most Engaged VIP
            </h3>
          </div>
          
          <Link href={`/vips/${topVip.id}`} className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <Avatar
              initials={topVip.avatar.initials}
              color={topVip.avatar.color}
              size="lg"
              className="w-20 h-20 text-xl ring-4 ring-status-orange-100"
            />
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold text-neutral-950 tracking-tight">{topVip.name}</p>
              <p className="text-base font-medium text-neutral-600 mt-1">
                {topVip.role} <span className="text-neutral-300 mx-2">|</span> {topVip.company}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                <div className="bg-neutral-100 px-4 py-2 rounded-lg">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Completion</p>
                  <p className="text-lg font-bold text-status-green-700">{topVip.avgCompletion}%</p>
                </div>
                <div className="bg-neutral-100 px-4 py-2 rounded-lg">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Docs Shared</p>
                  <p className="text-lg font-bold text-brand-500">{topVip.docsShared}</p>
                </div>
                <div className="bg-neutral-100 px-4 py-2 rounded-lg">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Last Active</p>
                  <p className="text-lg font-bold text-neutral-900">{topVip.lastActive}</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Per VIP Completion Table */}
      {vips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="bg-white border border-neutral-300 rounded-lg shadow-tight overflow-hidden"
        >
          <div className="p-6 border-b border-neutral-200 bg-neutral-100/30">
            <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
              VIP Engagement Overview
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-neutral-100/50">
                  <th className="text-left py-4 px-6 font-bold text-neutral-600 uppercase tracking-widest text-[11px]">VIP</th>
                  <th className="text-left py-4 px-6 font-bold text-neutral-600 uppercase tracking-widest text-[11px]">Company</th>
                  <th className="text-center py-4 px-6 font-bold text-neutral-600 uppercase tracking-widest text-[11px]">Docs Shared</th>
                  <th className="text-center py-4 px-6 font-bold text-neutral-600 uppercase tracking-widest text-[11px]">Avg Completion</th>
                  <th className="text-left py-4 px-6 font-bold text-neutral-600 uppercase tracking-widest text-[11px]">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {sortedByCompletion.map((vip) => {
                  const isDeclined = AI_INSIGHTS[vip.id]?.type === "negative";
                  return (
                    <tr
                      key={vip.id}
                      className={`border-b border-neutral-200 last:border-0 hover:bg-neutral-100 transition-colors ${
                        isDeclined ? "bg-status-red-100/20" : ""
                      }`}
                    >
                      <td className="py-4 px-6">
                        <Link href={`/vips/${vip.id}`} className="flex items-center gap-3 group">
                          <Avatar
                            initials={vip.avatar.initials}
                            color={vip.avatar.color}
                            size="sm"
                          />
                          <span className="font-bold text-neutral-950 group-hover:text-brand-500 transition-colors">{vip.name}</span>
                          {isDeclined && (
                            <div className="w-2 h-2 rounded-full bg-status-red-500 animate-pulse" />
                          )}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-neutral-600 font-medium">{vip.company}</td>
                      <td className="py-4 px-6 text-center text-neutral-950 font-bold">{vip.docsShared}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${vip.avgCompletion}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{
                                backgroundColor:
                                  vip.avgCompletion >= 70
                                    ? "var(--color-status-green-500)"
                                    : vip.avgCompletion >= 40
                                    ? "var(--color-status-orange-500)"
                                    : "var(--color-status-red-500)",
                              }}
                            />
                          </div>
                          <span className="text-[13px] font-bold text-neutral-800 w-10 text-right">
                            {vip.avgCompletion}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-neutral-600">
                        <div className="flex items-center gap-2 font-medium">
                          <Clock size={14} className="text-neutral-400" />
                          {vip.lastActive}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {vips.length === 0 && (
        <div className="text-center py-16 text-neutral-600">
          <p>Connect your CRM to see dashboard statistics.</p>
        </div>
      )}
    </div>
  );
}
