import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the VideoHarvester product page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="en">/i);
  assert.match(html, /<title>VideoHarvester — Save videos locally, with confidence<\/title>/i);
  assert.match(html, /Save the videos you value/);
  assert.match(html, /Native Windows app · Runs locally/);
  assert.match(html, /Know before you download/);
  assert.match(html, /Collections stay organized/);
  assert.match(html, /Progress you can understand/);
  assert.match(html, /Resume where you left off/);
  assert.match(html, /中文/);
  assert.match(html, /VideoHarvester-v2\.0-Full\.zip/);
  assert.match(html, /VideoHarvester-v2\.0-Lite\.zip/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|codex-preview/i);
});

test("ships the confirmed real-product screenshots", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const screenshotNames = [
    "app-main-window-real.png",
    "app-preflight-confirm-real.png",
    "app-bili-collection-real.png",
    "app-queue-complete-real.png",
    "app-resume-queue-real.png",
  ];

  for (const name of screenshotNames) {
    assert.match(page, new RegExp(`/${name.replace(".", "\\.")}`));
    await access(new URL(`public/${name}`, projectRoot));
  }

  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview|react-loading-skeleton/);
});
