#!/usr/bin/env node
/**
 * Ten loop viewer parity runner.
 *
 * Required states every round:
 * 1. clean viewer
 * 2. Ask AI open
 * 3. Comments open with add comment flow visible
 *
 * Per round:
 * local capture
 * live Factify capture attempt
 * fallback to frozen baselines if live capture fails
 * strict judge call
 */

import { chromium } from "playwright";
import { mkdir, writeFile, readFile, access } from "fs/promises";
import { constants } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROJECT_ROOT = join(ROOT, "..");
const PARITY_RUNS = join(ROOT, "parity-runs");
const BASELINES_DIR = join(PROJECT_ROOT, "reference_screenshots");
const VIEWPORT = { width: 1440, height: 900 };

const BASELINE_FILES = {
  clean: "11_clean_document_view.png",
  aiOpen: "13_ai_chat_sidebar_open.png",
  commentsAdd: "15_comments_drawer_open.png",
};

const LOOP_FOCUS = {
  1: "shell layout gaps",
  2: "header toolbar rail geometry",
  3: "share profile title icon details",
  4: "ask ai header and welcome spacing",
  5: "ask ai summary and suggestions",
  6: "ask ai input and send button behavior",
  7: "comments empty state and add entry flow",
  8: "comments typing controls and spacing",
  9: "cross state consistency",
  10: "final polish and pass lock",
};

const JUDGE_CONTRACT = `You are a strict UI design parity judge.
Image one is local UI.
Image two is reference UI.

Ignore these intentional differences only:
1) Document Walkthrough card and highlight overlays.
2) PDF page content details.
3) Browser URL bar.

Return JSON only:
{
  "match": boolean,
  "scores": {
    "layout": number,
    "spacing": number,
    "typography": number,
    "colors": number,
    "controls": number
  },
  "differences": [
    {
      "area": string,
      "issue": string,
      "severity": "low" | "medium" | "high",
      "fixHint": string
    }
  ]
}

Rules:
1) Scores are integers from 0 to 100.
2) match can be true only if all scores are at least 98 and there is no high severity difference.
3) Keep differences concise and actionable.`;

function getArgValue(args, key) {
  const inline = args.find((a) => a.startsWith(`${key}=`));
  if (inline) return inline.split("=")[1];
  const idx = args.indexOf(key);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return undefined;
}

function hasFlag(args, key) {
  return args.includes(key);
}

async function requireFile(path, label) {
  try {
    await access(path, constants.F_OK);
  } catch {
    throw new Error(`${label} is missing at ${path}`);
  }
}

async function imageToBase64(path) {
  return readFile(path, "base64");
}

function normalizeJudgeResult(raw, viewName) {
  const scores = raw?.scores || {};
  const differences = Array.isArray(raw?.differences) ? raw.differences : [];
  return {
    match: raw?.match === true,
    scores: {
      layout: Number(scores.layout) || 0,
      spacing: Number(scores.spacing) || 0,
      typography: Number(scores.typography) || 0,
      colors: Number(scores.colors) || 0,
      controls: Number(scores.controls) || 0,
    },
    differences: differences.map((d) => ({
      area: String(d.area || viewName),
      issue: String(d.issue || "unspecified difference"),
      severity:
        d.severity === "high" || d.severity === "medium" || d.severity === "low"
          ? d.severity
          : "medium",
      fixHint: String(d.fixHint || "refine alignment and spacing"),
    })),
  };
}

async function callJudge(localPath, referencePath, viewName) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  const localBase64 = await imageToBase64(localPath);
  const referenceBase64 = await imageToBase64(referencePath);

  const prompt = `${JUDGE_CONTRACT}\n\nCurrent view: ${viewName}`;
  const body = {
    model: "gpt-4o",
    max_tokens: 1200,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${localBase64}`,
              detail: "high",
            },
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${referenceBase64}`,
              detail: "high",
            },
          },
        ],
      },
    ],
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content?.trim() || "{}";
  const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, ""));
  return normalizeJudgeResult(parsed, viewName);
}

function isViewPass(result) {
  const s = result.scores || {};
  const noHigh = !(result.differences || []).some((d) => d.severity === "high");
  return (
    result.match === true &&
    Number(s.layout) >= 98 &&
    Number(s.spacing) >= 98 &&
    Number(s.typography) >= 98 &&
    Number(s.colors) >= 98 &&
    Number(s.controls) >= 98 &&
    noHigh
  );
}

