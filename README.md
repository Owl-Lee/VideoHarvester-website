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
pnpm build:pages
```

## Automatic publishing (Claude and other contributors)

The website repository is `Owl-Lee/VideoHarvester-website`. Edit `app/home-client.tsx`, `app/globals.css`, or `app/site-data.ts`, run `pnpm build:pages` and `node --test tests/static-pages.test.mjs`, then push to `main`. GitHub Actions builds and publishes the website automatically; no ChatGPT/Sites approval is involved. Repository write access is required. A feature branch is not published until merged into `main`.

Pages serves pre-rendered English `/` and Chinese `/zh/` pages. Legacy `?lang=zh` and `?lang=en` links remain supported. `PAGES_BASE` is supplied by the Pages configuration, so the same build supports the GitHub project URL and the custom domain. The original Vinext/Worker build remains available as `pnpm build` for rollback; it is not used by Pages.

## Release checklist

1. Confirm that every public link points to `Owl-Lee/VideoHarvester` or `videoharvester.app`.
2. Confirm that the Full and Lite release packages exist and can be downloaded anonymously.
3. Keep `THIRD_PARTY_NOTICES`, yt-dlp/Deno/FFmpeg license information, and the FFmpeg source link current.
4. Describe only authorized downloading; never advertise bypassing DRM, paywalls, or account permissions.

## Technology

- React 19
- Vinext / Vite
- GitHub Pages static hosting with GitHub Actions
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
pnpm build:pages
```

### 自动发布（供 Claude 和其他开发者使用）

官网仓库为 `Owl-Lee/VideoHarvester-website`。修改 `app/home-client.tsx`、`app/globals.css` 或 `app/site-data.ts`，运行 `pnpm build:pages` 和 `node --test tests/static-pages.test.mjs`，再推送到 `main`。GitHub Actions 会自动构建并发布，无须 ChatGPT/Sites 审批，但操作者必须有仓库写权限。其他分支须合并进 `main` 才会发布。

英文首页 `/` 和中文 `/zh/` 均预渲染为静态 HTML，旧 `?lang=zh`、`?lang=en` 链接继续兼容。部署流程根据 Pages 配置自动设置资源前缀，兼容 GitHub 项目地址及自定义域名。原 Vinext/Worker 构建 `pnpm build` 保留作回退，不用于 Pages 发布。

### 发布检查

1. 确认所有公开链接指向 `Owl-Lee/VideoHarvester` 或 `videoharvester.app`。
2. 确认完整版和轻量版安装包存在，并且未登录访客也能下载。
3. 保持 `THIRD_PARTY_NOTICES`、yt-dlp/Deno/FFmpeg 许可证信息和 FFmpeg 源码链接最新。
4. 只描述用户有权保存的内容；不宣传绕过 DRM、付费墙或账号权限。

### 技术说明

- React 19
- Vinext / Vite
- GitHub Pages 静态托管与 GitHub Actions 自动发布
- 无数据库、无用户账号、无遥测
