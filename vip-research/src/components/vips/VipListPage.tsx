"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/vip-context";
import { VipCard } from "@/components/vips/VipCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Search, UserPlus, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const SALESFORCE_LOGO = (
  <svg width="20" height="14" viewBox="0 0 24 17" fill="none">
    <path
      d="M10 1.5C11.1 0.6 12.5 0 14 0c2.5 0 4.6 1.5 5.4 3.6C20.1 3.2 21 3 22 3c3 0 5 2.2 5 5s-2 5-5 5h-1c-0.8 2.3-3 4-5.5 4-1.5 0-2.8-0.5-3.8-1.4C10.7 16.5 9.4 17 8 17c-2.2 0-4.1-1.3-5-3.2C1.3 13.9 0 12.6 0 11c0-1.8 1.5-3.3 3.3-3.3 0.2 0 0.5 0 0.7 0.1C4.3 5 6.8 3 10 3c0-0.5 0-1 0-1.5z"
      fill="#00A1E0"
    />
  </svg>
);

const HUBSPOT_LOGO = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#FF7A59" />
    <path
      d="M15 8V6.5C15.8 6.2 16.5 5.5 16.5 4.5C16.5 3.1 15.4 2 14 2s-2.5 1.1-2.5 2.5c0 1 0.7 1.7 1.5 2V8c-1.1 0.3-2 1-2.6 1.9l-3.2-1.9c0.1-0.3 0.1-0.6 0.1-0.9C7.3 5.9 6.4 5 5.2 5S3 5.9 3 7.1c0 1.2 1 2.2 2.2 2.2 0.3 0 0.6-0.1 0.9-0.2l3.1 1.8C9.1 11.3 9 11.6 9 12c0 0.4 0.1 0.7 0.2 1.1l-3.1 1.8c-0.3-0.1-0.6-0.2-0.9-0.2C4 14.8 3 15.7 3 16.9S4 19 5.2 19c1.2 0 2.2-1 2.2-2.2 0-0.3-0.1-0.6-0.1-0.9l3.2-1.9c0.6 0.9 1.5 1.6 2.6 1.9v2c-0.8 0.3-1.5 1-1.5 2 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-1-0.7-1.7-1.5-2v-2c1.8-0.5 3-2.2 3-4.1S16.8 8.5 15 8z"
      fill="white"
    />
  </svg>
);

interface VipListPageProps {
  onAddVip: () => void;
}

export function VipListPage({ onAddVip }: VipListPageProps) {
  const { state, dispatch } = useApp();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingCrm, setConnectingCrm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleConnect = (crm: string) => {
    setIsConnecting(true);
    setConnectingCrm(crm);
    setTimeout(() => {
      dispatch({ type: "CONNECT_CRM" });
      setIsConnecting(false);
      setConnectingCrm(null);
    }, 2000);
  };

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

  // Empty State
  if (!state.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AnimatePresence mode="wait">
          {isConnecting ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Spinner size={48} />
              <p className="text-neutral-600">
                Connecting to {connectingCrm}...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 max-w-2xl text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
                <UserPlus size={36} className="text-brand-500" />
              </div>
              <div>
                <h5 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 mb-2">
                  My VIPs
                </h5>
                <p className="text-neutral-600">
                  Connect your CRM to import your VIP clients and start sharing
                  personalized research.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={SALESFORCE_LOGO}
                  onClick={() => handleConnect("Salesforce")}
                >
                  Connect to Salesforce
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={HUBSPOT_LOGO}
                  onClick={() => handleConnect("HubSpot")}
                >
                  Connect to HubSpot
                </Button>
              </div>
              <Button
                variant="tertiary"
                size="md"
                icon={<UserPlus size={18} />}
                onClick={onAddVip}
              >
                + Add VIP Manually
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Populated State
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[32px] font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
            My VIPs
          </h2>
          <p className="text-base text-neutral-600 mt-1 font-medium">
            Manage and track engagement for {state.vips.length} VIP clients
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
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md group">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Search by name, company, or interest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white border border-neutral-300 rounded-cta text-[15px] text-neutral-950 placeholder-neutral-500 outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredVips.map((vip, index) => (
            <VipCard key={vip.id} vip={vip} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {filteredVips.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-neutral-100 rounded-lg border-2 border-dashed border-neutral-300"
        >
          <Search size={48} className="mx-auto text-neutral-300 mb-4" />
          <p className="text-lg font-bold text-neutral-950">No VIPs found</p>
          <p className="text-neutral-600 mt-1">Try adjusting your search criteria</p>
        </motion.div>
      )}

      {/* CRM Connected indicator */}
      <div className="mt-12 flex items-center justify-center py-4 px-6 bg-neutral-100 rounded-full w-fit mx-auto border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-status-green-500 shadow-[0_0_8px_rgba(90,212,90,0.6)]" />
          <Link2 size={14} className="text-neutral-400" />
          <span>CRM Synchronized</span>
        </div>
      </div>
    </div>
  );
}
