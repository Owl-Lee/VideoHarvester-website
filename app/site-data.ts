export type Lang = "zh" | "en";

export const SITE_URL = "https://videoharvester.app";
export const OLD_SITE_HOST = "video-harvester-pro.liyanbao06.chatgpt.site";

export const releaseInfo = {
  tag: "v2.0.3",
  publishedAt: "2026-08-16T20:29:02Z",
  releaseUrl: "https://github.com/Owl-Lee/VideoHarvester/releases/tag/v2.0.3",
  full: {
    sizeBytes: 204_110_453,
    sizeLabel: "194.7 MiB",
    sha256: "E52E3CACE1981173D170401BE1F51AF5B47F0482729199B6E8124E941975BCD3",
    downloadUrl: "https://github.com/Owl-Lee/VideoHarvester/releases/download/v2.0.3/VideoHarvester-v2.0-Full.zip",
  },
  lite: {
    sizeBytes: 141_237,
    sizeLabel: "137.9 KiB",
    sha256: "997EF8E683A026EFCCBEB36D6D418D0FC5EE89EC4D0DC30CB611E2307CF083FF",
    downloadUrl: "https://github.com/Owl-Lee/VideoHarvester/releases/download/v2.0.3/VideoHarvester-v2.0-Lite.zip",
  },
} as const;

export const metadataText = {
  en: {
    title: "VideoHarvester — Save videos locally, with confidence",
    description: "A clear, local-first Windows video workflow for authorized downloads. Supports single videos, YouTube playlists, and Bilibili collections.",
    socialDescription: "A clear, local-first Windows video workflow for authorized downloads.",
    imageAlt: "VideoHarvester product preview",
  },
  zh: {
    title: "VideoHarvester — 安稳地把视频保存在本地",
    description: "清楚、可靠、本地优先的 Windows 视频保存工具，支持单个视频、YouTube 播放列表与 B 站合集。",
    socialDescription: "清楚、可靠、本地优先的 Windows 视频保存流程。",
    imageAlt: "VideoHarvester 产品界面预览",
  },
} as const;

export function languageFromQuery(value: string | string[] | undefined): Lang {
  const first = Array.isArray(value) ? value[0] : value;
  return first === "zh" ? "zh" : "en";
}

export function canonicalUrl(lang: Lang): string {
  return lang === "zh" ? `${SITE_URL}/?lang=zh` : `${SITE_URL}/`;
}
