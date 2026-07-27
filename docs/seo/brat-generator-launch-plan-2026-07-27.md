# Brat 主题 SEO/GEO/AEO 最终实施方案

日期：2026-07-27
目标市场：Worldwide English
主域名：`https://fontgenerators.app`

## 1. 数据口径与研究结论

用户提供的四份 Google Trends CSV 实际是两组 `Worldwide`、近 7 天 Related Queries 数据，每组分别按 Top 与 Rising 排序。CSV 中的 `search interest` 是该组查询之间的归一化热度指数，不是关键词搜索量，不能用来推导绝对流量、CPC 或竞争难度。Rising 中的 `Breakout` 代表相对增幅极高，也不等同于已经形成大体量。

本次 SERP、自动补全、People also ask 与 People also search for 共同显示三类可区分任务：

1. `brat generator`、`brat font generator`、`brat text generator`、free、meme、cover、white/pink 是同一个“立即生成静态图片”任务。
2. `brat font`、font name/download、Canva、CapCut、copy and paste 是信息查询任务。PAA 集中询问字体名称、从哪里获取，以及 Canva 中如何复现。
3. `brat color code`、`brat green`、HEX/RGB/HSL/CMYK 是颜色复制、换算与对比度任务。虽然当前基数较低，但 `brat color code` 在 Rising 数据中为 Breakout，且 SERP 已形成独立颜色工具意图。

核心事实优先采用一手或规范来源：

- Dinamo 设计团队资料：主封面文字以 Arial 为基础，经过拉伸和低分辨率处理；ROM 是 campaign secondary typeface；其资料给出绿色 `#8ACE00`。来源：<https://abcdinamo.com/newsletter/the-dinamo-update-our-font-for-charli-xcxs-brat>
- Microsoft Arial Narrow 说明：Arial Narrow 随特定 Microsoft 产品提供，不提供任意再分发许可。来源：<https://learn.microsoft.com/en-us/typography/font-list/arial-narrow>
- W3C WCAG 对比度说明：正文常规文本至少 4.5:1，大号文本至少 3:1。来源：<https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum>

## 2. 最终页面矩阵

| 路由 | 主搜索意图 | 页面角色 | 决策 |
|---|---|---|---|
| `/brat-generator` | `brat generator`、`brat font generator`、`brat text generator`、free、meme、cover、white/pink | 静态图片生成工具 | 强化现有工具页 |
| `/brat-font` | `brat font`、font name/download、Canva、CapCut、copy and paste、PAA | 权威字体信息页 | 新增 |
| `/brat-green` | `brat color code`、`brat green`、HEX/RGB/HSL/CMYK | 颜色复制、换算、对比度工具 | 新增真实工具页 |

不建立以下薄页或能力不匹配页面：

- `/brat-font-generator`、`/brat-text-generator`：与 `/brat-generator` 同一任务，拆分会造成内容重复和关键词内耗。
- Canva、CapCut 独立页：当前可由 `/brat-font` 的专门章节充分回答，不需要模板化薄页。
- `/brat-color`、`/brat-color-code`：与 `/brat-green` 同一颜色任务，不做别名落地页。
- white、pink、meme、cover 颜色/场景变体页：先由生成器真实功能与正文承接。
- `/brat-video-generator`、`/brat-lyric-generator`：与当前静态图片产品能力不同。
- `Bratz`、`brat diet`、`beat generator` 等噪音词：完全排除。

未知变体路由继续返回 `404`，同时发送 `X-Robots-Tag: noindex, nofollow` 并输出可见 noindex meta，不把它们 301 到相似页面。

## 3. `/brat-generator` 实施合同

### Metadata

- Title：`Brat Generator — Free Brat Font & Text Image Maker`
- H1：`Brat Generator`
- Description：`Create brat-style text images with this free brat font generator. Customize colors, blur, alignment and size, then download PNG, JPEG or WebP—no signup.`
- Canonical：`https://fontgenerators.app/brat-generator`
- Robots：`index, follow`
- OG/Twitter：使用该路由专属 1200×630 原创分享图。

### 内容与功能边界

