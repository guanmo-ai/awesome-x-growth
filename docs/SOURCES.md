# 当前来源范围（2026-10-19）

正式数据为 97 篇，前台展示 94 篇近一年中文 Article。收录范围以 X 运营、涨粉及自媒体通用经营和变现为主，保留含实质 X 经验的跨平台比较，暂缓其他平台专项。以下为历史来源记录，历史数字、无图方案和普通帖计划不代表当前实现。当前清单以 `data/articles.json` 与 [文章目录](CATALOG.md) 为准。

---

# 当前来源范围（2026-10-13）

当前正式库 91 篇文章，首页展示 88 篇中文原作；每条均有明确发布日期且位于最近一年内。一年窗口确立后的两次补漏累计新增 14 篇，作者、原帖、已读范围和采集时间见 `data/articles.json`，发现路线与待补证范围见 [搜索覆盖与反思](SEARCH_COVERAGE_20261013.md)。超期及日期不明的 18 条退出正式库，留在本地 `.research/one-year-20261013/`。以下为各历史轮次的来源记录，不能据旧统计推断当前库数量。

---

# 第三轮来源补齐（2026-10-12，历史快照）

当前 56 条资料，34 篇中文文章展示。新增 9 篇来源、时间筛选与实际搜索范围见 [2026-10-13记录](CONTENT_EXPANSION_20261013.md)；[第三轮记录](CONTENT_EXPANSION_20261012_ROUND3.md)为历史快照。每条的作者、原帖、读取来源、采集时间、媒体归属均在唯一数据源中保存；第一、二轮记录为历史快照。

---

# 来源与阅读范围

资料库共 **42 条资料、31 位作者或机构、29 个真实 X 原帖入口、25 篇中文原作**。当前网站展示 20 篇中文 X 长文与复盘原帖，预览含有限节选、单独标明的 AI 总结与原文入口。第二轮新增 4 篇记录，重新核对展示 4 篇历史原文；核验日期为当地 2026-10-12，采集时间保留 UTC 时间戳。读取文字不等于独立审计图片、后台、粉丝、收入或工作流效果。

2026-10-12 总结更新：重新对照已有 OpenCLI 返回的两篇 Article 文字，补长开头节选，并逐条核对三条 AI 总结。总结仅概括作者的做法和论述，不加入本站建议；当前公开节选为黄小木 130 字符、Andy L 67 字符。截取与段间空白处理说明保存在 `excerpt.note`；具体总结依据与原始文字哈希留在本地研究记录中，不公开整篇原文，也不据此声称独立核验增长成绩或取得新许可。

