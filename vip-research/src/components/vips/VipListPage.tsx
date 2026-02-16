"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/lib/vip-context";
import { VipCard } from "@/components/vips/VipCard";
import { Button } from "@/components/ui/Button";
import { Search, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VipListPageProps {
  onAddVip: () => void;
}

export function VipListPage({ onAddVip }: VipListPageProps) {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVips = useMemo(() => {
    return state.vips.filter((vip) => {
      const matchesSearch =
        searchQuery === "" ||
        vip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vip.interests.some((i) =>
          i.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        vip.company.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [state.vips, searchQuery]);

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[32px] font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
            My VIPs
          </h2>
          <p className="text-base text-neutral-600 mt-1 font-medium">
            Track research engagement across {state.vips.length} VIP relationships
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={<UserPlus size={20} />}
          onClick={onAddVip}
          className="shadow-lg shadow-brand-500/20"
        >
          Add VIP
        </Button>
      </div>

      {/* Search and Filters */}
      {state.vips.length > 0 && (
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md group">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Search by name, firm, or investment focus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white border border-neutral-300 rounded-cta text-[15px] text-neutral-950 placeholder-neutral-500 outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100/50 transition-all shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Grid */}
      {filteredVips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredVips.map((vip, index) => (
              <VipCard key={vip.id} vip={vip} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredVips.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-neutral-100 rounded-lg border-2 border-dashed border-neutral-300"
        >
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
            <UserPlus size={36} className="text-brand-500" />
          </div>
          <p className="text-lg font-bold text-neutral-950">
            {state.vips.length === 0 ? "No VIPs" : "No VIPs found"}
          </p>
          <p className="text-neutral-600 mt-1">
            {state.vips.length === 0
              ? "No VIP relationships added yet. Connect your CRM to import."
              : "Try adjusting your search criteria."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