function aggregateVerdict(results) {
  const keys = Object.keys(results);
  return keys.every((k) => isViewPass(results[k]));
}

function summarizeTopDifferences(results) {
  const out = [];
  for (const [view, result] of Object.entries(results)) {
    for (const diff of result.differences || []) {
      out.push({
        view,
        severity: diff.severity,
        area: diff.area,
        issue: diff.issue,
        fixHint: diff.fixHint,
      });
    }
  }
  const rank = { high: 3, medium: 2, low: 1 };
  out.sort((a, b) => rank[b.severity] - rank[a.severity]);
  return out.slice(0, 8);
}

async function waitForViewerShell(page) {
  await page.waitForSelector("header", { timeout: 20000 });
  await page.waitForTimeout(1200);
}

async function clickByRoleName(page, names) {
  for (const name of names) {
    const btn = page.getByRole("button", { name });
    if ((await btn.count()) > 0) {
      await btn.first().click();
      await page.waitForTimeout(700);
      return true;
    }
  }
  return false;
}

async function showCommentsAddFlow(page) {
  const opened = await clickByRoleName(page, [
    "Comments sidebar",
    "Comments",
    "comments",
  ]);
  if (!opened) return false;
  await page.waitForTimeout(500);

  const addButtonClicked = await clickByRoleName(page, [
    "Add Comment",
    "Add comment",
  ]);
  if (addButtonClicked) return true;

  const hasTextarea =
    (await page.locator("textarea[placeholder*='comment']").count()) > 0;
  return hasTextarea;
}

