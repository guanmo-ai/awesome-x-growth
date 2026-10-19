# 插件与工具目录

由 `data/tools.json` 生成。工具页是次级入口，默认首页仍为文章。以下是研究候选；官网核验、源码阅读与接口实测不等于安装试用通过。

## Tweet Hunter X

查看作者热门推文，按关键词找内容。

> Stop doomscrolling and start exploring. A browser extension that enhances X and guides you to the best content.

[官方介绍节选](https://chromewebstore.google.com/detail/tweet-hunter-x/amoldiondpmjdnllknhklocndiibkcoe?hl=en)

AI 总结：
- 在作者主页查看热门推文，也能在侧栏搜索旧帖。
- 适合发现值得参考的作者和内容；官网的点赞、收藏搜索仍标为待推出。

- [Chrome 用户数](https://chromewebstore.google.com/detail/tweet-hunter-x/amoldiondpmjdnllknhklocndiibkcoe?hl=en)：30,000（采集于 2026-10-13T06:31:05.077330+00:00）
- 用途：在作者主页查看热门作品；写作时用侧栏搜索找回可引用的旧帖。先选 3 位同领域作者，拆解他们的开头、证据和配图。
- 值得学：把“搜一个关键词”延伸为“关键词 → 作者 → 代表作 → 相关讨论”，积累作者线索。
- 成本：官网称原有功能免费；Tweet Hunter 主产品另计。
- 使用条件：需要桌面浏览器中的 X 页面；官网提供扩展入口。
- 边界：官网仍将点赞和收藏搜索标为 Coming Soon；热门帖不等于高质量文章，当前兼容性待试。
- 核验（2026-10-12）：已读官方功能说明；未安装、未登录试用。
- [入口](https://tweethunter.io/tweethunterx)
- 来源：[官方介绍](https://tweethunter.io/tweethunterx) · [Chrome 商店 · 开发者介绍](https://chromewebstore.google.com/detail/tweet-hunter-x/amoldiondpmjdnllknhklocndiibkcoe?hl=en)

## X Search Pro

组合搜索条件，保存常用的 X 搜索。

> Build your personal X/Twitter search library. Save, categorize, color-code, and organize searches you use repeatedly.

[官方介绍节选](https://chromewebstore.google.com/detail/x-search-pro/belfofaehpmgnifoddppdfgofflnkoja?hl=en)

AI 总结：
- 保存、分类和重复使用搜索条件，减少每次重新输入。
- 打开的仍是 X 搜索结果，适合持续跟踪选题和作者。

- [Chrome 用户数](https://chromewebstore.google.com/detail/x-search-pro/belfofaehpmgnifoddppdfgofflnkoja?hl=en)：101（采集于 2026-10-13T06:31:05.415419+00:00）
- [GitHub Stars](https://github.com/neonwatty/x-search-pro)：9（采集于 2026-10-13T06:27:28.521750+00:00）
- 用途：把选题、作者、日期、最低点赞数保存成查询；分别检查最新结果和热门结果。
- 值得学：按项目保存多组查询；滑动时间窗可重复使用。先宽搜，再沿作者收窄，避免一开始堆太多筛选条件。
- 成本：MIT 源码免费；使用 X 网页搜索。
- 使用条件：从 Chrome 应用商店安装，或从源码加载；需要可用的 X 登录态。
- 边界：它构造并打开 X 搜索，不直接返回文章数据，也不提供完整索引。
- 核验（2026-10-12）：已读 README、manifest、许可证、查询构造与页面应用逻辑；未安装。
- [入口](https://github.com/neonwatty/x-search-pro) · [源码](https://github.com/neonwatty/x-search-pro) · MIT
- 来源：[源码 · lib/query-builder.js](https://github.com/neonwatty/x-search-pro/blob/1e017142355e25282daa5ab16f2de35a14b2bd60/lib/query-builder.js) · [源码 · content/content.js](https://github.com/neonwatty/x-search-pro/blob/1e017142355e25282daa5ab16f2de35a14b2bd60/content/content.js) · [Chrome 商店 · 开发者介绍](https://chromewebstore.google.com/detail/x-search-pro/belfofaehpmgnifoddppdfgofflnkoja?hl=en)

## Bookmark X

导出、分类和搜索你的 X 收藏。

> Bookmark X is an open-source Chrome extension for saving X bookmarks

[官方介绍节选](https://github.com/LucasDitchun/export-bookmarks-x-twitter/blob/933565f5d63ac26a05e677dd39cdbd2e72ee9613/README.md)

AI 总结：
- 将 X 收藏保存到本地，去重后导出 TXT 或 Markdown。
- 支持笔记、标签与检索，适合把已有收藏整理成写作素材。

- [GitHub Stars](https://github.com/LucasDitchun/export-bookmarks-x-twitter)：11（采集于 2026-10-13T06:27:28.539065+00:00）
- 用途：收藏后补一句“为什么值得留”，按主题整理；需要写作时搜索正文、作者、笔记和标签，导出 TXT / Markdown。
- 值得学：检索不必一开始就上大模型。先做字段加权检索，再按需启用本地语义检索，失败时退回普通搜索。
- 成本：MIT 源码免费；可选本地语义模型需下载约 136 MB。
- 使用条件：登录自己的 X 收藏页后主动采集；默认本地保存，可选模型从外部下载。
- 边界：只覆盖已采集的收藏；页面变化会影响提取。长文语义模型有截断限制，仍需读原文。
- 核验（2026-10-12）：已读采集说明、manifest、许可证、加权检索源码与本地语义检索文档；未采集个人收藏。
- [入口](https://github.com/LucasDitchun/export-bookmarks-x-twitter) · [源码](https://github.com/LucasDitchun/export-bookmarks-x-twitter) · MIT
- 来源：[源码 · src/domain/search-bookmarks.ts](https://github.com/LucasDitchun/export-bookmarks-x-twitter/blob/933565f5d63ac26a05e677dd39cdbd2e72ee9613/src/domain/search-bookmarks.ts) · [源码 · docs/SEMANTIC_SEARCH.md](https://github.com/LucasDitchun/export-bookmarks-x-twitter/blob/933565f5d63ac26a05e677dd39cdbd2e72ee9613/docs/SEMANTIC_SEARCH.md) · [源码 · public/manifest.json](https://github.com/LucasDitchun/export-bookmarks-x-twitter/blob/933565f5d63ac26a05e677dd39cdbd2e72ee9613/public/manifest.json) · [官方仓库 · README](https://github.com/LucasDitchun/export-bookmarks-x-twitter/blob/933565f5d63ac26a05e677dd39cdbd2e72ee9613/README.md)

## Typefully

撰写推文与长线程，定时发布、查看数据。

> The AI-powered, collaborative social media scheduler for X, LinkedIn, Bluesky, and Threads.

[官方介绍节选](https://typefully.com)

AI 总结：
- 在一个编辑器中写推文、长线程，预览后安排发布时间。
- 提供 AI 改写、团队协作和发布分析，适合已有选题后的创作与复盘。

- 用途：集中写短帖和线程，调整开头与段落，预览后排期；用自己的历史表现决定下一轮题目。
- 值得学：素材、草稿、发布和复盘分开。已有官方 MCP 可管理草稿与队列，值得评估如何让 Agent 辅助写作。
- 成本：官网提供免费计划；完整排期、分析与团队能力以当前套餐为准，价格页本轮未读到完整金额。
- 使用条件：需要 Typefully 账号；连接 X 和 MCP 需用户授权。
- 边界：适合写作与自己的内容管理，不是全网文章搜索；写作辅助不保证爆款。
- 核验（2026-10-12）：已读官方功能说明；未安装、未登录试用。
- [入口](https://typefully.com)
- 来源：[产品功能](https://typefully.com) · [官方 MCP 文档](https://support.typefully.com/en/articles/13128440-typefully-mcp-server) · [套餐入口](https://typefully.com/pricing)

## X Viral Monitor

浏览 X 时标记高互动推文，保存选题。

> Velocity badges, long-image reader, Markdown copy, supporter chart, and Grok reply drafts — all on X.

[官方介绍节选](https://chromewebstore.google.com/detail/x-viral-monitor/dkplofpecmjmbhgjgleeflcnfgfkdfpd?hl=en)

AI 总结：
- 在浏览 X 时显示热度线索，支持长图阅读和 Markdown 复制。
- 适合从时间线挑选素材；流速指标不是最近一小时的新增浏览量。

- [Chrome 用户数](https://chromewebstore.google.com/detail/x-viral-monitor/dkplofpecmjmbhgjgleeflcnfgfkdfpd?hl=en)：3,000（采集于 2026-10-13T06:31:05.266301+00:00）
- [GitHub Stars](https://github.com/Icy-Cat/x-viral-monitor)：270（采集于 2026-10-13T06:27:28.518783+00:00）
- 用途：在时间线查看收藏数、浏览量与排行榜，挑出值得细读的帖子，用 Markdown 复制保留链接。
- 值得学：把“正在看到的内容”变成研究候选；长文和短帖分开看，不用一个热度门槛筛掉所有低曝光干货。
- 成本：源码 MIT；官方版本基础功能免费，高级过滤有 Pro / 试用边界。
- 使用条件：依赖 X 页面登录态；存在远程过滤规则、许可服务及 Grok 功能，不能称完全离线。
- 边界：平均流速是总浏览量除以发布后时间，不是最近一小时的增量，也不是全 X 爆款榜。
- 核验（2026-10-12）：已读当前 README、manifest、MIT 许可与网络响应 hook；未安装或调用 Grok。
- [入口](https://github.com/Icy-Cat/x-viral-monitor) · [源码](https://github.com/Icy-Cat/x-viral-monitor) · MIT
- 来源：[源码 · README.md](https://github.com/Icy-Cat/x-viral-monitor/blob/9ba08b86007e56e1adaf445fff90bbc6833abc62/README.md) · [源码 · lib/x-net-hook.js](https://github.com/Icy-Cat/x-viral-monitor/blob/9ba08b86007e56e1adaf445fff90bbc6833abc62/lib/x-net-hook.js) · [源码 · manifest.json](https://github.com/Icy-Cat/x-viral-monitor/blob/9ba08b86007e56e1adaf445fff90bbc6833abc62/manifest.json) · [Chrome 商店 · 开发者介绍](https://chromewebstore.google.com/detail/x-viral-monitor/dkplofpecmjmbhgjgleeflcnfgfkdfpd?hl=en)

## dewey

整理 X 收藏，用标签和搜索找回素材。

> Save all your favorite bookmarks in one place.

[官方介绍节选](https://chromewebstore.google.com/detail/dewey/occohfgiljdagdmklhpplgmcnliljmgi?hl=en)

AI 总结：
- 把分散的社交收藏集中起来，按正文、标签、作者和笔记搜索。
- 支持文件夹、AI 标签、导出与 Notion 同步，适合长期整理素材。

- [Chrome 用户数](https://chromewebstore.google.com/detail/dewey/occohfgiljdagdmklhpplgmcnliljmgi?hl=en)：10,000（采集于 2026-10-13T06:31:05.035544+00:00）
- 用途：同步收藏后按主题、作者和笔记查找；需要迁移时核对导出套餐，再导入自己的素材库。
- 值得学：素材价值来自保存理由、标签、作者和主题之间的关系；收藏应能服务某个具体选题。
- 成本：有 Free 计划；Pro 页面显示 $10/月或按年计 $7.5/月，另有一次性导出方案。
- 使用条件：需要 dewey 账号及扩展；收藏进入服务端账号，先看隐私说明与所选套餐。
- 边界：本轮未验证付费导出与同步完整性；不要把扩展免费下载当成所有功能免费。
- 核验（2026-10-12）：已读官方功能说明；未安装、未登录试用。
- [入口](https://getdewey.co)
- 来源：[产品功能](https://getdewey.co) · [官方价格](https://getdewey.co/pricing/) · [扩展使用说明](https://getdewey.co/how-to-use/how-to-use-dewey-chrome-extension/) · [Chrome 商店 · 开发者介绍](https://chromewebstore.google.com/detail/dewey/occohfgiljdagdmklhpplgmcnliljmgi?hl=en)

## BookmarkBrain

用自然语言搜索收藏，回答附原帖链接。

> Chat with your X/Twitter bookmarks and Reddit saved posts using AI.

[官方介绍节选](https://chromewebstore.google.com/detail/bookmarkbrain/akdanakbhljjkieodocegjhabdijmdjd?hl=en)

AI 总结：
- 对已有的 X 收藏、Reddit 保存内容提问，回答附原帖引用。
- 适合找回记得大意却忘了出处的素材，检索范围是已保存的内容。

- [Chrome 用户数](https://chromewebstore.google.com/detail/bookmarkbrain/akdanakbhljjkieodocegjhabdijmdjd?hl=en)：10（采集于 2026-10-13T06:31:05.313011+00:00）
- [GitHub Stars](https://github.com/agoyel25/BookmarkBrain)：7（采集于 2026-10-13T06:27:28.524071+00:00）
- 用途：把已保存的素材按问题检索，得到候选与引用；适合“我收藏过哪些冷启动经验”这类问题。
- 值得学：先检索少量相关条目，再生成带来源的回答；语义检索失败可回退关键词。我们的推荐理由也应指向具体原文。
- 成本：扩展 MIT 免费；问答与语义检索使用自带模型 API Key，费用另计。
- 使用条件：收藏存本地；使用 AI 时相关文本会发往所选模型提供商。
- 边界：检索范围是已同步收藏；DOM 采集可能漏内容。附引用不代表回答的每个结论都正确。
- 核验（2026-10-12）：已读 README、manifest、MIT 许可及检索、引用和关键词回退实现；未配置 Key 或运行问答。
- [入口](https://github.com/agoyel25/BookmarkBrain) · [源码](https://github.com/agoyel25/BookmarkBrain) · MIT
- 来源：[源码 · background/service-worker.js](https://github.com/agoyel25/BookmarkBrain/blob/66a99c51547bdb130797541c50bfaf65599041b7/background/service-worker.js) · [源码 · manifest.json](https://github.com/agoyel25/BookmarkBrain/blob/66a99c51547bdb130797541c50bfaf65599041b7/manifest.json) · [Chrome 商店 · 开发者介绍](https://chromewebstore.google.com/detail/bookmarkbrain/akdanakbhljjkieodocegjhabdijmdjd?hl=en)

## xTap

将浏览过的推文存入本地，随时检索。

> Passively capture tweets as you browse X/Twitter

[官方介绍节选](https://github.com/mkubicek/xTap/blob/9eba39a3c972649f07df98c3874cac6de38b383f/README.md)

AI 总结：
- 在正常浏览 X 时，将收到的推文数据保存为本地文件。
- 适合建立可追溯的资料库；文章正文是否完整取决于 X 返回的数据。

- [GitHub Stars](https://github.com/mkubicek/xTap)：88（采集于 2026-10-13T06:27:29.138377+00:00）
- 用途：适合需要本地研究档案的人：浏览时保存结构化帖子，再按项目整理。安装复杂度高于一般扩展。
- 值得学：优先保留页面响应中的结构化数据；长文只有摘要时明确标为不完整。帖子 ID 去重，正文与媒体证据分别记录。
- 成本：MIT 源码免费；需自管本地服务及存储。
- 使用条件：扩展加 native host / 后台守护进程；需本机安装与目录权限。
- 边界：仅捕获浏览时实际收到的数据；没有主动全网搜索。不能把 Article 摘要当全文。
- 核验（2026-10-12）：已读 README、manifest、许可证及 Article blocks 完整性判断；未安装本地守护进程。
- [入口](https://github.com/mkubicek/xTap) · [源码](https://github.com/mkubicek/xTap) · MIT
- 来源：[源码 · lib/tweet-parser.js](https://github.com/mkubicek/xTap/blob/9eba39a3c972649f07df98c3874cac6de38b383f/lib/tweet-parser.js) · [源码 · manifest.json](https://github.com/mkubicek/xTap/blob/9eba39a3c972649f07df98c3874cac6de38b383f/manifest.json) · [官方仓库 · README](https://github.com/mkubicek/xTap/blob/9eba39a3c972649f07df98c3874cac6de38b383f/README.md)

## FxEmbed / FxTwitter

读取推文正文与媒体，生成分享预览。

> Embed videos, polls, quotes, translations, & more on Discord, Telegram, and others!

[官方介绍节选](https://github.com/FxEmbed/FxEmbed/blob/3b104b0dda2aa1303d697fa6494116a3676b0050/README.md)

AI 总结：
- 改善推文在 Discord、Telegram 等平台中的分享预览。
- 提供正文与媒体读取接口，适合给已找到的原帖补充信息。

- [GitHub Stars](https://github.com/FxEmbed/FxEmbed)：5,706（采集于 2026-10-13T06:27:29.159413+00:00）
- 用途：适合文章发现组件：取得真实链接后读取公开帖子，再核对作者、正文、图片和互动快照。
- 值得学：最新源码与文档出现搜索和作者长文列表；应先小样本验证部署，再决定接入，不能沿用“只支持读帖”的旧判断。
- 成本：MIT 源码；本轮公开端点请求未用付费 Key，自托管另有运维成本。
- 使用条件：使用公开接口；上游部署、限流和可见性会影响结果。
- 边界：本轮 v2 搜索返回 404；作者长文列表返回 12 条，未遵守请求 count=3，需在本地限额。单次列表成功不代表全量覆盖或完整线程。
- 核验（2026-10-12）：真实请求：v2 搜索 HTTP 404；作者长文列表 HTTP 200 / code 200，返回 12 条；现有组件读取 1 条已知原帖成功。
- [入口](https://docs.fxembed.com/api/introduction/) · [源码](https://github.com/FxEmbed/FxEmbed) · MIT
- 来源：[搜索接口文档](https://docs.fxembed.com/api/twitter/operations/2search/) · [作者长文列表文档](https://docs.fxembed.com/api/twitter/operations/2profilehandlearticles/) · [源码 · packages/atmosphere/src/providers/twitter/search.ts](https://github.com/FxEmbed/FxEmbed/blob/3b104b0dda2aa1303d697fa6494116a3676b0050/packages/atmosphere/src/providers/twitter/search.ts) · [官方仓库 · README](https://github.com/FxEmbed/FxEmbed/blob/3b104b0dda2aa1303d697fa6494116a3676b0050/README.md)

## Postiz

管理多个社交账号，统一写作和发布排期。

> Postiz is a social media management platform for scheduling, automating, and analyzing your content.

[官方介绍节选](https://github.com/gitroomhq/postiz-app/blob/3a7d28b7ad9654063f4f1f3938b8fe5d1590bf8f/README.md)

AI 总结：
- 集中管理多个社交平台的内容，安排发布并查看表现。
- 提供托管服务和开源自部署版本，适合需要统一管理发布排期的人。

- [GitHub Stars](https://github.com/gitroomhq/postiz-app)：37,111（采集于 2026-10-13T06:27:29.156149+00:00）
- 用途：有多平台发布需求时再评估；先学习草稿、渠道、排期和分析的组织方式。
- 值得学：把各平台适配与内容流程分开；渠道 API 变化不应迫使文章库跟着重写。
- 成本：AGPL-3.0；自托管软件免费，服务器、X API 等成本另计，云服务有套餐。
- 使用条件：自托管需部署服务并配置 X 开发者应用；发布授权与平台权限单独管理。
- 边界：当前优先级低于素材发现和个人写作；不适合仅为搜文章部署一整套工作台。
- 核验（2026-10-12）：已读 README、AGPL 许可及 X 适配代码的认证/发布/分析入口；未部署或连接账号。
- [入口](https://github.com/gitroomhq/postiz-app) · [源码](https://github.com/gitroomhq/postiz-app) · AGPL-3.0
- 来源：[源码 · README.md](https://github.com/gitroomhq/postiz-app/blob/3a7d28b7ad9654063f4f1f3938b8fe5d1590bf8f/README.md) · [源码 · libraries/nestjs-libraries/src/integrations/social/x.provider.ts](https://github.com/gitroomhq/postiz-app/blob/3a7d28b7ad9654063f4f1f3938b8fe5d1590bf8f/libraries/nestjs-libraries/src/integrations/social/x.provider.ts) · [X 配置说明](https://docs.postiz.com/self-host/providers/x-twitter)
