"use client";

import React, { use, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/lib/vip-context";
import { DOCUMENTS, MOCK_VIPS, personalizeWalkthroughSteps } from "@/lib/mock-data";
import type { ViewerCommentThread } from "@/components/viewer/types";

const FactifyViewer = dynamic(
  () => import("@/components/viewer").then((m) => m.FactifyViewer),
  {
    ssr: false,
  }
);

export default function ViewerPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const vipId = searchParams.get("vipId");
  const parityMode = searchParams.get("parity") !== "0";

  const { state, dispatch } = useApp();

  const doc = DOCUMENTS.find((d) => d.id === docId);
  const vip =
    (vipId ? state.vips.find((v) => v.id === vipId) : undefined) ||
    (vipId ? MOCK_VIPS.find((v) => v.id === vipId) : undefined) ||
    state.vips.find((v) => v.name.toLowerCase().includes("alexandra"));

  // Generate personalized walkthrough steps
  const walkthroughSteps = useMemo(() => {
    return personalizeWalkthroughSteps(docId, vipId || vip?.id || null);
  }, [docId, vipId, vip?.id]);

  // Gather all comment threads for this document across all VIPs
  // (or scoped to a specific VIP if vipId is in the query)
  const viewerThreads: ViewerCommentThread[] = useMemo(() => {
    const threads: ViewerCommentThread[] = [];

    const vipIds = vipId ? [vipId] : (vip ? [vip.id] : Object.keys(state.commentThreads));

    for (const vid of vipIds) {
      const vipThreads = state.commentThreads[vid] || [];
      for (const thread of vipThreads) {
        if (thread.documentId === docId) {
          threads.push({
            id: thread.id,
            quoteText: thread.quoteText,
            pageReference: thread.pageReference,
            pageNumber: thread.pageNumber,
            highlightArea: thread.highlightArea,
            comments: thread.comments.map((c) => ({
              id: c.id,
              author: c.author,
              text: c.text,
              timestamp: c.timestamp,
            })),
          });
        }
      }
    }
    return threads;
  }, [state.commentThreads, docId, vipId, vip]);

  const handleAddReply = (threadId: string, text: string) => {
    // Find which VIP owns this thread
    for (const [vid, threads] of Object.entries(state.commentThreads)) {
      const thread = threads.find((t) => t.id === threadId);
      if (thread && thread.documentId === docId) {
        const isVipMode = true; // Always enable VIP/Tab mode in the viewer for demo
        if (isVipMode && (vip || vid === vipId)) {
          const activeVip = vip || state.vips.find(v => v.id === vid);
          dispatch({
            type: "ADD_THREAD_REPLY",
            payload: {
              vipId: vid,
              threadId,
              text,
              author: {
                name: activeVip?.name || "Alexandra Petrov",
                initials: activeVip?.avatar.initials || "AP",
                role: "vip",
                color: activeVip?.avatar.color || "#d04aff",
              },
            },
          });
        } else {
          dispatch({
            type: "ADD_REPLY",
            payload: { vipId: vid, threadId, text },
          });
        }
        break;
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!doc) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#70738a",
        }}
      >
        Document not found.
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <FactifyViewer
        docId={docId}
        vipMode={true}
        pdfUrl={doc.pdfPath}
        documentTitle={doc.title}
        userName={vip ? vip.name : "Alexandra Petrov"}
        userInitials={vip ? vip.avatar.initials : "AP"}
        commentThreads={viewerThreads}
        onAddReply={handleAddReply}
        onBack={parityMode ? undefined : handleBack}
        walkthroughSteps={walkthroughSteps}
        parityMode={parityMode}
        vipName={vip?.name || "Alexandra Petrov"}
        vipInterests={vip?.interests}
      />
    </div>
  );
}
