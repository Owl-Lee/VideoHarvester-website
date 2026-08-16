"use client";

import { useEffect, useState } from "react";

type Lang = "zh" | "en";
type LocalText = { zh: string; en: string };

const features: Array<{ number: string; title: LocalText; text: LocalText; image?: string }> = [
  {
    number: "01",
    title: { zh: "下载前先看清楚", en: "Know before you download" },
    text: {
      zh: "先确认视频数量、预计画质、文件大小与保存位置，再决定是否开始。",
      en: "Review the item count, expected quality, file size, and destination before anything starts.",
    },
    image: "/app-preflight-confirm-real.png",
  },
  {
    number: "02",
    title: { zh: "合集自动整理", en: "Collections stay organized" },
    text: {
      zh: "识别 YouTube 播放列表与B站合集，自动建文件夹并按顺序编号。",
      en: "Recognizes YouTube playlists and Bilibili collections, then creates folders and numbered files.",
    },
    image: "/app-bili-collection-real.png",
  },
  {
    number: "03",
    title: { zh: "进度真的看得懂", en: "Progress you can understand" },
    text: {
      zh: "当前任务、整体进度、速度和剩余时间集中显示，慢的时候也知道它仍在工作。",
      en: "See the current task, total queue, speed, and time remaining—even when a site responds slowly.",
    },
    image: "/app-queue-complete-real.png",
  },
  {
    number: "04",
    title: { zh: "中断以后接着来", en: "Resume where you left off" },
    text: {
      zh: "保存未完成队列，重新打开即可继续；已经下载过的内容默认不会重复。",
      en: "Unfinished queues are remembered, and completed media is identified by its platform ID.",
    },
    image: "/app-resume-queue-real.png",
  },
];

const questions: Array<{ question: LocalText; answer: LocalText }> = [
  {
    question: { zh: "它能下载所有网站吗？", en: "Does it work with every website?" },
    answer: {
      zh: "软件使用 yt-dlp 作为解析核心，能处理许多公开视频网站，并针对 YouTube 与B站列表做了额外适配。网站结构变化、登录权限、地区限制或 DRM 内容仍可能无法处理。",
      en: "VideoHarvester uses yt-dlp and supports many public video sites, with extra handling for YouTube and Bilibili lists. Site changes, account permissions, regional restrictions, and DRM may still prevent access.",
    },
  },
  {
    question: { zh: "完整版和轻量版有什么区别？", en: "What is the difference between Full and Lite?" },
    answer: {
      zh: "完整版已经包含解析、合并和 JavaScript 运行组件，解压即可使用；轻量版体积很小，首次运行时需要联网下载这些组件。给家人朋友使用更推荐完整版。",
      en: "Full includes yt-dlp, FFmpeg, and Deno and works immediately after extraction. Lite is tiny but downloads those components on first use. Full is the easiest version to share.",
    },
  },
  {
    question: { zh: "会上传我的链接或浏览器数据吗？", en: "Does it upload my links or browser data?" },
    answer: {
      zh: "不会。VideoHarvester 在你的 Windows 电脑本地运行，没有账号系统和遥测。只有主动勾选浏览器登录时，解析组件才会在本机读取相应登录状态。",
      en: "No. VideoHarvester runs locally on your Windows PC, with no account system or telemetry. Browser session data is read locally only when you explicitly enable that option.",
    },
  },
  {
    question: { zh: "为什么 Windows 可能弹出安全提醒？", en: "Why might Windows show a security warning?" },
    answer: {
      zh: "当前版本尚未购买商业代码签名证书。请只从本页或项目的 GitHub Releases 下载，并核对版本说明。",
      en: "The current build does not yet have a commercial code-signing certificate. Download only from this site or the official GitHub Releases page and check the version notes.",
    },
  },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-play" />
    </span>
  );
}

