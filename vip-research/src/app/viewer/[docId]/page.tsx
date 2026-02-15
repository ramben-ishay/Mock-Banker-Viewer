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
  const vip = MOCK_VIPS.find((v) => v.id === vipId);

  // Generate personalized walkthrough steps
  const walkthroughSteps = useMemo(() => {
    return personalizeWalkthroughSteps(docId, vipId);
  }, [docId, vipId]);

  // Gather all comment threads for this document across all VIPs
  // (or scoped to a specific VIP if vipId is in the query)
  const viewerThreads: ViewerCommentThread[] = useMemo(() => {
    const threads: ViewerCommentThread[] = [];

    const vipIds = vipId ? [vipId] : Object.keys(state.commentThreads);

    for (const vid of vipIds) {
      const vipThreads = state.commentThreads[vid] || [];
      for (const thread of vipThreads) {
        if (thread.documentId === docId) {
          threads.push({
            id: thread.id,
            quoteText: thread.quoteText,
            pageReference: thread.pageReference,
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
  }, [state.commentThreads, docId, vipId]);

  const handleAddReply = (threadId: string, text: string) => {
    // Find which VIP owns this thread
    for (const [vid, threads] of Object.entries(state.commentThreads)) {
      const thread = threads.find((t) => t.id === threadId);
      if (thread && thread.documentId === docId) {
        dispatch({
          type: "ADD_REPLY",
          payload: { vipId: vid, threadId, text },
        });
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
        pdfUrl={doc.pdfPath}
        documentTitle={doc.title}
        userName="You"
        userInitials="YB"
        commentThreads={viewerThreads}
        onAddReply={handleAddReply}
        onBack={parityMode ? undefined : handleBack}
        walkthroughSteps={walkthroughSteps}
        parityMode={parityMode}
        vipName={vip?.name}
        vipInterests={vip?.interests}
      />
    </div>
  );
}