async function captureLocalStates(page, localUrl, runDir) {
  const paths = {
    clean: join(runDir, "local-clean.png"),
    aiOpen: join(runDir, "local-ai-open.png"),
    commentsAdd: join(runDir, "local-comments-add.png"),
  };

  await page.goto(localUrl, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForSelector(".fv-root", { timeout: 20000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: paths.clean, fullPage: false });

  await clickByRoleName(page, ["Ask AI sidebar", "Ask AI", "ask ai"]);
  await page.screenshot({ path: paths.aiOpen, fullPage: false });

  await page.goto(localUrl, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForSelector(".fv-root", { timeout: 20000 });
  await page.waitForTimeout(900);
  await showCommentsAddFlow(page);
  await page.screenshot({ path: paths.commentsAdd, fullPage: false });

  return paths;
}

async function captureFactifyStates(page, factifyUrl, runDir) {
  const paths = {
    clean: join(runDir, "reference-live-clean.png"),
    aiOpen: join(runDir, "reference-live-ai-open.png"),
    commentsAdd: join(runDir, "reference-live-comments-add.png"),
  };
  const errors = [];

  const safeStep = async (name, fn) => {
    try {
      await fn();
    } catch (err) {
      errors.push(`${name}: ${String(err.message || err)}`);
      return false;
    }
    return true;
  };

  const okClean = await safeStep("clean", async () => {
    await page.goto(factifyUrl, { waitUntil: "networkidle", timeout: 45000 });
    await waitForViewerShell(page);
    await page.screenshot({ path: paths.clean, fullPage: false });
  });

  const okAi = await safeStep("aiOpen", async () => {
    await page.goto(factifyUrl, { waitUntil: "networkidle", timeout: 45000 });
    await waitForViewerShell(page);
    const opened = await clickByRoleName(page, [
      "Ask AI sidebar",
      "Ask AI",
      "ask ai",
      "AI",
    ]);
    if (!opened) throw new Error("Ask AI trigger not found");
    await page.screenshot({ path: paths.aiOpen, fullPage: false });
  });

  const okComments = await safeStep("commentsAdd", async () => {
    await page.goto(factifyUrl, { waitUntil: "networkidle", timeout: 45000 });
    await waitForViewerShell(page);
    const ok = await showCommentsAddFlow(page);
    if (!ok) throw new Error("comments add flow not reachable");
    await page.screenshot({ path: paths.commentsAdd, fullPage: false });
  });

  return {
    ok: okClean && okAi && okComments,
    paths,
    errors,
    missingViews: {
      clean: !okClean,
      aiOpen: !okAi,
      commentsAdd: !okComments,
    },
  };
}

async function ensureBaselines() {
  const baselines = {
    clean: join(BASELINES_DIR, BASELINE_FILES.clean),
    aiOpen: join(BASELINES_DIR, BASELINE_FILES.aiOpen),
    commentsAdd: join(BASELINES_DIR, BASELINE_FILES.commentsAdd),
  };
  await requireFile(baselines.clean, "clean baseline");
  await requireFile(baselines.aiOpen, "ask ai baseline");
  await requireFile(baselines.commentsAdd, "comments add baseline");
  return baselines;
}

async function main() {
  const args = process.argv.slice(2);
  const port = getArgValue(args, "--port") || process.env.PORT || "3001";
  const maxIterArg = getArgValue(args, "--max-iterations");
  const maxIterations = maxIterArg ? Number(maxIterArg) : Infinity;
  const minLoopsArg = getArgValue(args, "--min-loops");
  const minLoops = minLoopsArg ? Number(minLoopsArg) : 10;
  const continueUntilPass = !hasFlag(args, "--stop-after-min");
  const localUrl = `http://localhost:${port}/viewer/doc-1?parity=1`;
  const factifyUrl =
    getArgValue(args, "--factify-url") ||
    process.env.FACTIFY_URL ||
    "https://d.factify.com/documents/019c4c80-fa38-7662-95b8-27c427e6e686";

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  const baselines = await ensureBaselines();
  await mkdir(PARITY_RUNS, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  let iteration = 0;
  let passed = false;
  const runSummary = [];

  try {
    while (iteration < maxIterations) {
      iteration += 1;
      const mustRunThisLoop =
        iteration <= minLoops || (continueUntilPass && !passed);
      if (!mustRunThisLoop) break;

      const runDir = join(PARITY_RUNS, `iter-${iteration}`);
      await mkdir(runDir, { recursive: true });
      const focus = LOOP_FOCUS[iteration] || "extra parity refinement";
      console.log(`\nIteration ${iteration} focus: ${focus}`);

      const localState = await captureLocalStates(page, localUrl, runDir);
      const liveRef = await captureFactifyStates(page, factifyUrl, runDir);

      if (!liveRef.ok) {
        console.log("live Factify capture partial failure, using fallback where needed");
        for (const err of liveRef.errors) {
          console.log(`reference capture warning: ${err}`);
        }
      }

      const referenceForView = {
        clean: liveRef.missingViews.clean ? baselines.clean : liveRef.paths.clean,
        aiOpen: liveRef.missingViews.aiOpen ? baselines.aiOpen : liveRef.paths.aiOpen,
        commentsAdd: liveRef.missingViews.commentsAdd
          ? baselines.commentsAdd
          : liveRef.paths.commentsAdd,
      };

      const results = {
        clean: await callJudge(localState.clean, referenceForView.clean, "clean"),
        aiOpen: await callJudge(localState.aiOpen, referenceForView.aiOpen, "aiOpen"),
        commentsAdd: await callJudge(
          localState.commentsAdd,
          referenceForView.commentsAdd,
          "commentsAdd"
        ),
      };

      passed = aggregateVerdict(results);
      const topDifferences = summarizeTopDifferences(results);
      const loopReport = {
        iteration,
        focus,
        localState,
        referenceForView,
        referenceSource: {
          clean: liveRef.missingViews.clean ? "frozen" : "live",
          aiOpen: liveRef.missingViews.aiOpen ? "frozen" : "live",
          commentsAdd: liveRef.missingViews.commentsAdd ? "frozen" : "live",
        },
        passed,
        results,
        topDifferences,
      };
      runSummary.push({
        iteration,
        passed,
        referenceSource: loopReport.referenceSource,
      });

      await writeFile(
        join(runDir, "judge-results.json"),
        JSON.stringify(loopReport, null, 2)
      );

      console.log(`pass status ${passed ? "true" : "false"}`);
      if (topDifferences.length > 0) {
        console.log("top fix targets");
        for (const item of topDifferences.slice(0, 3)) {
          console.log(
            `${item.severity} ${item.view} ${item.area}: ${item.issue} | hint: ${item.fixHint}`
          );
        }
      }
    }
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }

  await writeFile(
    join(PARITY_RUNS, "run-summary.json"),
    JSON.stringify(
      {
        minLoops,
        continueUntilPass,
        totalIterations: iteration,
        finalPass: passed,
        runSummary,
      },
      null,
      2
    )
  );

  if (!passed) {
    console.log("loop finished without full parity pass");
    process.exit(1);
  }

  if (iteration < minLoops) {
    console.log("loop ended before minimum loop count");
    process.exit(1);
  }

  console.log("design parity achieved");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
