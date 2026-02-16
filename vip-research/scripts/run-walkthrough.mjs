import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.BASE_URL || "http://localhost:3000";
const outDir =
  process.env.SCREENSHOT_DIR ||
  path.resolve(process.cwd(), "screenshots", new Date().toISOString().slice(0, 10));

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function shot(page, name) {
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
}

async function runViewerWalkthroughShots(page, namePrefix) {
  const card = page.locator(".fv-walkthrough-card");
  // Wait for the walkthrough card and start button.
  await card.getByRole("button", { name: "Start Walkthrough", exact: true }).waitFor({ timeout: 30000 });
  await shot(page, `${namePrefix}_walkthrough_idle`);

  await card.getByRole("button", { name: "Start Walkthrough", exact: true }).click();
  await card.getByText(/Step 1 of/i).waitFor({ timeout: 30000 });

  const waitForComputedHighlightInView = async () => {
    await page.waitForSelector(".fv-walkthrough-highlight", { timeout: 60000 });
    await page.waitForFunction(() => {
      const el = document.querySelector(".fv-walkthrough-highlight");
      return el && el.getAttribute("data-fv-highlight-source") === "computed";
    }, null, { timeout: 60000 });
    await page.waitForFunction(() => {
      const el = document.querySelector(".fv-walkthrough-highlight");
      if (!el) return false;
      const r = el.getBoundingClientRect();
      // Ensure the highlight is actually within the viewport (not just in the DOM).
      return r.bottom > 0 && r.top < window.innerHeight;
    }, null, { timeout: 60000 });
  };

  // Step 1
  await waitForComputedHighlightInView();
  await shot(page, `${namePrefix}_walkthrough_step_01`);

  // Step 2
  await card.getByRole("button", { name: "Next", exact: true }).click();
  await waitForComputedHighlightInView();
  await shot(page, `${namePrefix}_walkthrough_step_02`);

  // Step 3
  await card.getByRole("button", { name: "Next", exact: true }).click();
  await waitForComputedHighlightInView();
  await shot(page, `${namePrefix}_walkthrough_step_03`);
}

