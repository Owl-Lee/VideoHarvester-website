import { build } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const base = process.env.PAGES_BASE || "/";
await build({ configFile: "vite.pages.config.ts" });
await build({ configFile: "vite.pages.config.ts", publicDir: false, build: {
  ssr: path.resolve("pages/render.tsx"), outDir: "../work/pages-ssr", emptyOutDir: true,
  rollupOptions: { output: { entryFileNames: "render.mjs" } },
}});
const { render, metadataText, SITE_URL } = await import(pathToFileURL(path.resolve("work/pages-ssr/render.mjs")));
const template = await readFile("dist-pages/index.html", "utf8");
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
for (const lang of ["en", "zh"]) {
  const copy = metadataText[lang];
  const url = SITE_URL + (lang === "zh" ? "/zh/" : "/");
  const meta = `<title>${escape(copy.title)}</title><meta name="description" content="${escape(copy.description)}"><link rel="icon" href="${base}favicon.png"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="en" href="${SITE_URL}/"><link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/zh/"><link rel="alternate" hreflang="x-default" href="${SITE_URL}/"><meta property="og:title" content="${escape(copy.title)}"><meta property="og:description" content="${escape(copy.socialDescription)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="${lang === "zh" ? "zh_CN" : "en_US"}"><meta property="og:image" content="${SITE_URL}/og.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(copy.title)}"><meta name="twitter:description" content="${escape(copy.socialDescription)}"><meta name="twitter:image" content="${SITE_URL}/og.png">`;
  const html = template.replace('lang="en"', `lang="${lang === "zh" ? "zh-CN" : "en"}"`).replace("<!--metadata-->", meta).replace("<!--app-->", render(lang, base));
  const folder = lang === "zh" ? "dist-pages/zh" : "dist-pages";
  await mkdir(folder, { recursive: true });
  await writeFile(`${folder}/index.html`, html);
}
await writeFile("dist-pages/.nojekyll", "");
console.log("Static English and Chinese pages ready in dist-pages.");
