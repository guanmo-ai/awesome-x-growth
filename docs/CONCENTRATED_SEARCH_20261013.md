# 集中补漏完成记录（2026-10-13）

> 历史补漏快照：当时包含普通帖。现按用户要求退出普通帖，只保留文章；当前91篇正式、88篇中文展示，见[最新范围](ARTICLES_ONLY_20261013.md)。

两小时自动续查已删除，改为本轮直接完成指定范围。当前正式库 129 条，中文页面展示 124 条；本轮新增 53 条（26篇长文、27条普通帖），原有 76 条逐 ID 比较保持一致。收录窗口为 2025-10-13 至 2026-10-13，按原帖 UTC 日期判断。

## 实际完成的范围

- 原定 25 位作者：Article 返回列表此前已完成；普通帖这轮全部达到 API 返回末端，累计 985 页、17,024 个去重链接，无待续游标。
- 为解析已有 Article 线索，另查 cnyzgkc、WattterDjiang、tou_de74826、0xarthurzs 四位作者的 Article 列表，也均到返回末端。
- Grok.com 与 ChatGPT 网页各实际发起一份公开来源研究请求，沿合集、第三方归档、GitHub 与普通帖查找。回答只作线索，正式资料再独立回源。
- 最后一批33个标题命中候选已分流。随后又审查正文候选：246条按正文预览分流，28条进一步回源，其中23条正式补入；当前标题与正文命中候选均无未处理项。分流与全文审读不同，具体理由保存在研究记录中。

17,024 是发现链接数，包含其他作者转推和无关内容；不是合格资料数，也不是中文 X 总量。未逐篇读完全部原始发现存档，不能保证全中文 X 没有遗漏。

## 本轮纠正的方法问题

原来的停工点来自每次小预算、只追 Article 和过度依赖接口。最终复核还发现标题分流漏掉了没有标题的正文方法帖；只看标题待审数为0，不能说明普通帖已处理完。此次用本地脚本集中续接列表，最多四个 HTTP 请求同时进行，429 全局停止；原始结果保存本地，只把需要判断的候选带入模型。列表页没有逐页调用 LLM，但本轮审读、网页协作仍会使用模型，不能由此推算精确 token 账单。

FxEmbed 文档允许 count=100，但本轮两次真实请求仍只得到 19/20 条，没有把参数变更宣传成五倍提速。已接入普通帖榜单：这次 250 张最近24小时卡片经过项目主题规则后为 0 命中，不能把它说成覆盖了一年的普通帖。

接口缺正文时回到 X 原生页。小码哥的原帖在 FxTwitter 缺正文，在 X 原生公开页可完整读取；新 `collect --native-export` 路径已真实接入这篇，保留原生文字和 Fx 元数据的不同出处，校验作者、原帖 ID 与图片域名。`yidabuilds/2053682864580137154` 在接口和原生公开页均为 404，未收录。只有成果文字、方法在视频中的候选也未补写内容。

组件另修正覆盖统计：旧版仅按日期提前结束的 window-complete 状态不再被算作列表完成。正文使用独立 bodyPatterns，过滤URL后匹配，输出有限上下文、matched-review.json 和正文/合并待审数；无标题的主帖进入同一复核过程。归档中未命中主题的线索继续保留，不自动标成已读或拒绝。

## 可复用的发现入口

