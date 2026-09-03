import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(path = "/", host = "videoharvester.app") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://${host}${path}`, {
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
  assert.match(html, /rel="canonical" href="https:\/\/videoharvester\.app\/?"/i);
  assert.match(html, /rel="alternate" href="https:\/\/videoharvester\.app\/?" hreflang="en"/i);
  assert.match(html, /rel="alternate" href="https:\/\/videoharvester\.app\/\?lang=zh" hreflang="zh-CN"/i);
  assert.match(html, /property="og:url" content="https:\/\/videoharvester\.app\/?"/i);
  assert.match(html, /property="og:image" content="https:\/\/videoharvester\.app\/og\.png"/i);
  assert.match(html, /Save the videos you value/);
  assert.match(html, /Native Windows app · Runs locally/);
  assert.match(html, /Know before you download/);
  assert.match(html, /Collections stay organized/);
  assert.match(html, /Progress you can understand/);
  assert.match(html, /Resume where you left off/);
  assert.match(html, /中文/);
  assert.match(html, /aria-label="English" aria-pressed="true"/i);
  assert.match(html, /releases\/download\/v2\.0\.3\/VideoHarvester-v2\.0-Full\.zip/);
  assert.match(html, /releases\/download\/v2\.0\.3\/VideoHarvester-v2\.0-Lite\.zip/);
  assert.match(html, /E52E3CACE1981173D170401BE1F51AF5B47F0482729199B6E8124E941975BCD3/);
  assert.match(html, /997EF8E683A026EFCCBEB36D6D418D0FC5EE89EC4D0DC30CB611E2307CF083FF/);
  assert.match(html, /Published August 16, 2026/);
  assert.doesNotMatch(html, /chatgpt\.site|localhost/i);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|codex-preview/i);
});

test("server-renders a shareable Chinese page with Chinese metadata", async () => {
  const response = await render("/?lang=zh");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>VideoHarvester — 安稳地把视频保存在本地<\/title>/i);
  assert.match(html, /把喜欢的视频/);
  assert.match(html, /Windows 原生软件 · 只在本机运行/);
  assert.match(html, /rel="canonical" href="https:\/\/videoharvester\.app\/\?lang=zh"/i);
  assert.match(html, /property="og:url" content="https:\/\/videoharvester\.app\/\?lang=zh"/i);
  assert.match(html, /aria-label="中文" aria-pressed="true"/i);
  assert.match(html, /发布于 2026 年 8 月 16 日/);
  assert.doesNotMatch(html, /chatgpt\.site|localhost/i);
});

test("redirects the retired Sites hostname to the production domain", async () => {
  const response = await render("/download?lang=zh", "video-harvester-pro.liyanbao06.chatgpt.site");
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://videoharvester.app/download?lang=zh");
});

test("ships the confirmed real-product screenshots", async () => {
  const page = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");
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
