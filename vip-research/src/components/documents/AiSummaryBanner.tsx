import React from "react";
import { Sparkles } from "lucide-react";
import { TypewriterText } from "@/components/ui/TypewriterText";

export function AiSummaryBanner(props: { text: string; subtitle?: string }) {
  const { text, subtitle } = props;

  return (
    <div className="bg-neutral-000 border border-neutral-300 rounded-popup p-4 overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-cta bg-brand-100 flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-brand-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-neutral-600">
              Coverage Intelligence
            </span>
            <span className="text-[10px] text-neutral-500">
              Automated coverage insights
            </span>
          </div>
          <div className="text-sm text-neutral-950 leading-snug">
            <TypewriterText text={text} speed={10} startDelay={120} showCursor={false} />
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-600 mt-2">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

