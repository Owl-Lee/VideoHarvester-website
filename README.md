# VideoHarvester Website

**English** · [简体中文](#简体中文) · [Live site](https://videoharvester.app/) · [Public repository](https://github.com/Owl-Lee/VideoHarvester)

This repository contains the bilingual product website for VideoHarvester, a local Windows application for saving videos that the user is authorized to download. The site explains the product, compares the Full and Lite editions, and links directly to verified GitHub Release packages.

## Run locally

Requires Node.js 22.13 or later.

```bash
pnpm install
pnpm dev
```

Create a production build:

```bash
pnpm build
```

## Release checklist

1. Confirm that every public link points to `Owl-Lee/VideoHarvester` or `videoharvester.app`.
2. Confirm that the Full and Lite release packages exist and can be downloaded anonymously.
3. Keep `THIRD_PARTY_NOTICES`, yt-dlp/Deno/FFmpeg license information, and the FFmpeg source link current.
4. Describe only authorized downloading; never advertise bypassing DRM, paywalls, or account permissions.

## Technology

- React 19
- Vinext / Vite
- Cloudflare Workers 兼容构建
- No database, user accounts, or telemetry

---

## 简体中文

**[English](#videoharvester-website)** · 简体中文 · [访问网站](https://videoharvester.app/) · [公开仓库](https://github.com/Owl-Lee/VideoHarvester)

本仓库包含 VideoHarvester 的中英文产品官网。VideoHarvester 是一款本地运行的 Windows 视频保存工具，面向有权下载相关内容的用户。网站负责介绍功能、区分完整版与轻量版，并直接连接已经核验的 GitHub Releases 安装包。

### 本地运行

需要 Node.js 22.13 或更高版本。

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
```

### 发布检查

1. 确认所有公开链接指向 `Owl-Lee/VideoHarvester` 或 `videoharvester.app`。
2. 确认完整版和轻量版安装包存在，并且未登录访客也能下载。
3. 保持 `THIRD_PARTY_NOTICES`、yt-dlp/Deno/FFmpeg 许可证信息和 FFmpeg 源码链接最新。
4. 只描述用户有权保存的内容；不宣传绕过 DRM、付费墙或账号权限。

### 技术说明

- React 19
- Vinext / Vite
- Cloudflare Workers 兼容构建
- 无数据库、无用户账号、无遥测
