import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import test from "node:test";

const PRODUCTION_ORIGIN = "https://videoharvester.app";
const LEGACY_HOST = "video-harvester-pro.liyanbao06.chatgpt.site";
const STRESS_REQUESTS = positiveInteger(process.env.VH_STRESS_REQUESTS, 600);
const STRESS_CONCURRENCY = positiveInteger(process.env.VH_STRESS_CONCURRENCY, 32);
const ISOLATION_REQUESTS = positiveInteger(process.env.VH_ISOLATION_REQUESTS, 240);
const SECURITY_CASES = positiveInteger(process.env.VH_SECURITY_CASES, 72);
const REDIRECT_REQUESTS = positiveInteger(process.env.VH_REDIRECT_REQUESTS, 160);

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("stress", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

async function requestPage(path = "/", host = "videoharvester.app") {
  const startedAt = performance.now();
  const response = await worker.fetch(
    new Request(`https://${host}${path}`, {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );
  const body = await response.text();

  return {
    status: response.status,
    headers: response.headers,
    body,
    elapsedMs: performance.now() - startedAt,
  };
}

async function mapWithConcurrency(items, concurrency, callback) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function consume() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await callback(items[index], index);
    }
  }

  const consumerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: consumerCount }, () => consume()));
  return results;
}

function canonicalFrom(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? null;
}

function assertCompletePage(result, lang) {
  assert.equal(result.status, 200);
  assert.match(result.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.ok(result.body.length > 20_000, `response was unexpectedly short (${result.body.length} bytes)`);
  assert.match(result.body, /^<!DOCTYPE html>/i);
  assert.match(result.body, /<\/body><\/html>$/i);
  assert.equal((result.body.match(/<title>/gi) ?? []).length, 1);
  assert.equal((result.body.match(/rel="canonical"/gi) ?? []).length, 1);
  assert.match(result.body, /VideoHarvester/);
  assert.match(result.body, /E52E3CACE1981173D170401BE1F51AF5B47F0482729199B6E8124E941975BCD3/);
  assert.match(result.body, /997EF8E683A026EFCCBEB36D6D418D0FC5EE89EC4D0DC30CB611E2307CF083FF/);
  assert.doesNotMatch(result.body, /Internal Server Error|Application error|undefined is not/i);

  if (lang === "zh") {
    assert.match(result.body, /<html lang="zh-CN">/i);
    assert.match(result.body, /<title>VideoHarvester — 安稳地把视频保存在本地<\/title>/i);
    assert.match(result.body, /把喜欢的视频/);
    assert.equal(canonicalFrom(result.body), `${PRODUCTION_ORIGIN}/?lang=zh`);
  } else {
    assert.match(result.body, /<html lang="en">/i);
    assert.match(result.body, /<title>VideoHarvester — Save videos locally, with confidence<\/title>/i);
    assert.match(result.body, /Save the videos you value/);
    assert.match(canonicalFrom(result.body), /^https:\/\/videoharvester\.app\/?$/);
  }
}

function formatMetrics(label, requestCount, concurrency, elapsedMs, latencies) {
  const sorted = [...latencies].sort((left, right) => left - right);
  const percentile = (fraction) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))] ?? 0;
  const requestsPerSecond = requestCount / (elapsedMs / 1_000);

  return `${label}: ${requestCount} requests @ concurrency ${concurrency}; `
    + `${elapsedMs.toFixed(0)} ms total; ${requestsPerSecond.toFixed(1)} req/s; `
    + `p50 ${percentile(0.50).toFixed(1)} ms; p95 ${percentile(0.95).toFixed(1)} ms; `
    + `max ${percentile(1).toFixed(1)} ms`;
}

test("keeps English, Chinese, and invalid-language requests isolated under concurrency", async (t) => {
  const cases = Array.from({ length: ISOLATION_REQUESTS }, (_, index) => {
    if (index % 4 === 0) return { path: "/?lang=zh", lang: "zh", redirects: false };
    if (index % 4 === 1) return { path: "/?lang=en", lang: "en", redirects: false };
    if (index % 4 === 2) return { path: "/", lang: "en", redirects: false };
    return { path: `/?lang=invalid-${index}`, lang: "en", redirects: true };
  });
  const startedAt = performance.now();
  const results = await mapWithConcurrency(cases, STRESS_CONCURRENCY, async (entry) => {
    const firstResponse = await requestPage(entry.path);
    if (!entry.redirects) {
      return { entry, response: firstResponse, elapsedMs: firstResponse.elapsedMs };
    }

    assert.equal(firstResponse.status, 308);
    assert.equal(firstResponse.headers.get("location"), `${PRODUCTION_ORIGIN}/`);
    assert.equal(firstResponse.body.includes("invalid-"), false);
    const response = await requestPage("/");
    return { entry, response, elapsedMs: firstResponse.elapsedMs + response.elapsedMs };
  });
  const elapsedMs = performance.now() - startedAt;

  for (const { entry, response } of results) {
    assertCompletePage(response, entry.lang);
  }

  t.diagnostic(formatMetrics(
    "language isolation",
    cases.length,
    STRESS_CONCURRENCY,
    elapsedMs,
    results.map(({ elapsedMs: requestElapsedMs }) => requestElapsedMs),
  ));
});

