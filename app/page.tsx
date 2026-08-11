const features = [
  {
    number: "01",
    title: "下载前先看清楚",
    text: "先确认视频数量、预计画质、文件大小与保存位置，再决定是否开始。",
  },
  {
    number: "02",
    title: "合集自动整理",
    text: "识别 YouTube 播放列表与 B站合集，自动建文件夹并按顺序编号。",
  },
  {
    number: "03",
    title: "进度真的看得懂",
    text: "当前任务、整体进度、速度和剩余时间集中显示，慢的时候也知道它仍在工作。",
  },
  {
    number: "04",
    title: "中断以后接着来",
    text: "保存未完成队列，重新打开即可继续；已经下载过的内容默认不会重复。",
  },
];

const questions = [
  {
    question: "它能下载所有网站吗？",
    answer:
      "软件使用 yt-dlp 作为解析核心，能处理许多公开视频网站，并针对 YouTube 与 B站列表做了额外适配。网站结构变化、登录权限、地区限制或 DRM 内容仍可能无法处理。",
  },
  {
    question: "完整版和轻量版有什么区别？",
    answer:
      "完整版已经包含解析、合并和 JavaScript 运行组件，解压即可使用；轻量版体积很小，首次运行时需要联网下载这些组件。给家人朋友使用更推荐完整版。",
  },
  {
    question: "会上传我的链接或浏览器数据吗？",
    answer:
      "不会。VideoHarvester 在你的 Windows 电脑本地运行，没有账号系统和遥测。只有主动勾选浏览器登录时，解析组件才会在本机读取相应登录状态。",
  },
  {
    question: "为什么 Windows 可能弹出安全提醒？",
    answer:
      "当前版本尚未购买商业代码签名证书。请只从本页或项目的 GitHub Releases 下载，并核对版本说明。",
  },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-play" />
    </span>
  );
}

