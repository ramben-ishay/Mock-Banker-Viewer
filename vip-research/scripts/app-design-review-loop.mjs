#!/usr/bin/env node

import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REVIEW_DIR = join(ROOT, "design-review");
const RUNS_DIR = join(REVIEW_DIR, "runs");
const MATRIX_PATH = join(REVIEW_DIR, "route-matrix.json");

const VIEWPORTS = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 1024, height: 768 },
  { id: "mobile", width: 390, height: 844 },
];

const SCORE_WEIGHTS = {
  low: 3,
  medium: 7,
  high: 14,
  critical: 22,
};

function getArgValue(args, key, fallback) {
  const inline = args.find((a) => a.startsWith(`${key}=`));
  if (inline) return inline.split("=")[1];
  const idx = args.indexOf(key);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return fallback;
}

function passName(index) {
  return `pass${String(index).padStart(2, "0")}`;
}

function screenshotName(passId, screenId, stateId, viewportId) {
  return `${passId}_${screenId}_${stateId}_${viewportId}.png`;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

async function readMatrix() {
  const raw = await readFile(MATRIX_PATH, "utf8");
  return JSON.parse(raw);
}

async function waitForStable(page) {
  await page.waitForLoadState("domcontentloaded");
  // Many screens rely on framer-motion enter transitions (some with delays),
  // so give the UI a moment to reach a stable visual state before capturing.
  await page.waitForTimeout(950);
}

async function safeClick(page, role, namePattern) {
  const target = page.getByRole(role, { name: namePattern }).first();
  if (await target.isVisible().catch(() => false)) {
    await target.click();
    await page.waitForTimeout(350);
    return true;
  }
  return false;
}

function isVipDetailRoute(route) {
  return route.startsWith("/vips/vip-");
}

async function connectCrmIfNeeded(page) {
  const connectedMarker = page.getByText(/CRM Synchronized/i);
  if (await connectedMarker.isVisible().catch(() => false)) return;

  // If we're not connected, this button should exist in the empty state.
  const clicked = await safeClick(page, "button", /Connect to Salesforce/i);
  if (clicked) {
    // VipListPage simulates async connect via setTimeout(2000).
    await page.waitForTimeout(2300);
  }
}

async function gotoVipDetailViaList(page, baseUrl, vipRoute) {
  // Navigating directly to /vips/vip-* resets AppProvider state and shows "VIP not found".
  // Instead: go to /vips, connect, then use client-side navigation to the VIP detail.
  await page.goto(`${baseUrl}/vips`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForStable(page);
  await connectCrmIfNeeded(page);

  const link = page.locator(`a[href='${vipRoute}']`).first();
  if (await link.isVisible().catch(() => false)) {
    await Promise.all([
      page.waitForURL(`**${vipRoute}`, { timeout: 20000 }),
      link.click(),
    ]);
    await waitForStable(page);
    return;
  }

  // Fallback: direct navigation (may land on "VIP not found" if state didn't persist),
  // but keep it as a best-effort capture rather than failing the run.
  await page.goto(`${baseUrl}${vipRoute}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitForStable(page);
}

async function captureState(page, options) {
  const { baseUrl, route, stateId, passId, viewportId, outputDir, manifest } = options;
  if (isVipDetailRoute(route)) {
    await gotoVipDetailViaList(page, baseUrl, route);
  } else {
    const path = `${baseUrl}${route}`;
    await page.goto(path, { waitUntil: "domcontentloaded", timeout: 45000 });
    await waitForStable(page);
  }

  if (route === "/" && stateId === "drag_over") {
    await page.evaluate(() => {
      const dropZone = document.querySelector('[class*="border-dashed"]');
      if (!dropZone) return;
      const event = new Event("dragover", { bubbles: true, cancelable: true });
      dropZone.dispatchEvent(event);
    });
    await page.waitForTimeout(250);
  }

  if (route === "/vips" && stateId === "crm_connected") {
    await safeClick(page, "button", /Connect to Salesforce/i);
    await page.waitForTimeout(2300);
  }

  if (route === "/vips" && stateId === "add_vip_modal_open") {
    const addClicked =
      (await safeClick(page, "button", /^Add VIP$/i)) ||
      (await safeClick(page, "button", /Add VIP Manually/i));
    if (!addClicked) {
      await page.waitForTimeout(150);
    }
  }

  if (route === "/vips" && stateId === "add_vip_validation_error") {
    await safeClick(page, "button", /^Add VIP$/i);
    await page.waitForTimeout(300);
    await safeClick(page, "button", /^Add VIP$/i);
    await page.waitForTimeout(250);
  }

  if (isVipDetailRoute(route) && stateId === "comments_panel_open") {
    await safeClick(page, "button", /Comments/i);
  }

  if (isVipDetailRoute(route) && stateId === "share_modal_open") {
    await safeClick(page, "button", /Share with VIP/i);
    await page.waitForTimeout(250);
  }

  if (isVipDetailRoute(route) && stateId === "share_modal_quotes_expanded") {
    await safeClick(page, "button", /Share with VIP/i);
    await page.waitForTimeout(300);
    await safeClick(page, "button", /Add a Comment/i);
  }

  if (route === "/documents" && stateId === "search_filtered") {
    const input = page.getByPlaceholder(/Search by title or topic/i);
    if (await input.isVisible().catch(() => false)) {
      await input.fill("semi");
      await page.waitForTimeout(220);
    }
  }

  if (route === "/documents" && stateId === "document_share_modal_open") {
    await safeClick(page, "button", /Share updated version with them/i);
  }

  if (route === "/viewer/doc-1" && stateId === "ai_drawer_open") {
    await safeClick(page, "button", /Ask AI sidebar/i);
  }

  if (route === "/viewer/doc-1" && stateId === "comments_drawer_open") {
    await safeClick(page, "button", /Comments sidebar/i);
  }

  if (route === "/viewer/doc-1" && stateId === "search_open") {
    await safeClick(page, "button", /Search in document/i);
  }

  if (route === "/viewer/doc-1" && stateId === "thumbnails_open") {
    await safeClick(page, "button", /Show thumbnails/i);
  }

  if (route === "/viewer/doc-1" && stateId === "walkthrough_open") {
    await safeClick(page, "button", /Start Walkthrough/i);
  }

  const screenId = route === "/" ? "landing" : route.replaceAll("/", "_").replace(/^_/, "");
  const name = screenshotName(passId, screenId, stateId, viewportId);
  const outputPath = join(outputDir, name);
  await page.screenshot({ path: outputPath, fullPage: true });

  manifest.push({
    passId,
    viewport: viewportId,
    route,
    state: stateId,
    screenshot: outputPath,
    capturedAt: new Date().toISOString(),
  });

  return outputPath;
}

async function collectDomSignals(page) {
  return page.evaluate(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const body = document.body;
    const bodyStyle = getComputedStyle(body);
    const firstButton = document.querySelector("button");
    const firstInput = document.querySelector("input, textarea");
    const heading = document.querySelector("h1, h2, h3, h4, h5, h6");
    const brandButton = document.querySelector(
      "button[class*='bg-brand-500'], a[class*='bg-brand-500']"
    );
    let focusRing = "";
    if (firstButton instanceof HTMLElement) {
      firstButton.focus();
      focusRing = getComputedStyle(firstButton).boxShadow;
      firstButton.blur();
    }

    let hasFocusStyleRule = false;
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of Array.from(rules)) {
        if (!("selectorText" in rule)) continue;
        const selector = String(rule.selectorText || "");
        const text = String(rule.cssText || "").toLowerCase();
        if (selector.includes(":focus-visible") && text.includes("box-shadow")) {
          hasFocusStyleRule = true;
          break;
        }
      }
      if (hasFocusStyleRule) break;
    }

    let modalRadius = "";
    const modal = document.querySelector("[role='dialog']");
    if (modal instanceof HTMLElement) {
      modalRadius = getComputedStyle(modal).borderRadius;
    }

    const headingFamily = heading ? getComputedStyle(heading).fontFamily : "";
    const inputBorder = firstInput ? getComputedStyle(firstInput).borderColor : "";

    return {
      bodyFontFamily: bodyStyle.fontFamily,
      bodyTextColor: bodyStyle.color,
      headingFontFamily: headingFamily,
      hasHeading: Boolean(heading),
      hasBrandButton: Boolean(brandButton),
      hasAnyButton: Boolean(firstButton),
      hasFocusStyleRule,
      focusRing,
      modalRadius,
      inputBorder,
      brandToken: rootStyle.getPropertyValue("--color-brand-500").trim(),
      neutralBorderToken: rootStyle.getPropertyValue("--color-neutral-300").trim(),
    };
  });
}

function classifySeverity(scoreDelta) {
  if (scoreDelta >= 15) return "critical";
  if (scoreDelta >= 10) return "high";
  if (scoreDelta >= 5) return "medium";
  return "low";
}

function makeIssue(judgeId, area, issue, expected, actual, scoreDelta) {
  return {
    judgeId,
    area,
    issue,
    expected,
    actual,
    severity: classifySeverity(scoreDelta),
    scoreDelta,
  };
}

function judgeVisualHierarchy(signals) {
  const issues = [];
  if (signals.hasHeading && !signals.headingFontFamily.toLowerCase().includes("satoshi")) {
    issues.push(
      makeIssue(
        "visual_hierarchy",
        "typography.heading",
        "Heading family does not use Satoshi",
        "Satoshi Variable",
        signals.headingFontFamily,
        10
      )
    );
  }
  if (!signals.bodyFontFamily.toLowerCase().includes("inter")) {
    issues.push(
      makeIssue(
        "visual_hierarchy",
        "typography.body",
        "Body family does not use Inter",
        "Inter",
        signals.bodyFontFamily,
        10
      )
    );
  }
  return issues;
}

function judgeTokenConsistency(signals) {
  const issues = [];
  if (signals.brandToken.toLowerCase() !== "#444aff") {
    issues.push(
      makeIssue(
        "token_consistency",
        "token.brand_500",
        "Brand 500 token does not match design system",
        "#444aff",
        signals.brandToken || "unset",
        12
      )
    );
  }
  if (signals.neutralBorderToken.toLowerCase() !== "#e6eaf2") {
    issues.push(
      makeIssue(
        "token_consistency",
        "token.neutral_300",
        "Neutral 300 token does not match design system",
        "#e6eaf2",
        signals.neutralBorderToken || "unset",
        6
      )
    );
  }
  return issues;
}

function judgeInteractionFeedback(signals) {
  const issues = [];
  if (
    signals.hasAnyButton &&
    !signals.hasFocusStyleRule &&
    (!signals.focusRing || !signals.focusRing.includes("3px"))
  ) {
    issues.push(
      makeIssue(
        "interaction_feedback",
        "focus.visible",
        "Focusable controls are present but visible focus ring is not detected",
        "Visible 3px focus ring",
        signals.focusRing || "none",
        6
      )
    );
  }
  return issues;
}

function judgeDensityReadability(signals) {
  const issues = [];
  if (!signals.bodyTextColor || signals.bodyTextColor === "rgba(0, 0, 0, 0)") {
    issues.push(
      makeIssue(
        "density_readability",
        "text.color",
        "Body text color is invalid",
        "Readable neutral text color",
        signals.bodyTextColor || "none",
        8
      )
    );
  }
  return issues;
}

function judgeAccessibilityQuick(signals) {
  const issues = [];
  if (signals.modalRadius && Number.parseFloat(signals.modalRadius) < 12) {
    issues.push(
      makeIssue(
        "accessibility_quick",
        "modal.shape",
        "Modal shape does not align to popup radius",
        "12px or higher",
        signals.modalRadius,
        5
      )
    );
  }
  return issues;
}

function aggregateJudgeScores(issues) {
  const buckets = {
    visual_hierarchy: 100,
    token_consistency: 100,
    interaction_feedback: 100,
    density_readability: 100,
    accessibility_quick: 100,
  };

  for (const issue of issues) {
    const key = issue.judgeId;
    if (!(key in buckets)) continue;
    const penalty = SCORE_WEIGHTS[issue.severity] ?? 0;
    buckets[key] = clampScore(buckets[key] - penalty);
  }

  const weightedTotal = clampScore(
    buckets.visual_hierarchy * 0.25 +
      buckets.token_consistency * 0.25 +
      buckets.interaction_feedback * 0.2 +
      buckets.density_readability * 0.2 +
      buckets.accessibility_quick * 0.1
  );

  const hasCritical = issues.some((i) => i.severity === "critical");
  const allAboveThreshold = Object.values(buckets).every((s) => s >= 85);
  const pass = allAboveThreshold && !hasCritical;

  return { scores: buckets, weightedTotal, pass };
}

function dedupeIssues(rawIssues) {
  const map = new Map();
  for (const issue of rawIssues) {
    const normalizedRoute = issue.route.split("?")[0];
    const signature = [
      issue.judgeId,
      issue.area,
      normalizedRoute,
      issue.viewport,
      issue.severity,
    ].join("::");
    const existing = map.get(signature);
    if (!existing || issue.scoreDelta > existing.scoreDelta) {
      map.set(signature, issue);
    }
  }
  return [...map.values()];
}

function parseViewportsArg(raw) {
  const value = String(raw || "all").trim().toLowerCase();
  if (value === "all") return VIEWPORTS;

  const wanted = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const selected = VIEWPORTS.filter((v) => wanted.includes(v.id));
  if (selected.length === 0) {
    throw new Error(
      `Invalid --viewports value "${raw}". Use "all" or a comma-separated list of: ${VIEWPORTS.map((v) => v.id).join(", ")}`
    );
  }
  return selected;
}

async function runPass(browser, matrix, passIndex, viewports) {
  const passId = passName(passIndex);
  const passDir = join(RUNS_DIR, passId);
  const screenshotsDir = join(passDir, "screenshots");
  await mkdir(screenshotsDir, { recursive: true });

  const manifest = [];
  const allIssues = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    for (const routeEntry of matrix.routes) {
      const states = routeEntry.states || ["default"];
      for (const stateId of states) {
        const routePath = routeEntry.path;
        const shotPath = await captureState(page, {
          baseUrl: matrix.baseUrl,
          route: routePath,
          stateId,
          passId,
          viewportId: viewport.id,
          outputDir: screenshotsDir,
          manifest,
        });

        const signals = await collectDomSignals(page);
        const issues = [
          ...judgeVisualHierarchy(signals),
          ...judgeTokenConsistency(signals),
          ...judgeInteractionFeedback(signals),
          ...judgeDensityReadability(signals),
          ...judgeAccessibilityQuick(signals),
        ].map((issue) => ({
          ...issue,
          route: routePath,
          state: stateId,
          viewport: viewport.id,
          screenshot: shotPath,
        }));
        allIssues.push(...issues);
      }

      if (Array.isArray(routeEntry.variants)) {
        for (const variantPath of routeEntry.variants) {
          for (const stateId of states) {
            const shotPath = await captureState(page, {
              baseUrl: matrix.baseUrl,
              route: variantPath,
              stateId,
              passId,
              viewportId: viewport.id,
              outputDir: screenshotsDir,
              manifest,
            });
            const signals = await collectDomSignals(page);
            const issues = [
              ...judgeVisualHierarchy(signals),
              ...judgeTokenConsistency(signals),
              ...judgeInteractionFeedback(signals),
              ...judgeDensityReadability(signals),
              ...judgeAccessibilityQuick(signals),
            ].map((issue) => ({
              ...issue,
              route: variantPath,
              state: stateId,
              viewport: viewport.id,
              screenshot: shotPath,
            }));
            allIssues.push(...issues);
          }
        }
      }
    }

    await context.close();
  }

  const dedupedIssues = dedupeIssues(allIssues);
  const summary = aggregateJudgeScores(dedupedIssues);
  const bySeverity = {
    critical: dedupedIssues.filter((i) => i.severity === "critical").length,
    high: dedupedIssues.filter((i) => i.severity === "high").length,
    medium: dedupedIssues.filter((i) => i.severity === "medium").length,
    low: dedupedIssues.filter((i) => i.severity === "low").length,
  };

  await writeFile(
    join(passDir, "screenshot-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  await writeFile(
    join(passDir, "gaps-tracker.json"),
    JSON.stringify(
      {
        passId,
        summary,
        bySeverity,
        issues: dedupedIssues,
      },
      null,
      2
    )
  );

  return {
    passId,
    passDir,
    manifest,
    issues: dedupedIssues,
    summary,
    bySeverity,
  };
}

async function writeAggregateReport(runs) {
  const latest = runs[runs.length - 1];
  const lines = [];
  lines.push("# Design Review Report");
  lines.push("");
  lines.push("## Pass Summary");
  lines.push("");
  lines.push("| Pass | Weighted score | Pass gate | Critical | High | Medium | Low |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const run of runs) {
    lines.push(
      `| ${run.passId} | ${run.summary.weightedTotal} | ${run.summary.pass} | ${run.bySeverity.critical} | ${run.bySeverity.high} | ${run.bySeverity.medium} | ${run.bySeverity.low} |`
    );
  }
  lines.push("");
  lines.push("## Latest Scorecard");
  lines.push("");
  lines.push("| Judge | Score |");
  lines.push("| --- | --- |");
  lines.push(`| visual hierarchy | ${latest.summary.scores.visual_hierarchy} |`);
  lines.push(`| token consistency | ${latest.summary.scores.token_consistency} |`);
  lines.push(`| interaction feedback | ${latest.summary.scores.interaction_feedback} |`);
  lines.push(`| density readability | ${latest.summary.scores.density_readability} |`);
  lines.push(`| accessibility quick | ${latest.summary.scores.accessibility_quick} |`);
  lines.push("");
  lines.push("## Top Open Gaps");
  lines.push("");

  const topIssues = latest.issues
    .sort((a, b) => b.scoreDelta - a.scoreDelta)
    .slice(0, 20);
  for (const issue of topIssues) {
    lines.push(
      `* [${issue.severity}] ${issue.route} ${issue.state} ${issue.viewport} :: ${issue.issue} :: expected ${issue.expected} :: actual ${issue.actual}`
    );
  }

  lines.push("");
  lines.push("## Artifacts");
  lines.push("");
  for (const run of runs) {
    lines.push(`* ${run.passId} screenshots: design-review/runs/${run.passId}/screenshots`);
    lines.push(`* ${run.passId} manifest: design-review/runs/${run.passId}/screenshot-manifest.json`);
    lines.push(`* ${run.passId} gaps: design-review/runs/${run.passId}/gaps-tracker.json`);
  }

  await writeFile(join(REVIEW_DIR, "design_review_report.md"), lines.join("\n"));
}

function summarizeFixLog(run, iteration) {
  const title = `## ${run.passId}`;
  const lines = [
    title,
    "",
    `Loop iteration: ${iteration}`,
    `Weighted score: ${run.summary.weightedTotal}`,
    `Pass gate: ${run.summary.pass}`,
    `Critical issues: ${run.bySeverity.critical}`,
    `High issues: ${run.bySeverity.high}`,
    "",
    "Applied fixes in this workspace before rerun:",
    "* viewer route rendered with client only dynamic import to avoid server side viewer crashes",
    "* modal container switched to popup radius token with explicit dialog semantics",
    "",
  ];
  return lines.join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const maxPasses = Number(getArgValue(args, "--max-passes", "2"));
  const stopOnPass = getArgValue(args, "--stop-on-pass", "true") !== "false";
  const viewportsArg = getArgValue(args, "--viewports", "all");
  const selectedViewports = parseViewportsArg(viewportsArg);

  const matrix = await readMatrix();
  await mkdir(REVIEW_DIR, { recursive: true });
  await mkdir(RUNS_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const runs = [];
  const fixLogEntries = [];

  try {
    for (let i = 1; i <= maxPasses; i += 1) {
      const run = await runPass(browser, matrix, i, selectedViewports);
      runs.push(run);
      fixLogEntries.push(summarizeFixLog(run, i));

      if (run.summary.pass && stopOnPass) {
        break;
      }
    }
  } finally {
    await browser.close();
  }

  await writeAggregateReport(runs);
  await writeFile(join(REVIEW_DIR, "fix_log.md"), fixLogEntries.join("\n"));
  await writeFile(
    join(REVIEW_DIR, "gaps_tracker.json"),
    JSON.stringify(runs[runs.length - 1], null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