test("normalizes random and malicious queries without reflecting their payloads", async (t) => {
  const attackCases = Array.from({ length: SECURITY_CASES }, (_, index) => {
    const marker = `VH_ATTACK_${index.toString(36).padStart(3, "0")}_9F3A7C`;
    const url = new URL("/", PRODUCTION_ORIGIN);

    switch (index % 6) {
      case 0:
        url.searchParams.set("utm_source", `${marker}<script>alert(1)</script>`);
        break;
      case 1:
        url.searchParams.set("lang", "zh");
        url.searchParams.set("next", `https://attacker.invalid/${marker}`);
        break;
      case 2:
        url.searchParams.set("lang", `"><svg onload=${marker}>`);
        break;
      case 3:
        url.searchParams.append("lang", "en");
        url.searchParams.append("lang", `zh${marker}`);
        break;
      case 4:
        url.searchParams.set("lang", "zh");
        url.searchParams.set("__proto__", `${marker}\r\nLocation: https://attacker.invalid`);
        break;
      default:
        url.searchParams.set("q", `${marker}${"A".repeat(2_048)}`);
        break;
    }

    return { marker, path: `${url.pathname}${url.search}` };
  });

  const startedAt = performance.now();
  const results = await mapWithConcurrency(attackCases, Math.min(STRESS_CONCURRENCY, 24), async (entry) => {
    const response = await requestPage(entry.path);
    assert.equal(response.status, 308);
    assert.equal(response.body.includes(entry.marker), false);

    const location = response.headers.get("location");
    assert.ok(location, "sanitizing redirect must include Location");
    assert.equal(location.includes(entry.marker), false);
    assert.equal(location.includes(encodeURIComponent(entry.marker)), false);

    const cleanUrl = new URL(location);
    assert.equal(cleanUrl.origin, PRODUCTION_ORIGIN);
    assert.equal(cleanUrl.pathname, "/");
    assert.ok(
      cleanUrl.search === "" || cleanUrl.search === "?lang=en" || cleanUrl.search === "?lang=zh",
      `unexpected normalized query: ${cleanUrl.search}`,
    );

    return {
      entry,
      response,
      cleanUrl,
      followUp: await requestPage(`${cleanUrl.pathname}${cleanUrl.search}`),
    };
  });
  const elapsedMs = performance.now() - startedAt;

  for (const { entry, cleanUrl, followUp } of results) {
    const expectedLanguage = cleanUrl.searchParams.get("lang") === "zh" ? "zh" : "en";
    assertCompletePage(followUp, expectedLanguage);
    assert.equal(followUp.body.includes(entry.marker), false);
    assert.equal(followUp.body.includes("attacker.invalid"), false);
  }

  t.diagnostic(formatMetrics(
    "query normalization",
    attackCases.length,
    Math.min(STRESS_CONCURRENCY, 24),
    elapsedMs,
    results.map(({ response, followUp }) => response.elapsedMs + followUp.elapsedMs),
  ));
});

test("returns stable permanent redirects for the retired hostname", async (t) => {
  const cases = Array.from({ length: REDIRECT_REQUESTS }, (_, index) => {
    const language = index % 2 === 0 ? "zh" : "en";
    const path = index % 3 === 0 ? "/download" : "/";
    return {
      requestPath: `${path}?lang=${language}`,
      expectedLocation: `${PRODUCTION_ORIGIN}${path}?lang=${language}`,
    };
  });
  const concurrency = Math.min(STRESS_CONCURRENCY, 48);
  const startedAt = performance.now();
  const results = await mapWithConcurrency(cases, concurrency, async (entry) => ({
    entry,
    response: await requestPage(entry.requestPath, LEGACY_HOST),
  }));
  const elapsedMs = performance.now() - startedAt;

  for (const { entry, response } of results) {
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), entry.expectedLocation);
  }

  t.diagnostic(formatMetrics(
    "legacy redirects",
    cases.length,
    concurrency,
    elapsedMs,
    results.map(({ response }) => response.elapsedMs),
  ));
});

test("serves a complete high-volume mixed-language batch with zero failures", async (t) => {
  const cases = Array.from({ length: STRESS_REQUESTS }, (_, index) => (
    index % 4 === 0
      ? { path: "/?lang=zh", lang: "zh" }
      : { path: index % 4 === 1 ? "/?lang=en" : "/", lang: "en" }
  ));
  const startedAt = performance.now();
  const results = await mapWithConcurrency(cases, STRESS_CONCURRENCY, async (entry) => ({
    entry,
    response: await requestPage(entry.path),
  }));
  const elapsedMs = performance.now() - startedAt;

  for (const { entry, response } of results) {
    assertCompletePage(response, entry.lang);
  }

  t.diagnostic(formatMetrics(
    "mixed render batch",
    cases.length,
    STRESS_CONCURRENCY,
    elapsedMs,
    results.map(({ response }) => response.elapsedMs),
  ));
});
