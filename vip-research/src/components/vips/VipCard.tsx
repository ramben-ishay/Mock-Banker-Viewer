"use client";

import React from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Badge";
import { VIP } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import { FileText, Clock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface VipCardProps {
  vip: VIP;
  index: number;
}

export function VipCard({ vip, index }: VipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      layout
      className="h-full"
    >
      <Link href={`/vips/${vip.id}`} className="h-full block">
        <div className="bg-white border border-neutral-300 rounded-lg p-6 shadow-tight hover:shadow-fluffy hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col relative overflow-hidden">
          {/* Subtle background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Header */}
          <div className="flex items-start gap-4 mb-4 relative z-10">
            <Avatar
              initials={vip.avatar.initials}
              color={vip.avatar.color}
              size="md"
              className="ring-2 ring-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-neutral-950 font-[family-name:var(--font-heading)] group-hover:text-brand-500 transition-colors leading-tight tracking-tight">
                {vip.name}
              </div>
              <p className="text-[13px] font-medium text-neutral-600 truncate mt-0.5">{vip.role} <span className="text-neutral-300 mx-1">@</span> {vip.company}</p>
            </div>
          </div>

          {/* Interest Tags */}
          <div className="flex flex-wrap gap-2 mb-6 mt-2 relative z-10">
            {vip.interests.slice(0, 3).map((interest) => (
              <Tag key={interest} className="bg-neutral-100 text-neutral-700 font-medium px-2.5 py-1 text-[11px] uppercase tracking-wider">{interest}</Tag>
            ))}
            {vip.interests.length > 3 && (
              <Tag className="bg-neutral-100 text-neutral-500 font-bold px-2 py-1 text-[11px] tracking-wider">+{vip.interests.length - 3}</Tag>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-200 mt-auto relative z-10">
            <div className="flex flex-col items-center gap-1">
              <div className="p-1.5 rounded-md bg-neutral-100 text-neutral-500 group-hover:text-brand-500 transition-colors">
                <FileText size={14} />
              </div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter text-center">{vip.docsShared} Shared</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-neutral-100">
              <div className="p-1.5 rounded-md bg-neutral-100 text-neutral-500 group-hover:text-status-green-700 transition-colors">
                <BarChart3 size={14} />
              </div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter text-center">{vip.avgCompletion}% Read</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="p-1.5 rounded-md bg-neutral-100 text-neutral-500 group-hover:text-neutral-900 transition-colors">
                <Clock size={14} />
              </div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter text-center">Active {vip.lastActive}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
