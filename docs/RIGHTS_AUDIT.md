# 全文转载与 X 官方嵌入核验

核验日期：2026-10-10。范围：本轮开始时 `data/articles.json` 的 20 篇基线，以及两篇明确开放许可的候选。这里只记录来源、许可证据和产品实现边界；未联系作者、未发布内容，未把研究读取权限视作转载权限。

## 结论

本轮检查的 20 篇均**尚未取得可据以在本站或公开仓库复制全文的许可**。这不表示作者拒绝授权，也不表示所有引用均违法；本次检查没有找到这 20 篇可直接采用的开放全文许可。作者署名和来源链接应保留，但不能代替许可。美国版权局说明，合理使用没有通用的字数或百分比安全线，需要结合具体情境；本站不把“少于某字数”或“用于学习”当作自动许可。[版权局说明](https://www.copyright.gov/help/faq/faq-fairuse.html)

**官方嵌入能推进站内原文阅读，但不能统一称为全文。**本次检查 10 个 X 原帖的官方 oEmbed 初始 HTML：4 个线程只返回首帖，2 个长帖返回截断文字，4 个 X Article 入口返回导语或链接。HTTP 200 仅证明拿到了嵌入响应，不证明最终 iframe 能完整阅读。官方文档将嵌入帖定义为单条帖子的展示工具，并没有承诺根帖自动展示整个线程，也未找到把完整 X Article 放入外站的官方全文组件。[X for Websites](https://docs.x.com/x-for-websites/overview)、[官方嵌入帮助](https://help.x.com/en/using-x/how-to-embed-a-post)

已验证一个可实施的完整线程候选：**Dickie Bush 的高级搜索线程有 14 条真实、连续编号的帖子；14 条官方 oEmbed 全部返回成功，逐条文字未见截断。**可以按顺序嵌入这些独立帖子，最后由浏览器核对媒体、顺序和阅读完整性。它仍是官方远程展示，不是本站获得了复制并再许可全文的权利。

## 可实现方案与边界

| 内容类型 | 可实施的站内阅读 | 本次证据及剩余边界 |
| --- | --- | --- |
| 普通公开短帖 | 使用官方组件展示单帖，保留作者、时间、原帖及官方交互 | 必须实际确认文字及媒体加载；删除、转私密或平台加载失败后不能承诺永久可读 |
| 长帖 / Note Tweet | 官方嵌入 + 明确的“在 X 阅读完整内容”入口 | 本次两条 oEmbed 文字均截断；初始 HTML 不足以判断运行时组件是否有展开能力，不标“全文已展示” |
| 多帖线程 | 核实每个真实 ID 后按序逐帖嵌入 | 根帖不会自动等同完整线程；目前只验证下文 Dickie 14 条，不推广为所有线程都已可用 |
| X Article | 官方嵌入其分享帖 + 原文入口；获得作者许可后才能另做本地全文 | 本次四条只返回链接或导语。官方 Articles 帮助介绍站内文章及受众控制，没有确认第三方网站能嵌入完整 Article；也有订阅者专享文章，不能绕过权限读取或展示。[Articles 帮助](https://help.x.com/en/using-x/articles) |
| 作者官网文章 | 原创导读 + 原文入口；按明确许可加入本站全文/译文 | 公开可读、能抓取正文、站点有版权署名都不自动等于转载许可 |
| X 帮助中心 | 摘要解释规则并链接当前官方页面 | 官方事实可归纳；没有据此取得整页文字、图片的开放转载许可。规则须保留核验日期 |
| 明确开放许可文章 | 在许可条件内复制正文或翻译，并附原文和许可 | 按具体 CC 版本处理署名、修改说明、相同方式共享；不能默认连带取得第三方图片、商标或嵌套素材权利 |

X 的 Display Requirements 明确指出：某些情况下仍需要原创作者许可，X 不提供第三方用户内容的授权。使用官方组件还要遵守开发者协议及政策；不能修改帖子、制造作者背书，或把其他操作混入原帖界面。[展示要求](https://docs.x.com/developer-terms/display-requirements)、[开发者政策](https://docs.x.com/developer-terms/policy)、[服务条款](https://x.com/en/tos)

因此，本地保存研究证据、官方远程嵌入、自行复制全文、公开仓库再分发是四种不同使用。获取到了正文或能生成嵌入代码，都不能替代对后两种使用的许可核验。公开复制、翻译未授权全文，可能引发删除要求、版权投诉或索赔；是否适用例外须按实际使用和法域判断，本报告不作个案法律结论。

## 当前 20 篇逐项记录

所有记录的“未取得”都是本项目现状，不是“作者永不允许”。X 专属内容的检查范围是已读取原帖/文章和平台条款；未声称穷尽作者在其他网站的所有授权声明。

| 记录 ID | 原文类型及许可核验 | 官方嵌入初始结果 |
| --- | --- | --- |
| `x-original-content-rewards` | X 官方帮助；未找到该页开放全文许可 | 不适用 |
| `x-revenue-sharing-retired` | X 官方帮助；未找到该页开放全文许可 | 不适用 |
| `x-authentic-engagement` | X 官方规则；未找到该页开放全文许可 | 不适用 |
| `dan-koe-topic-tree` | [作者原页](https://thedankoe.com/letters/dont-get-replaced-by-ai-how-to-write-authentic-content/)可见 All Rights Reserved；未取得全文许可 | 无已核实原帖 ID |
| `ev-chapman-intentional-engagement` | [作者条款](https://www.evchapman.com/terms/)第 11.1 条明确提供个人阅读和原页链接分享；未授予本站全文转载许可。条款更新于 2026-08-09 | 无已核实原帖 ID |
| `dickie-bush-advanced-search` | X 线程；未取得自行转载全文许可 | 根帖只含导语；另核 14 条逐帖嵌入，见下文 |
| `nicolas-cole-digital-writing` | X 线程；未取得自行转载全文许可 | 只含首帖，没有后续 25 条写作建议 |
| `kieran-writing-to-business` | [作者原页](https://www.kierandrew.com/how-to-go-from-just-another-creator-to-successful-entrepreneur-by-writing-online/)有版权页脚；本次未找到 CC 或转载许可 | 无已核实原帖 ID |
| `isnail-content-to-service` | X Article；未取得自行转载全文许可 | 分享帖导语与文章链接 |
| `xbquan-value-added-quote` | X Article；未取得自行转载全文许可 | 分享帖导语与文章链接 |
| `liyue-new-account-boundaries` | X Article；未取得自行转载全文许可 | 文章链接，没有正文 |
| `dickie-bush-3x3-template` | X 长帖；未取得自行转载全文许可 | 导语以省略号结束，未返回完整三步内容 |
| `justin-welsh-publishing-loop` | X 线程；未取得自行转载全文许可 | 首帖导语，没有七项后续步骤 |
| `x-view-counts` | X 官方帮助；未找到该页开放全文许可 | 不适用 |
| `x-subscriptions` | X 官方帮助；未找到该页开放全文许可 | 不适用 |
| `x-recommendation-context` | X 官方规则；未找到该页开放全文许可 | 不适用 |
| `dickie-bush-headline-clarity` | X 线程；未取得自行转载全文许可 | 首帖导语，没有七项标题问题 |
| `nicolas-cole-validate-product` | X 长帖；未取得自行转载全文许可 | 在步骤中途截断 |
| `justin-welsh-profile-promise` | [作者原页](https://justinwelsh.me/essays/5-000-twitter-followers-90-days-1-guide)有版权页脚；本次未找到 CC 或转载许可 | 无已核实原帖 ID |
| `minli-sustainable-writing` | [作者原页](https://minlibuilds.com/posts/x-writing-growth/)有版权页脚；本次未找到 CC 或转载许可；另有真实 X Article 入口 | 文章链接，没有正文 |

原始来源和实际读取入口沿用 [SOURCES.md](SOURCES.md)，本轮不改原有导读、数据 schema 或 `rights.mode`。

## Dickie 高级搜索线程：逐帖嵌入候选

证据来源：[Thread Reader 展开页](https://threadreaderapp.com/thread/1400615906678542341.html)的 `tweet_1` 至 `tweet_14` 元素。每个元素同时给出 `data-screenname=dickiebush` 和独立 `data-tweet`。这些编号均来自原始 HTML，未通过时间或序号猜测。

| 顺序 | 核实的原帖 | 内容定位 |
| --- | --- | --- |
| 1 | [1400615906678542341](https://x.com/dickiebush/status/1400615906678542341) | 导语 |
| 2 | [1400615919257280516](https://x.com/dickiebush/status/1400615919257280516) | 搜索界面与文字查询 |
| 3 | [1400615950710358022](https://x.com/dickiebush/status/1400615950710358022) | 可筛选项目 |
| 4 | [1400615954527272961](https://x.com/dickiebush/status/1400615954527272961) | 搜索旧帖的用途 |
| 5 | [1400615966510288903](https://x.com/dickiebush/status/1400615966510288903) | `from:` |
| 6 | [1400615982998200325](https://x.com/dickiebush/status/1400615982998200325) | `since:` / `until:` |
| 7 | [1400615994377265159](https://x.com/dickiebush/status/1400615994377265159) | 关键词与 `OR` |
| 8 | [1400616005429346304](https://x.com/dickiebush/status/1400616005429346304) | 互动数量过滤 |
| 9 | [1400616048467062785](https://x.com/dickiebush/status/1400616048467062785) | 组合查询 |
| 10 | [1400616053294653443](https://x.com/dickiebush/status/1400616053294653443) | 收尾与关注号召 |
| 11 | [1400616083581722625](https://x.com/dickiebush/status/1400616083581722625) | 另一线程链接 |
| 12 | [1400616087348252675](https://x.com/dickiebush/status/1400616087348252675) | 查询语法汇总 |
| 13 | [1400737977366634496](https://x.com/dickiebush/status/1400737977366634496) | 课程推广附帖 |
| 14 | [1400738733306040321](https://x.com/dickiebush/status/1400738733306040321) | 邮件课程附帖 |

14 条官方 oEmbed 均 HTTP 200，均有独立正文，未见长帖省略截断。规范化空白及链接显示方式后，14 条正文均与展开页文字一致。第 11 条嵌套引用了另一历史线程的首帖，未把它算作当前线程的第 15 条。可用官方 `hide_thread=true` 关闭每条重复的上文；不要删除原帖里的作者推广再称“完整原文”。

验证边界：这是“展开页列出的 14 条 + 官方响应”的核验，尚未证明 X 对话中没有其他后续回复。最终 iframe 的加载、截图和图片内文字须另做浏览器验收；本次不把响应成功称为阅读体验已验收。

## 两篇明确开放许可的全文候选

两篇均来自作者 Jono Bacon 本人网站，已读正文。文章页面的当前导航都有 License 入口，指向作者的 [博客许可说明](https://www.jonobacon.com/2016/08/12/my-blog-is-creative-commons-licensed/)；声明覆盖其博客内容，并明确欢迎分享、改作及翻译，链接的版本是 **CC BY-SA 3.0 US**，不能擅自标为 CC BY 4.0。

| 候选 | 与本库的关系 | 许可与具体限制 |
| --- | --- | --- |
| [Boost Online Community Growth with the Bucket Strategy](https://www.jonobacon.com/2024/06/20/unlocking-social-media-creativity-with-the-bucket-strategy/)（2024-06-20） | 用受众需求建立内容分类，再集中收集想法、写作和排期；作者明确说在 X 上起草。适合内容运营全文样例 | 作者博客统一许可 CC BY-SA 3.0 US。可优先采用作者文字；配图及视频不因文字许可就自动纳入本站 |
| [8 Essential Social Media Tips: Insights from Stateshift](https://www.jonobacon.com/2024/05/03/8-essential-social-media-tips-insights-from-the-community-leadership-core/)（2024-05-03） | 面向社交媒体运营，覆盖选平台、内容日历、互动和指标；涉及 Twitter/X，但不是专门的涨粉实验 | 同一博客许可。文中视频、标签等效果是作者建议，不能提升为 2026 年 X 算法事实；封面另署摄影作者，应单独核对或不采用 |

[CC BY-SA 3.0 US 条款](https://creativecommons.org/licenses/by-sa/3.0/us/)允许含商业用途的复制和改作，要求保留适当署名、标题、来源及许可链接；译文/改作应说明修改，并按相同许可或允许的兼容许可发布，不得添加与其冲突的限制。产品上应把该文章及译文的许可和项目代码许可证分别写清。许可不意味着作者为本站背书，也不解决所有第三方素材权利。

这两篇在本次许可核验中作为候选交接；第一篇已在私有研究目录生成可导入 JSON，含 33 个文字块。对照原页正文，规范化空白并去除新增的链接 URL 字面后，原始文字完整保留；所有 20 个列表项及作者推广结尾均保留。研究员未改正式数据或导入公开全文，后续收录状态以数据文件为准。未联系作者，没有用无关论文扩充数量。

## 证据与下一步

整合更新：第一篇 Jono 候选已作为 `jono-bacon-content-buckets` 正式收录，当前共 21 条资料，包含 1 篇许可文字全文。原文和对应中文导读单独标注 CC BY-SA 3.0 US。Dickie 的 14 条原帖已接入连续嵌入，浏览器实际加载 14 / 14，中段和最后一帖均截图检查。第二篇 Jono 候选未导入。前文的 20 篇结论仅指本轮开始时的基线。

私有研究证据保存在被忽略的 `.research/content/rights-*`：10 条入口 oEmbed 响应及汇总、5 个作者原页及版权入口检查、官方规则读取、开放许可原文、Dickie 14 条的原始 HTML/编号/逐条 oEmbed。公开文档只保留可复核链接和结论。

优先完成 Dickie 14 条官方嵌入的真实浏览器阅读验收；再以明确许可的 Jono 文章制作一个完整阅读样例。对于其他想收录全文的作者，需取得覆盖网站展示、公开仓库、中文翻译、图片范围的具体许可后再纳入，不把署名替代授权。任何联系作者或对外发布仍需另有用户授权。