- 工具保持首屏，H1 后用直接答案说明：这是 free brat font generator 和 brat text generator，输出静态图片，不输出 TTF/OTF、Unicode copy-paste 字体或视频。
- 只描述已实现能力：自定义背景和文字颜色、透明背景、blur、pixelated、lowercase、alignment、尺寸、PNG/JPEG/WebP、copy image。
- 不宣称 Mirror、Flip Vertical、Noise、视频、AI 歌词或字体文件下载。
- 正文覆盖工具定义、真实功能、输出格式、使用场景、浏览器侧隐私与产品限制；详细字体事实链接 `/brat-font`，详细颜色换算链接 `/brat-green`。
- FAQ 可见内容与 `FAQPage` 完全一致，覆盖：是否免费、字体名称、是否需要下载字体、copy image 与 copy-paste font 的区别、`#8ACE00`、透明背景、移动端、隐私、静态图片而非视频。
- `WebApplication.featureList` 只能列出当前真实能力。

## 4. `/brat-font` 实施合同

### Metadata

- Title：`What Is the Brat Font? Name, Canva, CapCut & Alternatives`
- H1：`What Is the Brat Font?`
- Description：`What font does Brat use? See the Arial-based treatment, #8ACE00 green, legal alternatives, Canva and CapCut workflows, and why no font file is needed.`
- Canonical：`https://fontgenerators.app/brat-font`
- Robots：`index, follow`
- OG/Twitter：使用该路由专属 1200×630 原创分享图。

### Answer-first 与来源边界

首屏先直接回答：主封面文字以 Arial 为基础，再经过拉伸和低分辨率处理；Arial Narrow 是常见近似方案，不是名为 “Brat Font” 的官方字体文件；ROM 是 campaign secondary typeface。

页面必须包含：

- “原始设计事实 / 常见近似 / 本站实现”对比表。
- 本站 Canvas 的真实 fallback 与缩放/模糊说明，不能把 fallback 描述成官方字体。
- font name、free download、Canva、CapCut、copy and paste 独立章节。
- Canva/CapCut 的稳定工作流优先推荐：在本站导出 PNG，再作为 overlay 导入；不承诺平台当前字库必然包含某个字体。
- 只链接合法来源，不托管或分发 Arial、Arial Narrow、ROM 等字体文件。
- 明确搜索结果中的同名手写字体并非 Charli XCX 主封面字体。
- 可见 last reviewed 与 Sources 区。
- 可见 PAA 与 `FAQPage` 完全一致。
- Schema：`WebPage + Article + BreadcrumbList + FAQPage`。

## 5. `/brat-green` 实施合同

### Metadata

- Title：`Brat Green Color Code — #8ACE00 Hex, RGB, HSL & CMYK`
- H1：`Brat Green Color Code: #8ACE00`
- Description：`Copy the Brat green color code #8ACE00 in HEX, RGB, HSL and CMYK. Compare black and white text contrast, copy CSS, and open it in the Brat Generator.`
- Canonical：`https://fontgenerators.app/brat-green`
- Robots：`index, follow`
- OG/Twitter：使用该路由专属 1200×630 原创分享图。

### 真实工具合同

提供键盘可访问的一键复制操作和 `aria-live` 状态反馈：

- HEX：`#8ACE00`
- RGB：`rgb(138, 206, 0)`
- HSL：`hsl(80, 100%, 40.4%)`
- 近似 CMYK：`33, 0, 100, 19`
- CSS 变量：`--brat-green: #8ACE00;`

页面展示黑字 `10.91:1`、白字 `1.92:1` 的对比度，并推荐黑字。`#8ACE00` 来自 Dinamo/设计团队资料；HSL 与 CMYK 是数字换算，不宣称为官方印刷规范。提供 Canva、Figma、CSS、PowerPoint 使用示例，以及 “Open in Brat Generator” CTA。Schema 为 `WebPage + WebApplication + BreadcrumbList + FAQPage`。

## 6. 技术 SEO、GEO 与 AEO 合同

- Vite MPA 对三个 Brat 路由分别构建静态 HTML。
- Cloudflare Pages middleware 显式放行三个 clean URL；三条尾斜杠路径 301 到无尾斜杠 canonical；`www` 到 apex 保留路径与查询参数。
- 根目录与 `public/` 两份 sitemap 内容完全一致，收录三个 Brat canonical，不收录 cookies、别名或未知变体。
- `llms.txt` 描述三个页面的任务边界、静态图片限制、字体授权边界、颜色换算口径和禁止宣称的未上线页面。
- 内链形成闭环：Generator → Font/Green；Font → Generator/Green；Green → Generator/Font。无需挤入主导航。
- 每个核心问题先给 40–80 词直接答案，再展开表格、步骤与来源；Schema 只能标记页面可见内容。
- 分享图使用原创短语，不复制专辑封面、歌词或官方素材。
- 禁用表达：`official generator`、`exact replica`、虚构用户量或评价、未经授权字体下载、无限商业使用承诺。

## 7. 测试与发布验收