async function main() {
  await ensureDir(outDir);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  // Make runs deterministic: clear persisted state once per run.
  await context.addInitScript(() => {
    try {
      const onceFlag = "factify_cleared_once";
      if (!window.localStorage.getItem(onceFlag)) {
        window.localStorage.removeItem("factify_app_state_v1");
        window.localStorage.setItem(onceFlag, "1");
      }
    } catch {
      // ignore
    }
  });
  const page = await context.newPage();

  // Step 1: Landing
  await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await shot(page, "01_landing");

  // Step 2: Batch upload (set hidden file input directly)
  const pdfDir = path.resolve(process.cwd(), "public", "pdfs");
  const pdfs = [
    path.join(pdfDir, "JP_Research_Q1_2026_Global_Semiconductor_Outlook.pdf"),
    path.join(pdfDir, "JP_Research_AI_Infrastructure_500B_Capex_Cycle.pdf"),
    path.join(pdfDir, "JP_Research_ESG_Clean_Energy_2026_Sector_Review.pdf"),
  ];
  await page.setInputFiles('input[type="file"]', pdfs);

  // Step 3: Animation
  await page.waitForTimeout(1000);
  await shot(page, "02_factification_animation");

  // Animation routes to /vips when complete
  await page.waitForURL("**/vips", { timeout: 30000 });
  await page.waitForTimeout(500);
  await shot(page, "03_vips_list_empty");

  // Step 4: Add VIP Alexandra via Tab autocomplete
  await page.getByRole("button", { name: "Add VIP" }).click();
  await page.waitForTimeout(400);
  await shot(page, "04_add_vip_modal");

  const nameInput = page.locator('input[placeholder="Start typing a name..."]');
  await nameInput.click();
  await nameInput.fill("Al");
  await page.waitForTimeout(250);
  await nameInput.press("Tab"); // accept Alexandra suggestion

  const emailInput = page.locator('input[type="email"]');
  await emailInput.press("Tab"); // start email autofill
  await page.waitForFunction(() => {
    const el = document.querySelector('input[type="email"]');
    return el && el.value.toLowerCase().includes("northstarwealth.com");
  });

  const interestsTa = page.locator("textarea").nth(0);
  await interestsTa.click();
  await interestsTa.press("Tab"); // start interests autofill
  await page.waitForFunction(() => {
    const el = document.querySelectorAll("textarea")[0];
    return el && el.value.toLowerCase().includes("oil and gas");
  });

  const notesTa = page.locator("textarea").nth(1);
  await notesTa.click();
  await notesTa.press("Tab"); // start notes autofill
  await page.waitForFunction(() => {
    const el = document.querySelectorAll("textarea")[1];
    return el && el.value.toLowerCase().includes("prefers");
  });

  await shot(page, "05_add_vip_autofilled");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Add VIP" })
    .click();
  await page.waitForTimeout(800);
  await shot(page, "06_vips_list_with_alexandra");

  // Step 5: Open Alexandra profile
  await page.getByText("Alexandra Petrov", { exact: true }).click();
  await page.waitForURL("**/vips/**", { timeout: 30000 });
  await page.getByText("Recommended Research", { exact: true }).waitFor({ timeout: 30000 });
  await page.waitForTimeout(500);
  await shot(page, "07_alexandra_profile");

  // Step 6: Share first recommended doc + approve a quote comment
  const shareBtn = page.getByRole("button", { name: "Share with VIP" }).first();
  await shareBtn.scrollIntoViewIfNeeded();
  await shareBtn.click();
  await page.waitForTimeout(600);
  await shot(page, "08_share_modal");

  // Expand quotes section and approve first quote
  await page.getByRole("button", { name: /AI Personalized|Add a Comment/i }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Approve" }).first().click();
  await page.waitForTimeout(250);
  await shot(page, "09_share_modal_quote_approved");

  // Capture the viewer link with vipId from the modal
  const viewerHref = await page
    .getByRole("dialog")
    .locator('a[href^="/viewer/"]')
    .first()
    .getAttribute("href");

  await page.getByRole("button", { name: "Send" }).click();
  await page.waitForTimeout(800);
  await shot(page, "10_shared_confirmation");

  // Desktop viewer walkthrough screenshots
  const desktopViewer = await context.newPage();
  await desktopViewer.goto(`${baseURL}${viewerHref}`, { waitUntil: "domcontentloaded" });
  await desktopViewer.waitForTimeout(1500);
  await shot(desktopViewer, "10b_desktop_viewer_loaded");
  await runViewerWalkthroughShots(desktopViewer, "12c_desktop");

  // Step 8: Alexandra opens the doc in a separate tab (mobile emulator)
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(`${baseURL}${viewerHref}`, { waitUntil: "domcontentloaded" });
  await mobile.waitForTimeout(1500);
  await shot(mobile, "13_mobile_viewer_loaded");

  // Mobile walkthrough screenshots (before opening drawers)
  await runViewerWalkthroughShots(mobile, "13b_mobile");

  // Open comments drawer via the bottom bar (mobile)
  const commentsBtn = mobile.getByRole("button", { name: "Comments sidebar" }).first();
  await commentsBtn.waitFor({ timeout: 30000 });
  await shot(mobile, "14_mobile_comments_button_visible");
  await commentsBtn.click({ force: true });
  await mobile.waitForTimeout(600);
  await shot(mobile, "15_mobile_comments_drawer_open");

  // Reply with Tab autocomplete
  await mobile.locator(".fv-reply-link").first().click();
  const replyInput = mobile.locator(".fv-reply-input").first();
  // Tab autocomplete should work even from empty.
  await replyInput.press("Tab");
  await shot(mobile, "16_mobile_reply_tab_autocomplete");
  await replyInput.press("Enter");
  await mobile.waitForTimeout(800);
  await shot(mobile, "17_mobile_reply_sent");

  await browser.close();
  console.log(`Screenshots saved to: ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

