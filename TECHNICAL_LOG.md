# VideoHarvester 官网技术日志

## 2026-10-01：合并官网改版，等待视觉预览

### 目标与范围

将 `redesign/site-2026-10-01` 合并到官网 `main`，预览确认后发布至 `videoharvester.app`。保留中英文、截图放大、下载与文件校验功能。

### 版本与实现

- 原主分支及当前线上版本：`7d317aed13ede452ee856332326a2448d4c137e3`，Sites 版本 11。
- 改版分支：`cfc2629`，已 fast-forward 合并到本地主分支，无冲突。
- 改版统一字体、蓝白配色、功能卡片、导航、下载卡片与动画，并通过 Google Fonts 加载 Geist、Geist Mono 和 Noto Sans SC；无法连接字体服务时使用系统后备字体。Google Fonts 是额外外部网络依赖，国内可达性尚未验证。
- 审查发现 400px 以下 `.brand > span` 会同时隐藏图标和名称；改为仅隐藏非图标文字，保留品牌图标与回到顶部入口。
- 未更改软件安装包或软件 Release；当前网站依然使用 v2.0.3 下载信息。

### 验证结果

- 本地预览服务 `http://localhost:3001/` 返回 HTTP 200。
- Vinext 生产构建通过。
- 4 项回归测试通过：英文渲染与元数据、中文渲染与元数据、旧域名跳转、真实截图文件。
- `git diff --check` 通过。
- Sites 构建辅助脚本因本机包管理器路径问题失败，改用已安装的同版本 Vinext CLI 完成相同生产构建。
- 浏览器拒绝访问本地预览，原因是无法验证已保存的浏览器权限；没有绕过权限检查，尚未完成本轮视觉与点击验收。

### 发布状态与下一步

本轮仅完成本地合并与修正，尚未推送或发布。按用户“预览确认后发布”的顺序，等待浏览器权限恢复或用户直接确认本地预览。确认后使用 Sites 流程推送、打包、保存版本并部署。

当前保留线上版本 11 作为回退版本；未删除历史版本或用户文件。源码、此日志及构建均保留于本 E 盘项目。

> 原桌面《VideoHarvester工程交接文档.md》在历史路径下已不存在，本次没有重建桌面副本。本文件作为官网项目后续持续维护的主技术日志。

## 2026-10-01：GitHub Pages 自动发布已验证，域名切换待完成

本节取代上一节的待发布方案：用户改为要求迁移到 GitHub Pages，让 Claude 后续通过 GitHub 更新官网。

### 实现与发布证据

- 新建独立公开官网仓库：https://github.com/Owl-Lee/VideoHarvester-website 。软件仓库和 Release 未改动。
- 提交 `f73c65b` 增加静态构建、中英文预渲染、项目路径资源适配和自动发布工作流。原 Vinext 构建保留作为回退资源。
- 英文首页与 `/zh/` 中文页都有完整静态内容和对应元数据；旧 `?lang=zh` / `?lang=en` 入口由客户端转到对应语言路径。
- `main` 推送后自动安装依赖、构建、测试并发布；`github-pages` 环境没有必需审核人。分支修改必须先合并到 `main` 才发布。平台或组织以后添加保护规则时仍可能需要审批。
- 本地静态构建成功，2 项静态页面测试通过，`git diff --check` 通过。
- Actions 运行 `36959967438`、`36959975913` 均成功，包含构建、测试与 Pages 部署。
- 临时公开地址：https://owl-lee.github.io/VideoHarvester-website/ ，中文：https://owl-lee.github.io/VideoHarvester-website/zh/ 。两页 HTTP 200，预渲染语言正确，主截图 HTTP 200。
- 提供 `CLAUDE.md`，说明代码修改、验证、发布与软件仓库边界。

### 尚未完成与安全边界

- 浏览器保存权限校验失败，无法访问 Name.com 管理页；没有绕过权限检查，没有更改 DNS。
- `videoharvester.app` 仍由原 Sites 版本 11 承载，尚不能声称正式域名已迁移。Pages 自定义域名也尚未设置，临时地址仍可用于验收。
- 本轮完成 HTTP 和静态文件验证，尚未完成真实浏览器的点击、移动端和视觉验收；国内运营商访问也未验证。
- 切换顺序：先设置 GitHub Pages 自定义域名并重新构建根路径，再修改 Name.com DNS。根域 A 记录使用 GitHub 官方的四个地址（185.199.108.153、185.199.109.153、185.199.110.153、185.199.111.153）；www CNAME 指向 owl-lee.github.io。核对并替换冲突的旧网站记录，保留无关 MX/TXT，检查已有 AAAA 是否冲突。
- 等待 DNS 和 HTTPS 证书就绪，确认根域、www、中英文、截图与下载后才算正式迁移完成。`.app` 必须使用有效 HTTPS；切换期间不能保证零中断。
- GitHub 官方说明：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- 未清理用户文件或历史版本；原站保留作为回退。后续日常修改不需要 Sites 发布审批，但 Claude 本身的提交/推送权限仍由其运行环境决定。
