# VideoHarvester 官网

VideoHarvester 是一款本地运行的 Windows 视频保存工具。这个仓库包含产品官网，页面用于介绍功能、区分轻量版与完整版，并最终连接 GitHub Releases 下载。

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
```

## 发布前要做的事

1. 将页面中的 GitHub 链接替换成项目仓库地址。
2. 在 GitHub Releases 上传轻量版和完整版压缩包。
3. 补齐 `THIRD_PARTY_NOTICES`、yt-dlp/Deno/FFmpeg 许可证，以及与 FFmpeg 二进制对应的源码下载入口。
4. 只宣传保存用户有权下载和使用的内容；不宣传绕过 DRM、付费墙或账号权限。

## 技术说明

- React 19
- Vinext / Vite
- Cloudflare Workers 兼容构建
- 无数据库、无用户账号、无遥测