- [Prism 的52篇清单](https://x.com/PrismChemAI/status/2108133278440153426)与[琳小航的10篇清单](https://x.com/jedeeai/status/2107351996990959989)：用于沿真实互引回源，不重复收录清单本身。
- [XGuide2026/anysome-x](https://github.com/XGuide2026/anysome-x)：已有增长与运营来源目录。
- [觉醒AI归档](https://www.jxxy.net/ai/articles/)：可反查原帖入口；转录内容和更新日期不替代原帖正文、作者与发布时间。
- [X-growth-skills](https://github.com/kangarooking/X-growth-skills)与[x-growth-handbook](https://github.com/bozhouDev/x-growth-handbook)：用于找作者与来源，不将 AI 蒸馏内容作为原作。
- [X榜单普通帖](https://xbangdan.com/posts/)：近期发现渠道，未承诺一年历史覆盖。

## 新增原作

| 本站导读 | 原作者 | 原帖日期 | 类型 |
| --- | --- | --- | --- |
| [超级峰的月度复盘：首句结果、实测证据与后续路径](https://x.com/Mileson07/status/2105596929145274613) | @Mileson07 | 2026-10-01 | 长文 |
| [动物园园长：内容主线、素材储备与商单承接](https://x.com/weiyux2021/status/2101844827599933805) | @weiyux2021 | 2026-09-21 | 长文 |
| [Wattter 的破千复盘：从发完就走到主动交流](https://x.com/WattterDjiang/status/2097542196274856134) | @WattterDjiang | 2026-09-09 | 长文 |
| [明野的起号复盘：深度回复、真实经历与表达工具](https://x.com/tou_de74826/status/2101696677388447967) | @tou_de74826 | 2026-09-20 | 长文 |
| [Yan 的内容拆解：情绪、用途、系列与首批传播](https://x.com/ZhanlinYan74392/status/2097284125824868725) | @ZhanlinYan74392 | 2026-09-08 | 长文 |
| [良竹的起号经历：真实身份、旧号背景与评论承接](https://x.com/liangzhu_AI/status/2104548529972658559) | @liangzhu_AI | 2026-09-28 | 长文 |
| [陈大煌的早期复盘：降低输出阻力，认真回应读者](https://x.com/realchendahuang/status/2066781309889134841) | @realchendahuang | 2026-06-16 | 长文 |
| [袋鼠帝的内容工作流：从素材收集到人工审核草稿](https://x.com/aikangarooking/status/2013861689717088342) | @aikangarooking | 2026-01-21 | 长文 |
| [得否的开源分享：热点选题、草稿优化与风格提炼](https://x.com/wangdefou/status/2010334216278745379) | @wangdefou | 2026-01-11 | 长文 |
| [雪糕的运营观察：稳定更新、相关互动与引用增量](https://x.com/Xuegaogx/status/2055493269552091623) | @Xuegaogx | 2026-05-16 | 长文 |
| [蜗牛的普通帖：持续发布，寻找读者愿意看的内容](https://x.com/isnail/status/2051675066836938868) | @isnail | 2026-05-05 | 普通帖 |
| [mao 的起号建议：定位、相关传播与转粉复盘](https://x.com/hyh1564069/status/2108374143984898303) | @hyh1564069 | 2026-10-09 | 普通帖 |
| [Laughing 的选题观察：中文 X 上的工具与具体需求](https://x.com/0xLaughing/status/2010713457000366221) | @0xLaughing | 2026-01-12 | 普通帖 |
| [沐阳的新手词表：转发、引用、曝光与互动](https://x.com/yyyole/status/2109291990680768718) | @yyyole | 2026-10-11 | 普通帖 |
| [动物园园长的普通帖：短内容也能把事情讲清楚](https://x.com/weiyux2021/status/2100559790372159968) | @weiyux2021 | 2026-09-17 | 普通帖 |
| [阿航的商业规划：短期结果与长期内容资产](https://x.com/AaronYiaazw/status/2092567003555139710) | @AaronYiaazw | 2026-08-26 | 普通帖 |
| [Hedy 的普通帖：内容、判断与信任如何连接获客](https://x.com/xiaomanhedy/status/2065780726553886945) | @xiaomanhedy | 2026-06-13 | 普通帖 |
| [小晚的 X 普通帖：把评论当作第二个内容入口](https://x.com/bbkirstry/status/2076352106202824931) | @bbkirstry | 2026-07-12 | 普通帖 |
| [小晚的内容思路：把 AI 工具翻译成读者的问题](https://x.com/bbkirstry/status/2062742306479128871) | @bbkirstry | 2026-06-05 | 普通帖 |
| [Hedy 做 X 第十三天：用发布暴露问题，再调整](https://x.com/xiaomanhedy/status/2066720922107617528) | @xiaomanhedy | 2026-06-16 | 普通帖 |
| [Hedy 的发帖习惯：看到信息，转成自己的表达](https://x.com/xiaomanhedy/status/2067157297063981090) | @xiaomanhedy | 2026-06-17 | 普通帖 |
| [Arthur 的公开样本观察：收益与内容策略的差异](https://x.com/0xarthurzs/status/2103800940105244847) | @0xarthurzs | 2026-09-26 | 长文 |
| [行之的算法解读：从候选召回到行为概率](https://x.com/lxz2677/status/2069963272590340590) | @lxz2677 | 2026-06-25 | 长文 |
| [Punk 的跨语言观察：记录自己的内容调整实验](https://x.com/AdrianPunk115/status/2060708539778449461) | @AdrianPunk115 | 2026-05-30 | 长文 |
| [金尘马的跨语言内容思路：一眼能懂，主页能承接](https://x.com/jinchenma_ai/status/2060396791129133096) | @jinchenma_ai | 2026-05-29 | 长文 |
| [玄远的账号受限经历：增长动作与申诉材料](https://x.com/xuanyuanfamai/status/2108928729292349509) | @xuanyuanfamai | 2026-10-10 | 长文 |
| [Arthur 的一天实验：提问句式与内容配比](https://x.com/0xarthurzs/status/2102927940107546943) | @0xarthurzs | 2026-09-24 | 长文 |
| [benlin 的审核复盘：拒信、作品整理与申诉说明](https://x.com/benlinbaofu/status/2095346153869234317) | @benlinbaofu | 2026-09-03 | 长文 |
| [鱼总的榜单观察：教程结构、标题与读者预期](https://x.com/AI_Jasonyu/status/2030622318494671189) | @AI_Jasonyu | 2026-03-08 | 长文 |
| [小码哥的二十一天复盘：原创、主题与日常回看](https://x.com/xmglab/status/2083403916356554854) | @xmglab | 2026-08-01 | 长文 |
| [Yuri 的 X 入门指南：主页、内容形态与资料管理](https://x.com/YuriWang49/status/2095072832745247025) | @YuriWang49 | 2026-09-02 | 长文 |
| [momo 的内容定位拆解：选位置，写只有自己能写的内容](https://x.com/momo_peggy/status/2087126696646328649) | @momo_peggy | 2026-08-11 | 长文 |
| [deng 的一个月复盘：内容包装、同体量交流与持续尝试](https://x.com/dengdry/status/2065369746510406077) | @dengdry | 2026-06-12 | 长文 |
| [霞姐的信息源工作流：先找一手材料，再读懂语境](https://x.com/berryxia/status/2064551064402374821) | @berryxia | 2026-06-10 | 长文 |
| [qing 的八天评论复盘：先找切入点，再看曝光与转粉](https://x.com/qing7yv/status/2047822942474735988) | @qing7yv | 2026-04-24 | 长文 |
| [木马人的普通帖：记录真实交流，做跨平台分发](https://x.com/ai_xiaomu/status/2108350856857084324) | @ai_xiaomu | 2026-10-09 | 普通帖 |
| [阿航的普通帖：把已有反馈的 X 内容分发到抖音](https://x.com/AaronYiaazw/status/2107507100972921235) | @AaronYiaazw | 2026-10-06 | 普通帖 |
| [Punk 的普通帖：从真实场景找选题，别只列工具功能](https://x.com/AdrianPunk115/status/2105581735576842358) | @AdrianPunk115 | 2026-10-01 | 普通帖 |
| [Tonix 的账号反思：没有新的实践，内容会变空](https://x.com/0xtonixie/status/2103118242046734720) | @0xtonixie | 2026-09-24 | 普通帖 |
| [Miles 的普通帖：先让读者记住你长期讲什么](https://x.com/miles_mazy/status/2102190640683745391) | @miles_mazy | 2026-09-22 | 普通帖 |
| [Punk 的 Grok Bot 体验：扩展情报、复盘与灵感职责](https://x.com/AdrianPunk115/status/2097904901141438498) | @AdrianPunk115 | 2026-09-10 | 普通帖 |
| [小晚的商单经验：识别对接方，守住报价，说明合作价值](https://x.com/bbkirstry/status/2092895879044989292) | @bbkirstry | 2026-08-27 | 普通帖 |
| [金尘马的普通帖：四类显性收入与 IP 带来的长期机会](https://x.com/jinchenma_ai/status/2087207403255173604) | @jinchenma_ai | 2026-08-11 | 普通帖 |
| [小晚的内容比较：观点、教程与跨平台需求](https://x.com/bbkirstry/status/2083750344665018761) | @bbkirstry | 2026-08-02 | 普通帖 |
| [萝卜哥的普通帖：把工具选题写成具体结果与需求](https://x.com/zhouluobo/status/2072115971326943373) | @zhouluobo | 2026-07-01 | 普通帖 |
| [Hedy 的130条评论复盘：在别人的话题里提供增量](https://x.com/xiaomanhedy/status/2071428859216494874) | @xiaomanhedy | 2026-06-29 | 普通帖 |
| [萝卜哥的评论经验：找同领域的人，补自己的场景](https://x.com/zhouluobo/status/2067613692481741107) | @zhouluobo | 2026-06-18 | 普通帖 |
| [Hedy 的个人 IP 思路：把真实经历变成读者的问题答案](https://x.com/xiaomanhedy/status/2066740802769101078) | @xiaomanhedy | 2026-06-16 | 普通帖 |
| [萝卜哥的工作流反思：模板、脚本与验证减少重复判断](https://x.com/zhouluobo/status/2061990890634441189) | @zhouluobo | 2026-06-03 | 普通帖 |
| [Koffu 的普通帖：结果数字、动作清单与真实代价](https://x.com/koffuxu/status/2040634447444504697) | @koffuxu | 2026-04-05 | 普通帖 |
| [Tonix 的写作系统：事实、观点、感受与持续练习](https://x.com/0xtonixie/status/2023710756185989138) | @0xtonixie | 2026-02-17 | 长文 |
| [Rion 的6300粉复盘：兴趣赛道、原创拆解与耐心](https://x.com/rionaifantasy/status/2008884514009784415) | @rionaifantasy | 2026-01-07 | 长文 |
| [蜗牛的五万粉回顾：持续出摊，提供内容与情绪价值](https://x.com/isnail/status/2108058550023110750) | @isnail | 2026-10-08 | 普通帖 |

## 阅读与验证边界

每条保留有限节选、三个来源总结、真实头像/来源图与阅读范围。部分超长正文只审读与导读有关的段落，已在记录中明确；没有声称全部外链、截图和回复均已核验。成绩、机制、收益和申请结果按作者当时自述处理，未把历史规则变成当前操作承诺。

共享组件 46 项测试与 doctor、网站 37 项测试、build/check 已通过。原有 76 条保持一致，正式数据没有超出一年期限。本地候选；未 commit、push 或部署。

实际最终页面验收：124张卡片，近30天38条；新增普通帖详情的原帖入口与三条总结相符。1280×900桌面与319×711窄屏均无横向溢出、无图片加载失败，临时视口已恢复。
