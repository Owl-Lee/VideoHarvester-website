import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";

for (const [route, lang, phrase] of [["", "en", "Save the videos you value"], ["zh/", "zh-CN", "把喜欢的视频"]]) {
  test(`static ${lang} content, metadata and local assets`, async () => {
    const html = await readFile(`dist-pages/${route}index.html`, "utf8");
    assert.ok(html.includes(`<html lang="${lang}">`));
    assert.ok(html.includes(phrase));
    assert.ok(html.includes(`rel="canonical" href="https://videoharvester.app/${route}"`));
    assert.ok(!html.includes("<!--app-->"));
    assert.ok(!html.includes("<!--metadata-->"));
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const url = match[1];
      if (/\.(?:png|js|css)$/.test(url) && !url.startsWith("https:")) {
        const asset = url.includes("/assets/") ? `assets/${url.split("/assets/")[1]}` : path.posix.basename(url);
        await access(path.join("dist-pages", asset));
      }
    }
    assert.match(html, /releases\/download\/v2\.0\.3\/VideoHarvester-v2\.0-Full.zip/);
  });
}
