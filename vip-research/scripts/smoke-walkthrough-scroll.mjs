import { chromium } from "playwright";

const baseURL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Directly open a viewer route (skips app onboarding/upload flows).
  await page.goto(`${baseURL}/viewer/doc-6?vipId=vip-2&parity=1`, {
    waitUntil: "domcontentloaded",
  });

  // Wait for the PDF container + at least 2 pages to exist.
  await page.waitForSelector(".fv-pdf-scroll", { timeout: 60000 });
  await page.waitForFunction(() => {
    return document.querySelectorAll(".fv-pdf-page").length >= 2;
  }, null, { timeout: 60000 });

  // Start walkthrough.
  const card = page.locator(".fv-walkthrough-card");
  await card.getByRole("button", { name: "Start Walkthrough", exact: true }).waitFor({ timeout: 60000 });
  await card.getByRole("button", { name: "Start Walkthrough", exact: true }).click();
  await card.getByText(/Step 1 of/i).waitFor({ timeout: 30000 });

  // Wait until we have a computed highlight and it's actually visible.
  await page.waitForSelector(".fv-walkthrough-highlight", { timeout: 60000 });
  await page.waitForFunction(() => {
    const el = document.querySelector(".fv-walkthrough-highlight");
    return el && el.getAttribute("data-fv-highlight-source") === "computed";
  }, null, { timeout: 60000 });

  await page.waitForFunction(() => {
    const el = document.querySelector(".fv-walkthrough-highlight");
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }, null, { timeout: 60000 });

  // Ensure the computed highlight is not on the first page (this is the bug
  // we saw: first click stays at page 1 while step text corresponds to later pages).
  const pageIndex = await page.evaluate(() => {
    const highlight = document.querySelector(".fv-walkthrough-highlight");
    if (!highlight) return -1;
    const pageEl = highlight.closest(".fv-pdf-page");
    if (!pageEl) return -1;
    const pages = Array.from(document.querySelectorAll(".fv-pdf-page"));
    return pages.indexOf(pageEl);
  });

  if (pageIndex < 1) {
    throw new Error(`Expected computed highlight on page >= 2, got index ${pageIndex}`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

