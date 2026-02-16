import React from "react";
import Link from "next/link";
import { ExternalLink, Send, Wand2 } from "lucide-react";
import type { VIP, Document } from "@/lib/types";
import type { AiShareAction, DocumentMetrics } from "@/lib/document-metrics";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function matchVariant(score: number) {
  if (score >= 85) return "green" as const;
  if (score >= 70) return "orange" as const;
  return "neutral" as const;
}

export function AiActionQueue(props: {
  actions: AiShareAction[];
  vipById: Record<string, VIP>;
  docById: Record<string, Document>;
  metricsByDocId: Record<string, DocumentMetrics>;
}) {
  const { actions, vipById, docById, metricsByDocId } = props;

  return (
    <div className="bg-neutral-000 border border-neutral-300 rounded-popup p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wand2 size={16} className="text-neutral-700" />
          <h6 className="text-sm font-semibold text-neutral-950">AI Action Queue</h6>
        </div>
        <Badge variant="neutral" size="sm">
          {actions.length}
        </Badge>
      </div>

      {actions.length === 0 ? (
        <p className="text-xs text-neutral-600">No share-next actions right now.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {actions.map((a) => {
            const vip = vipById[a.vipId];
            const doc = docById[a.docId];
            const metrics = metricsByDocId[a.docId];
            if (!vip || !doc || !metrics) return null;

            return (
              <div
                key={`${a.vipId}-${a.docId}`}
                className={cn("p-3 rounded-cta bg-neutral-100 border border-neutral-200")}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar initials={vip.avatar.initials} color={vip.avatar.color} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-950 truncate">
                        Share next: {vip.name.split(" ")[0]}
                      </p>
                      <p className="text-[11px] text-neutral-600 truncate">{vip.company}</p>
                    </div>
                  </div>

                  <Badge variant={matchVariant(a.relevanceScore)} size="sm">
                    {a.relevanceScore}% match
                  </Badge>
                </div>

                <p className="text-xs font-semibold text-neutral-950 leading-snug mb-1">
                  {doc.title}
                </p>
                <p className="text-[11px] text-neutral-600 leading-snug overflow-hidden max-h-10">
                  {a.explanation}
                </p>

                <div className="flex items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" size="sm">
                      {metrics.performanceScore} AI
                    </Badge>
                    <Badge variant="blue" size="sm">
                      {metrics.reachCount} VIPs
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/viewer/${doc.id}?vipId=${vip.id}`}>
                      <Button variant="primary" size="xsm" icon={<ExternalLink size={12} />}>
                        Open
                      </Button>
                    </Link>
                    <Link href={`/vips/${vip.id}`}>
                      <Button variant="secondary" size="xsm" icon={<Send size={12} />}>
                        VIP
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