历史两篇卡片更新：通过 [FxEmbed API v2](https://docs.fxembed.com/api/introduction/) 读取两篇原帖，核对作者、帖 ID、文章原标题及开头与已有阅读材料一致。点赞、收藏与评论均来自同次快照：黄小木为 571 / 1,083 / 118，Andy L 为 116 / 123 / 59。具体采集时间见各条 `socialSnapshot.capturedAt`；它们不是实时数值，也不是本站互动。

本轮具体文章、发现路径与未选入的材料见 [第二轮收录记录](CONTENT_EXPANSION_20261012_ROUND2.md)。[第一轮记录](CONTENT_EXPANSION_20261012.md) 继续保留。互动数字以各条 `socialSnapshot` 为准，提供方为 FxTwitter。新条目没有复制第三方封面或头像，使用文字卡片。

## 收录方式

- X 文章与长帖通过原文读取工具或 FxTwitter 公开接口取得，保留实际读取入口。第三方返回文字与 X 页面逐图审查分开记录，未展开全部线程时仅归纳实际取得的主帖。
- 官网文章由作者官网回源；平台规则来自 X Help Center。Grok 和 ChatGPT 网页研究用于发现线索，不作为一手证据。
- 每条保留原作者、作者主页、原文入口、核验日期、阅读范围、局限与版权说明。无法可靠确认的发布日期留空。
- 数据中保留原创中文导读，以及 1 篇明确采用开放许可的完整文字原文、1 篇已核验顺序的 14 条原帖地址；后两者均不在当前中文精选文章的展示范围。未采集作者私信或账户私人资料，未发布或互动。
- 粉丝、收入、流量和实验结果如果来自作者自述，明确标记为未独立核验；不声称可复现同样结果。

## 重要的时效更新

第二轮新增：[Jono Bacon 的内容分类方法](https://www.jonobacon.com/2024/06/20/unlocking-social-media-creativity-with-the-bucket-strategy/)，2024-06-20；当次完整读取原作与当前导航指向的[博客许可](https://www.jonobacon.com/2016/08/12/my-blog-is-creative-commons-licensed/)，核对为 CC BY-SA 3.0 US。33 个正文块完整保留文字、列表及推广结尾，仅重排版和恢复文字链接，不转载图片视频。Dickie 高级搜索的 14 个独立 status 地址均逐条核对，详见 `RIGHTS_AUDIT.md`。

[旧 Creator Revenue Sharing 官方页](https://help.x.com/en/using-x/creator-revenue-sharing)明确记载：2026-08-07 停止新增申请、2026-09-07 退役。不要将该页仍保留的旧门槛当作现行规则。

[Original Content Rewards 官方页](https://help.x.com/en/using-x/original-content-rewards)是本次核验的新方案入口。它定义了合格曝光、原创要求、申请与持续资格；申请条件不等于获批或收益保证。该结论为 2026-10-10 当次读取的官方政策快照。

## 正式记录的读取入口

原帖链接用于归属和溯源；实际读取入口用于核对本次取得的正文。

| ID | 作者 | 原始来源 | 实际读取入口与范围 |
| --- | --- | --- | --- |
| `x-original-content-rewards` | X Help Center | [原文](https://help.x.com/en/using-x/original-content-rewards) | [读取入口](https://help.x.com/en/using-x/original-content-rewards)；已读计划说明、合格曝光、原创定义、准入、持续资格和付款章节；地区名单请在原文核对。 |
| `x-revenue-sharing-retired` | X Help Center | [原文](https://help.x.com/en/using-x/creator-revenue-sharing) | [读取入口](https://help.x.com/en/using-x/creator-revenue-sharing)；已读页面顶部退役公告、过渡时间表与历史资格章节。 |
| `x-authentic-engagement` | X Help Center | [原文](https://help.x.com/en/rules-and-policies/authenticity) | [读取入口](https://help.x.com/en/rules-and-policies/authenticity)；已读账号真实性、多账号、内容垃圾信息、互动垃圾信息和执行措施章节。 |
| `dan-koe-topic-tree` | Dan Koe | [原文](https://thedankoe.com/letters/dont-get-replaced-by-ai-how-to-write-authentic-content/) | [读取入口](https://thedankoe.com/letters/dont-get-replaced-by-ai-how-to-write-authentic-content/)；已读选题树、三类写作练习、内容扩展及复用章节。 |
| `ev-chapman-intentional-engagement` | Ev Chapman | [原文](https://www.evchapman.com/blog/the-quick-guide-for-managing-twitter-without-having-to-quit-your-day-job/) | [读取入口](https://www.evchapman.com/blog/the-quick-guide-for-managing-twitter-without-having-to-quit-your-day-job/)；已读全部短文正文；未将旧第三方工具视为当前推荐。 |
| `dickie-bush-advanced-search` | Dickie Bush | [原文](https://x.com/dickiebush/status/1400615906678542341) | [读取入口](https://threadreaderapp.com/thread/1400615906678542341.html)；已读 14 条展开文本，首帖由已登录 X 搜索返回。 |
| `nicolas-cole-digital-writing` | Nicolas Cole | [原文](https://x.com/Nicolascole77/status/1441450057119592456) | [读取入口](https://threadreaderapp.com/thread/1441450057119592456.html)；已读展开页 27 条文本，包括 25 条写作建议；保留展开页所链接的真实原帖。 |
| `kieran-writing-to-business` | Kieran Drew | [原文](https://www.kierandrew.com/how-to-go-from-just-another-creator-to-successful-entrepreneur-by-writing-online/) | [读取入口](https://www.kierandrew.com/how-to-go-from-just-another-creator-to-successful-entrepreneur-by-writing-online/)；已读文章开篇、探索阶段、实验阶段及商业模式比较；未完整覆盖第三阶段。 |
| `isnail-content-to-service` | 蜗牛King | [原文](https://x.com/isnail/status/2106058998789382636) | [读取入口](https://x.com/isnail/status/2106058998789382636)；已读 X Article 返回的全部正文；未展开文末推荐的其他案例，也未将图片数据视为核验结果。 |
| `xbquan-value-added-quote` | @xbquan | [原文](https://x.com/xbquan/status/2107752058246078708) | [读取入口](https://x.com/xbquan/status/2107752058246078708)；已读 X Article 全部返回正文；未核验配图中的数据，也未确认作者对推荐系统的解释。 |
| `liyue-new-account-boundaries` | 李岳 | [原文](https://x.com/liyue_ai/status/2108833303897964973) | [读取入口](https://x.com/liyue_ai/status/2108833303897964973)；已读 X Article 全部文字正文与所列官方链接；本库另行回源核对真实性规则，未声称验证全部外链。 |
| `dickie-bush-3x3-template` | Dickie Bush | [原文](https://x.com/dickiebush/status/2072299100113121766) | [读取入口](https://x.com/dickiebush/status/2072299100113121766)；已读该长帖完整 text 字段，包括三个步骤、解释与结尾；不转述未经核验的名人引语。 |
| `justin-welsh-publishing-loop` | Justin Welsh | [原文](https://x.com/thejustinwelsh/status/1544293546123042817) | [读取入口](https://x.com/thejustinwelsh/status/1544293546123042817)；已核原帖作者、日期、ID；阅读范围为搜索返回的首帖、总结和部分作者回复，非完整线程。 |
| `x-view-counts` | X Help Center | [原文](https://help.x.com/en/using-x/view-counts) | [读取入口](https://help.x.com/en/using-x/view-counts)；已读全部 View counts FAQ，包括计数、重复浏览、作者自看、嵌入与缺失类型。 |
| `x-subscriptions` | X Help Center | [原文](https://help.x.com/en/using-x/subscriptions-creator) | [读取入口](https://help.x.com/en/using-x/subscriptions-creator)；已读页面概述、How do Subscriptions work 与 Who sets the price；其余折叠答案未完整取得。 |
| `x-recommendation-context` | X Help Center | [原文](https://help.x.com/en/rules-and-policies/recommendations) | [读取入口](https://help.x.com/en/rules-and-policies/recommendations)；已读概述、不适合推荐的内容及账号、主页和用户控制章节。 |
| `dickie-bush-headline-clarity` | Dickie Bush | [原文](https://x.com/dickiebush/status/1397720037046341636) | [读取入口](https://threadreaderapp.com/thread/1397720037046341636.html)；已读 14 条展开文本与七项标题问题；原帖链接由展开页直接提供。 |
| `nicolas-cole-validate-product` | Nicolas Cole | [原文](https://x.com/Nicolascole77/status/2107861596886208927) | [读取入口](https://x.com/Nicolascole77/status/2107861596886208927)；已读整条短帖正文；没有把末尾的收益符号当成结果证据。 |
| `justin-welsh-profile-promise` | Justin Welsh | [原文](https://justinwelsh.me/essays/5-000-twitter-followers-90-days-1-guide) | [读取入口](https://justinwelsh.me/essays/5-000-twitter-followers-90-days-1-guide)；已读完整四阶段正文与页面日期；嵌入推文是文内示例，不冒充本文章的发布原帖。 |
| `minli-sustainable-writing` | 实践哥 MinLi | [原文](https://minlibuilds.com/posts/x-writing-growth/) | [读取入口](https://minlibuilds.com/posts/x-writing-growth/)；已读官网全部文字正文、日期与作者主页，并用 X Article 核对作者和主要正文；配图数值与商业推广未独立核验。 |

## 当前边界

- Justin Welsh 增长线程：读取首帖、作者七项总结和部分回复，**不是完整连续线程**。
- Kieran Drew 创业长文：重点读取探索、实验及商业模式比较，未完整覆盖第三阶段。
- X Subscriptions：只取得可见概述和部分定价正文，折叠 FAQ 未完整展开；未收录未核验门槛或分成数字。
- 中文 X Article：已读取返回的文字正文，但图片里的数值、流程图未逐张核验；未把图片视为已审计结果。
- 三条 Thread Reader 来源均在数据中保留实际展开 URL；未将第三方展开文本描述为本次直接取得的 X 全线程。
- 历史教程中的工具、平台界面与互动方式可能变化；具体项目和账号仍须核对当前官方规则。

## 未收录与继续研究

补充两条来自 ChatGPT 网页研究的候选后均回到作者官网读取：Justin Welsh 的个人主页指南（页面日期 2022-07-23），以及实践哥 MinLi 的中文持续写作文章（页面日期 2026-04-29，官网提供真实 X 原帖入口）。截至本轮停止扩充。

本轮保留了短帖、外链尚未取得正文以及读取失败的候选。未读候选不进入正式文章数组，也不计入上述数量。包括：

- @bozhou_ai 的 X 手册引介：已读引介，手册外链全文未取得，因此不据此总结手册。
- @dickiebush 的内容漏斗线索：Article 返回没有文章内容，未据 Grok 回答补写。
- @ItsKieranDrew 的独立成篇提醒、@RealOldForest 的系列短帖：已读，但首批优先保留信息更完整的资料。
- Dan Koe 早期增长线程：其中包含互动群等历史做法，与当前 X 真实性规则存在冲突，不列入默认实操推荐。

原始读取结果和候选线索保存在本地研究目录，已由仓库忽略；公开网站与索引只使用 `data/articles.json`。

## 中文增长经验接入（2026-10-10）

以下 13 篇来自已完成的中文原文研究，保留原始阅读证据与范围。新增卡片标题为编辑标题；原始标题不明的主帖保留 null 并标记 editorial。阅读页中的练习是本站基于原文的整理，不冒充原作者原句。

| 文章 | 作者 | 来源 | 阅读范围 |
| --- | --- | --- | --- |
| 23 天千粉：先被认出，再用作品留住关注 | [萝卜哥](https://x.com/zhouluobo) | [原文](https://x.com/zhouluobo/status/2065941506150764998) | OpenCLI 通过已登录 Chrome 读取 X Article 正文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 200 → 1200 粉：一篇冷清长文，怎样重新分发？ | [@koffuxu](https://x.com/koffuxu) | [原文](https://x.com/koffuxu/status/2048322440359727429) | OpenCLI 通过已登录 Chrome 读取 X Article 正文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 14 天 5000 粉：找到自己的内容主线 | [王赞](https://x.com/wangzan101) | [原文](https://x.com/wangzan101/status/2009807602536902717) | X 原生搜索全文，并在已登录 Chrome 原帖核对作者、正文与时间；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 一个月两万粉：主页、教程与分发怎样配合 | [Miles Ma](https://x.com/miles_mazy) | [原文](https://x.com/miles_mazy/status/2099097799065567705) | OpenCLI 通过已登录 Chrome 读取 X Article 正文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 有浏览，没关注？分清两种内容的作用 | [金尘马](https://x.com/jinchenma_ai) | [原文](https://x.com/jinchenma_ai/status/2049301517099061374) | OpenCLI 通过已登录 Chrome 读取 X Article 正文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 热点不适合你时，回到读者真正需要的教程 | [行者 AI 视频](https://x.com/joshesye) | [原文](https://x.com/joshesye/status/2048024574722248825) | OpenCLI 通过已登录 Chrome 读取 X Article 正文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 卡在五千粉之后：用教程系列重新找到方向 | [程序员小灰](https://x.com/XiaohuiAI666) | [原文](https://x.com/XiaohuiAI666/status/2038199895090454649) | OpenCLI 通过已登录 Chrome 读取 X Article 正文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 让人愿意关注的简介，应该说清什么？ | [Roland.W](https://x.com/rwayne) | [原文](https://x.com/rwayne/status/2097305709683884441) | OpenCLI 通过已登录 Chrome 读取 X Article 正文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 先让作品证明价值，再谈评论与分发 | [小晚不在](https://x.com/bbkirstry) | [原文](https://x.com/bbkirstry/status/2102373925309338097) | OpenCLI 通过已登录 Chrome 读取 X Article 正文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 一年两万粉：从日常工作里找到长期选题 | [岳小鱼](https://x.com/yuexiaoyu) | [原文](https://x.com/yuexiaoyu/status/1968862032482160915) | X 原生搜索全文，并在已登录 Chrome 原帖核对作者、正文与时间；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 起号时很忙却很累：从找人转向内容吸引 | [搬砖的小明](https://x.com/xiaoming_io) | [原文](https://www.xiaoming.io/x-1000-followers/) | 作者官网正文，经网页读取工具阅读全文；未定位对应发布推文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 涨粉之后，怎样承接成产品与服务？ | [鱼总聊 AI](https://x.com/AI_Jasonyu) | [原文](https://x.com/AI_Jasonyu/status/2104911243739853231) | OpenCLI 通过已登录 Chrome 读取 X Article 正文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |
| 到了万粉，为什么还要重新计算投入？ | [微尘](https://x.com/weichen_ink) | [原文](https://weichen.ink/posts/x-creator-experiment) | 作者官网正文，经网页读取工具阅读全文；文中其他推文不是该文章的发布推文；已回到作者原文阅读正文；只核验内容确实存在，不代表独立审计增长、曝光、收益或因果关系。 |

## Mole 风格框架的两篇指定文章（2026-10-10）

- [半年 5 万粉，变现 6 位数焚诀公开](https://x.com/ai_xiaomu/status/2105845619915157543) · [黄小木](https://x.com/ai_xiaomu)。读取方式：OpenCLI 通过已登录 Chrome 读取 X Article 正文。已读取返回的文章文字；未逐图审查或独立核验作者成绩，未展开全部回复和外链。
- [10 天，我是如何把 X 从 0 做到 5000 粉的](https://x.com/AndyL5cc/status/2102987089768034489) · [@AndyL5cc](https://x.com/AndyL5cc)。读取方式：OpenCLI 通过已登录 Chrome 读取 X Article 正文。已读取返回的文章文字；未逐图审查或独立核验作者成绩，未展开全部回复和外链。


## 第七版的封面与收藏快照

本轮视觉整合从用户提供的 Open Design 阅藏原型读取两篇指定文章的头像、封面、发布日期及 FxTwitter 收藏/点赞快照。采集时间 `2026-10-10T14:41:45+00:00`；黄小木收藏 1,073 / 点赞 564，@AndyL5cc 收藏 120 / 点赞 112。数据并非本轮重新抓取，不代表实时统计或独立核验。其余首页文章没有对应快照，显示「未采集」。原有正文整理未改写为作者全文。媒体与许可证边界见 [第三方说明](THIRD_PARTY.md)。


历史集中补漏曾新增53条（含普通帖）；两小时自动任务已删除。现按用户要求退出38条普通帖，正式库仅保留91篇文章，中文页面展示88篇。范围与证据见 [集中补漏记录](CONCENTRATED_SEARCH_20261013.md)。

最新范围与筛选见 [只收文章与收藏量筛选](ARTICLES_ONLY_20261013.md)，以下普通帖记录只代表历史核验。