function ProductPreview() {
  return (
    <div className="product-preview" aria-label="VideoHarvester 软件界面示意图">
      <div className="window-bar">
        <div className="mini-brand">
          <BrandMark />
          <span>VideoHarvester</span>
        </div>
        <div className="window-actions" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="window-body">
        <div className="field-label">
          <span>视频页面链接</span>
          <small>每行一个</small>
        </div>
        <div className="url-field">https://www.bilibili.com/video/BV...</div>
        <div className="settings-row">
          <div>
            <small>保存位置</small>
            <div className="mini-field">D:\Videos\VideoHarvester</div>
          </div>
          <div>
            <small>下载画质</small>
            <div className="mini-field quality-field">1080p</div>
          </div>
        </div>
        <div className="chips">
          <span>使用浏览器登录</span>
          <span>智能询问</span>
          <button type="button">开始下载</button>
        </div>
        <div className="task-panel">
          <div className="task-head">
            <strong>正在下载第 4 / 12 个视频</strong>
            <span>67%</span>
          </div>
          <div className="progress-track">
            <span />
          </div>
          <div className="task-copy">
            <span>Beyond 经典现场 · 海阔天空</span>
            <small>8.4 MB/s · 剩余 00:18</small>
          </div>
          <div className="task-list">
            <span className="done-dot">✓</span>
            <p><b>03 - 光辉岁月.mp4</b><small>下载完成</small></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="VideoHarvester 首页">
          <BrandMark />
          <span>
            <strong>VideoHarvester</strong>
            <small>本地视频保存工具</small>
          </span>
        </a>
        <nav aria-label="主导航">
          <a href="#features">功能</a>
          <a href="#download">下载</a>
          <a href="#faq">常见问题</a>
          <a className="nav-github" href="#publish">GitHub <span>↗</span></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> Windows 原生软件 · 只在本机运行</div>
          <h1>把喜欢的视频，<br /><em>安稳地保存下来。</em></h1>
          <p>
            粘贴链接，确认内容，然后交给它。单个视频、YouTube 播放列表与
            B站合集，都用一种清楚、安静的方式处理。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#download">免费下载 <span>↓</span></a>
            <a className="secondary-button" href="#how">看看怎么用 <span>→</span></a>
          </div>
          <div className="hero-notes">
            <span>✓ 无广告</span>
            <span>✓ 无账号</span>
            <span>✓ Windows 10 / 11</span>
          </div>
        </div>
        <div className="hero-visual">
          <ProductPreview />
          <div className="floating-card float-top"><span>✓</span><p><b>已识别 12 个视频</b><small>合集将自动整理</small></p></div>
          <div className="floating-card float-bottom"><span>↓</span><p><b>任务可以恢复</b><small>关闭后下次继续</small></p></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="产品特性">
        <span>YT-DLP 驱动</span><i />
        <span>FFmpeg 合并</span><i />
        <span>列表智能识别</span><i />
        <span>本地隐私优先</span>
      </section>

      <section className="section features-section" id="features">
        <div className="section-heading">
          <div><span className="section-kicker">功能</span><h2>少一点折腾，<br />多一点确定。</h2></div>
          <p>它不会把一堆技术输出甩给你。正常信息留在任务中心，真正需要排查时，再一键复制完整诊断日志。</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <div className={`feature-visual visual-${feature.number}`} aria-hidden="true">
                <span /><span /><span />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section workflow-section" id="how">
        <div className="workflow-copy">
          <span className="section-kicker">三步完成</span>
          <h2>第一次打开，<br />也知道该做什么。</h2>
          <p>没有命令行，没有配置文件，也没有藏起来的复杂操作。</p>
          <ol>
            <li><span>1</span><div><b>粘贴视频页面链接</b><small>多个链接可以每行放一个</small></div></li>
            <li><span>2</span><div><b>查看下载前确认</b><small>数量、画质、大小和保存位置一目了然</small></div></li>
            <li><span>3</span><div><b>等待任务完成</b><small>单条可以直接播放，批量只汇总一次</small></div></li>
          </ol>
        </div>
        <div className="preflight-card">
          <div className="preflight-top"><span>下载前确认</span><i>×</i></div>
          <div className="preflight-title"><small>已识别</small><h3>《Beyond 经典现场》</h3></div>
          <div className="preflight-grid">
            <p><small>类型</small><b>合集 · 12 个视频</b></p>
            <p><small>预计实际画质</small><b>1080p</b></p>
            <p><small>预计大小</small><b>约 3.8 GB</b></p>
            <p><small>磁盘剩余</small><b>128.6 GB</b></p>
          </div>
          <div className="preflight-path"><small>保存至</small><span>D:\Videos\Beyond 经典现场</span></div>
          <div className="preflight-actions"><button type="button">取消</button><button type="button">确认下载</button></div>
        </div>
      </section>

      <section className="section download-section" id="download">
        <div className="download-heading">
          <span className="section-kicker">下载</span>
          <h2>选择适合你的版本。</h2>
          <p>两个版本的软件功能完全相同。</p>
        </div>
        <div className="download-grid">
          <article className="download-card recommended">
            <span className="recommend-pill">推荐</span>
            <div className="download-icon full-icon"><BrandMark /></div>
            <p className="version-label">完整版</p>
            <h3>解压以后，直接使用。</h3>
            <p>已经包含 yt-dlp、FFmpeg 与 Deno。最适合分享给家人朋友。</p>
            <div className="size-row"><b>约 195 MB</b><span>Windows 10 / 11</span></div>
            <a href="#publish">下载完整版 <span>↓</span></a>
          </article>
          <article className="download-card">
            <div className="download-icon lite-icon">L</div>
            <p className="version-label">轻量版</p>
            <h3>更小，但首次需要联网。</h3>
            <p>程序会在第一次下载时自动准备所需组件，适合网络稳定的用户。</p>
            <div className="size-row"><b>约 31 KB</b><span>首次联网准备</span></div>
            <a className="light-button" href="#publish">下载轻量版 <span>↓</span></a>
          </article>
        </div>
        <div className="publish-note" id="publish">
          <span className="publish-dot" />
          <div><b>v2.0.0 发布包已经准备完成</b><p>GitHub Releases 地址绑定后，这里的按钮会直接提供下载。</p></div>
          <a href="https://github.com" target="_blank" rel="noreferrer">前往 GitHub <span>↗</span></a>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="faq-heading"><span className="section-kicker">常见问题</span><h2>你可能想知道的。</h2></div>
        <div className="faq-list">
          {questions.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary><span>{item.question}</span><i>+</i></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div className="final-orb orb-one" />
        <div className="final-orb orb-two" />
        <BrandMark />
        <span className="section-kicker">VideoHarvester</span>
        <h2>链接准备好了？<br />剩下的交给它。</h2>
        <p>免费、本地运行，并且把每一步说清楚。</p>
        <a href="#download">选择下载版本 <span>↓</span></a>
      </section>

      <footer>
        <div className="footer-brand"><BrandMark /><span><b>VideoHarvester</b><small>本地视频保存工具</small></span></div>
        <p>仅用于保存你有权下载和使用的内容。不绕过 DRM、付费墙或账号权限。</p>
        <div><a href="#faq">使用说明</a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a><span>© 2026 VideoHarvester</span></div>
      </footer>
    </main>
  );
}