`npm run check` 必须验证：

- 三页文件与专属 OG 资源存在。
- 三页 title、H1、canonical 唯一且精确；robots 可索引。
- 每页要求的 Schema 存在，`FAQPage` 问题均能在可见正文找到。
- 三页完整互链，sitemap、llms、redirect 和 middleware 合同同步。
- `/brat-font-generator`、`/brat-text-generator`、`/brat-color`、`/brat-color-code`、`/brat-video-generator`、`/brat-lyric-generator` 保持 404 + noindex。

浏览器在 390、768、1440 px 验收：无横向溢出；颜色复制按钮、`aria-live`、键盘焦点和 CTA 正常；控制台与网络无阻断性错误。

发布要求：

1. 同一版本完成 commit 与 push。
2. 使用该 commit 部署 Cloudflare Pages。
3. 验证三个 clean URL 为 200，尾斜杠为 301，未批准别名为 404 + noindex。
4. 验证正式域名与不可变部署 URL 内容一致，Schema、OG 资源、console/network 正常。
5. 只有在确认存在 GSC/Bing 登录态时提交 sitemap 并分别请求抓取三个 URL；否则记录为待办，不能把“已部署”表述成“已收录”。

## 8. 7 天与 28 天监控

按 `query × page` 监控 GSC：

- generator queries 应主要落到 `/brat-generator`。
- font knowledge queries 应主要落到 `/brat-font`。
- color/code queries 应主要落到 `/brat-green`。

若出现互抢，先调整 title、内部链接锚文本和正文边界，不新增更多变体页。若页面有展现但 CTR 低，先改 title/description；若用户任务完成率高但排名停滞，优先补高质量相关内链与真实外部引用。只有新的查询形成稳定、独立且可由真实产品能力承接的任务后，才重新评估页面矩阵。

## 9. AITDK GEO 复核与补充合同

2026-07-27 使用 AITDK SEO Extension 复核 `/brat-generator` 后，报告中的问题按真实性分为三类：

### 应修复的真实缺口

- Generator 页面必须直接显示来源，不能假设 `/brat-font` 或 `/brat-green` 的证据会自动传递到当前页。可见来源与 `WebPage.citation` 同步为 Dinamo、Microsoft Typography 和 W3C。
- 显示真实的组织归属和日期：`Published and maintained by FontGenerators.app`、`datePublished`、`dateModified` 与 `lastReviewed`。日期只在内容或工具发生实质变化时更新，不能为了“新鲜度”随构建自动刷新。
- 输出格式使用带 caption、表头 scope 和行头 scope 的语义表格，帮助用户比较 PNG、JPEG、WebP 与 Copy image；表格只承载真实差异，不为打分堆内容。
- 新增单一实质 `/about` 页面，同时承担 `#contact`、来源方法、独立性和隐私边界；不再拆薄 `/contact`。About/Contact 进入全站 footer，About 进入 sitemap、llms、Vite、middleware、redirect 和 Smoke。
- 首页与 About 定义稳定的 `Organization#organization` 和 `WebSite#website`；Brat 三页通过相同 `@id` 引用 author、publisher 与 isPartOf。
- `llms.txt` 的页面与来源列表使用 Markdown 链接，明确页面任务和证据范围。

### 检测器误报或启发式提示

- Generator 原本已有嵌套 `WebSite`，插件的“No WebSite”不是完全准确；仍补顶级稳定实体节点以提高跨页一致性。
- `Title` 是页面主题，`og:site_name` 是站点名，两者不需要完全相同。继续保留冻结的 query-first Title，不添加 `| FontGenerators.app`；用 `name: FontGenerators.app` 与 `alternateName: FontGenerators` 表达品牌关系。
- 页面原本已有四步 `<ol>` 与可见 FAQ，因此“缺列表”不是硬错误；新增表格的理由是输出格式比较本身对用户有价值。

### 明确不做

- 当前没有经 owner 确认、能无歧义代表 FontGenerators.app 的 Wikipedia、Wikidata、LinkedIn、GitHub Organization 或品牌社媒页面，因此不写 `sameAs`。
- 不把 Dinamo、Charli XCX、Microsoft、来源页面、个人 GitHub 账号或站点自身 URL 伪装成 `sameAs`。
- 不虚构个人作者、专家审核、公司法定名称、地址、团队规模、评价或 `aggregateRating`。
- 不把第三方工具的 84/100 或“引用可提升 115%”当作 Google 排名或 AI 引用 KPI；只把报告作为可见来源、实体一致性和站点信任的 QA 清单。