function ProductPreview({ lang }: { lang: Lang }) {
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  return (
    <div className="actual-preview">
      <div className="actual-window-bar">
        <span><i /> VideoHarvester.exe</span>
        <small>{t("产品界面预览 · Windows 11", "Interface preview · Windows 11")}</small>
      </div>
      <div className="screenshot-wrap">
        <img
          src="/app-main-window-real.png"
          alt={t("VideoHarvester Windows 软件界面预览", "VideoHarvester Windows interface preview")}
        />
      </div>
      <div className="real-capture-note">
        <span className="live-dot" />
        <p>
          <b>{t("真实软件截图", "Real product screenshot")}</b>
          <small>{t("下载队列、进度和诊断信息均来自实际运行界面。", "The queue, progress, and diagnostics shown are from the running app.")}</small>
        </p>
      </div>
      <div className="actual-caption">
        <span className="live-dot" />
        <p>
          <b>{t("产品界面预览", "Product interface preview")}</b>
          <small>{t("真实软件截图将陆续更新", "Real app screenshots will be added soon")}</small>
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const saved = window.localStorage.getItem("vh-language");
      if (saved === "en" || saved === "zh") setLang(saved);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem("vh-language", lang);
  }, [lang]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="VideoHarvester">
          <BrandMark />
          <span>
            <strong>VideoHarvester</strong>
            <small>{t("本地视频保存工具", "Local video saver")}</small>
          </span>
        </a>
        <nav aria-label={t("主导航", "Main navigation")}>
          <a href="#features">{t("功能", "Features")}</a>
          <a href="#download">{t("下载", "Download")}</a>
          <a href="#faq">{t("常见问题", "FAQ")}</a>
          <div className="language-switch" aria-label={t("切换语言", "Change language")}>
            <button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")} type="button">中文</button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} type="button">EN</button>
          </div>
          <a className="nav-github" href="https://github.com/Owl-Lee/VideoHarvester" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> {t("Windows 原生软件 · 只在本机运行", "Native Windows app · Runs locally")}</div>
          <h1>
            {lang === "zh" ? <>把喜欢的视频，<br /><em>安稳地保存下来。</em></> : <>Save the videos you value—<br /><em>safely and locally.</em></>}
          </h1>
          <p>
            {t(
              "粘贴链接，确认内容，然后交给它。单个视频、YouTube 播放列表与B站合集，都用一种清楚、安静的方式处理。",
              "Paste a link, review what was found, and let it handle the rest. Single videos, YouTube playlists, and Bilibili collections all follow one clear workflow."
            )}
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#download">{t("免费下载", "Free download")} <span>↓</span></a>
            <a className="secondary-button" href="#how">{t("看看怎么用", "See how it works")} <span>→</span></a>
          </div>
          <div className="hero-notes">
            <span>✓ {t("无广告", "No ads")}</span>
            <span>✓ {t("无账号", "No account")}</span>
            <span>✓ Windows 10 / 11</span>
          </div>
        </div>
        <div className="hero-visual real-hero-visual">
          <ProductPreview lang={lang} />
          <div className="floating-card float-top"><span>✓</span><p><b>{t("产品界面预览", "Product preview")}</b><small>{t("真实截图将陆续更新", "Real screenshots coming soon")}</small></p></div>
          <div className="floating-card float-bottom"><span>↓</span><p><b>{t("任务可以恢复", "Resumable queue")}</b><small>{t("关闭后下次继续", "Continue after restarting")}</small></p></div>
        </div>
      </section>

      <section className="trust-strip" aria-label={t("产品特性", "Product capabilities")}>
        <span>YT-DLP {t("驱动", "powered")}</span><i />
        <span>FFmpeg {t("合并", "processing")}</span><i />
        <span>{t("列表智能识别", "Smart list detection")}</span><i />
        <span>{t("本地隐私优先", "Local-first privacy")}</span>
      </section>

      <section className="section features-section" id="features">
        <div className="section-heading">
          <div><span className="section-kicker">{t("功能", "Features")}</span><h2>{lang === "zh" ? <>少一点折腾，<br />多一点确定。</> : <>Less friction.<br />More certainty.</>}</h2></div>
          <p>{t("它不会把一堆技术输出甩给你。正常信息留在任务中心，真正需要排查时，再一键复制完整诊断日志。", "Friendly updates stay in the task center. When troubleshooting is actually needed, the full technical log is still one click away.")}</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <div className={`feature-visual visual-${feature.number}`} aria-hidden="true">
                {feature.image ? <img src={feature.image} alt="" /> : <><span /><span /><span /></>}
              </div>
              <h3>{feature.title[lang]}</h3>
              <p>{feature.text[lang]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section workflow-section" id="how">
        <div className="workflow-copy">
          <span className="section-kicker">{t("三步完成", "Three simple steps")}</span>
          <h2>{lang === "zh" ? <>第一次打开，<br />也知道该做什么。</> : <>Clear from the<br />very first launch.</>}</h2>
          <p>{t("没有命令行，没有配置文件，也没有藏起来的复杂操作。", "No command line, no configuration files, and no hidden setup maze.")}</p>
          <ol>
            <li><span>1</span><div><b>{t("粘贴视频页面链接", "Paste a video page link")}</b><small>{t("多个链接可以每行放一个", "Add multiple links, one per line")}</small></div></li>
            <li><span>2</span><div><b>{t("查看下载前确认", "Review the preflight summary")}</b><small>{t("数量、画质、大小和保存位置一目了然", "Confirm count, quality, size, and destination")}</small></div></li>
            <li><span>3</span><div><b>{t("等待任务完成", "Let the queue finish")}</b><small>{t("单条可以直接播放，批量只汇总一次", "Open single items or get one clean batch summary")}</small></div></li>
          </ol>
        </div>
      </section>

      <section className="section download-section" id="download">
        <div className="download-heading">
          <span className="section-kicker">{t("下载", "Download")}</span>
          <h2>{t("选择适合你的版本。", "Choose the version that fits.")}</h2>
          <p>{t("两个版本的软件功能完全相同。", "Both editions include the same app features.")}</p>
        </div>
        <div className="download-grid">
          <article className="download-card recommended">
            <span className="recommend-pill">{t("推荐", "Recommended")}</span>
            <div className="download-icon full-icon"><BrandMark /></div>
            <p className="version-label">{t("完整版", "Full edition")}</p>
            <h3>{t("解压以后，直接使用。", "Extract it and get started.")}</h3>
            <p>{t("已经包含 yt-dlp、FFmpeg 与 Deno。最适合分享给家人朋友。", "Includes yt-dlp, FFmpeg, and Deno. The easiest choice for most people.")}</p>
            <div className="size-row"><b>{t("约 195 MB", "About 195 MB")}</b><span>Windows 10 / 11</span></div>
            <a href="https://github.com/Owl-Lee/VideoHarvester/releases/latest/download/VideoHarvester-v2.0-Full.zip">{t("下载完整版", "Download Full")} <span>↓</span></a>
          </article>
          <article className="download-card">
            <div className="download-icon lite-icon">L</div>
            <p className="version-label">{t("轻量版", "Lite edition")}</p>
            <h3>{t("更小，但首次需要联网。", "Tiny, with a one-time setup.")}</h3>
            <p>{t("程序会在第一次下载时自动准备所需组件，适合网络稳定的用户。", "Required components are downloaded automatically on first use. Best with a reliable connection.")}</p>
            <div className="size-row"><b>{t("约 140 KB", "About 140 KB")}</b><span>{t("首次联网准备", "Online first-run setup")}</span></div>
            <a className="light-button" href="https://github.com/Owl-Lee/VideoHarvester/releases/latest/download/VideoHarvester-v2.0-Lite.zip">{t("下载轻量版", "Download Lite")} <span>↓</span></a>
          </article>
        </div>
        <div className="publish-note ready" id="publish">
          <span className="publish-dot" />
          <div><b>GitHub: Owl-Lee/VideoHarvester</b><p>{t("下载由 GitHub Releases 提供，页面始终指向最新正式版本。", "Downloads are served by GitHub Releases and always point to the latest stable build.")}</p></div>
          <a href="https://github.com/Owl-Lee/VideoHarvester/releases/latest" target="_blank" rel="noreferrer">{t("查看最新版本", "View latest release")} <span>↗</span></a>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="faq-heading"><span className="section-kicker">{t("常见问题", "FAQ")}</span><h2>{t("你可能想知道的。", "Good things to know.")}</h2></div>
        <div className="faq-list">
          {questions.map((item, index) => (
            <details key={item.question.en} open={index === 0}>
              <summary><span>{item.question[lang]}</span><i>+</i></summary>
              <p>{item.answer[lang]}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div className="final-orb orb-one" /><div className="final-orb orb-two" />
        <BrandMark />
        <span className="section-kicker">VideoHarvester</span>
        <h2>{lang === "zh" ? <>链接准备好了？<br />剩下的交给它。</> : <>Got the link?<br />It can take it from here.</>}</h2>
        <p>{t("免费、本地运行，并且把每一步说清楚。", "Free, local, and clear about every step.")}</p>
        <a href="#download">{t("选择下载版本", "Choose a download")} <span>↓</span></a>
      </section>

      <footer>
        <div className="footer-brand"><BrandMark /><span><b>VideoHarvester</b><small>{t("本地视频保存工具", "Local video saver")}</small></span></div>
        <p>{t("仅用于保存你有权下载和使用的内容。不绕过 DRM、付费墙或账号权限。", "Use only for media you have the right to save. VideoHarvester does not bypass DRM, paywalls, or account permissions.")}</p>
        <div><a href="#faq">{t("使用说明", "Guide")}</a><a href="https://github.com/Owl-Lee/VideoHarvester" target="_blank" rel="noreferrer">GitHub</a><span>© 2026 VideoHarvester</span></div>
      </footer>
    </main>
  );
}
