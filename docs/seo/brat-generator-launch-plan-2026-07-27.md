# Brat Generator 内页与 SEO 上线规划

日期：2026-07-27
目标市场：英语用户，主域名 `https://fontgenerators.app`

## 1. 目标与结论

- 新增唯一可索引工具页：`https://fontgenerators.app/brat-generator`。
- 主关键词：`brat generator`。
- 同页覆盖的相邻意图：`brat font generator`、`brat text generator`、`brat generator black`、`brat generator white`、`brat generator pink`、`brat generator transparent`、`brat generator png`、`brat generator different colors`。
- v1 不拆分颜色页、字体页或“lyrics”页，避免重复内容和关键词内耗；只有后续 GSC 数据证明某个修饰词具备独立任务与内容价值时再拆页。
- 产品定位为独立的 fan-style 工具，不宣称官方、同款字体或与 Charli XCX/唱片公司存在关联。

## 2. 竞品判断

用户提供的五个站点中，主对标采用 `bratify.app/brat-generator`：

- 优点：工具前置、实时 Canvas 预览、颜色预设、社媒比例、PNG/JPEG/WebP 与复制图片形成完整任务闭环。
- 可借鉴：桌面端左右工作台、移动端纵向排列、所见即所得导出、简洁内容结构。
- 需要超越：补充透明背景、浏览器侧隐私说明、可访问状态、完整 WebApplication/FAQ/HowTo 结构化数据和站内内链。

其余站点只作为反例或功能补充参考：

- 不加入导出水印，也不出现“无水印”与实际结果矛盾的情况。
- 预览与下载必须走同一个渲染函数，避免样式、换行、翻转或噪点只在预览中生效。
- 不使用假评价、无证据评分、广告式浮层、外链徽章或机械关键词密度文案。
- 不声称提供下载、复制或高清尺寸，除非对应功能和输出已被自动化测试验证。

## 3. 页面与搜索意图合同

### Metadata

- Title：`Brat Generator — Make Brat Text Images Free`
- H1：`Brat Generator`
- Meta description：强调自定义颜色、模糊、透明背景、社媒尺寸、PNG/JPEG/WebP、免费、无需注册和无水印，控制在 140–160 个英文字符。
- Canonical：`https://fontgenerators.app/brat-generator`
- Robots：`index, follow`
- OG/Twitter：标题、说明、canonical URL 与分享图完整；上线后可再把通用 logo 分享图升级为 1200×630 的页面专属图。

### 首屏任务

- 输入文本并实时预览。
- Brat Green `#8ACE00`、白、黑、粉、透明背景预设与自定义背景/文字颜色。
- 居中、右对齐、两端对齐。
- 1:1、9:16、16:9；方图支持 512–2048 px，竖图 1080×1920，横图 1920×1080。
- 字号、模糊、自动小写、像素化。
- PNG、JPEG、WebP 下载与支持时复制图片。
- 本地重置；无账号、无上传、无服务端处理、无水印。

### 正文顺序

1. 工具工作台。
2. 颜色预设与社媒尺寸。
3. 四步使用方法。
4. 浏览器侧隐私与独立工具免责声明。
5. Brat generator 的定义、颜色/字体/模糊说明、输出格式和真实使用场景。
6. FAQ。
7. 相关文字工具和返回生成器 CTA。

正文目标约 900–1400 个有用英文词，以真实任务、限制和答案为主，不设置关键词密度目标。

## 4. AEO、Schema 与内容边界

- `WebPage` + `WebApplication`：名称、URL、免费 Offer、浏览器运行、功能描述与输入/输出能力保持真实。
- `HowTo`：四个可见步骤必须与页面文案一致。
- `FAQPage`：只标记页面中可见的 FAQ，至少覆盖透明 PNG、`#8ACE00`、字体口径、黑白粉配色、长文本/短歌词、移动端、隐私、非官方关系。
- 不添加评分、Review 或 AggregateRating。
- 字体回答使用“condensed sans-serif inspired look”，不宣称包含或复制官方专有字体。
- 用户可以输入自己的短句或合法使用的短文本；页面不提供受版权保护的歌词库，不建设歌词生成器。

## 5. 技术 SEO 与内链

- Vite MPA 增加独立构建入口。
- Cloudflare Pages middleware 显式放行 `/brat-generator`，未知路由继续返回带 `noindex` 的 404。
- `/brat-generator/` 301 到无尾斜杠 canonical；`www` 到 apex 时保留路径和查询参数。
- 两份 sitemap 源保持一致，并在构建产物中验证新 URL。
- `/llms.txt` 增加页面定位与 canonical。
- 首页 “More text tools” 增加 Brat Generator 卡片；新页面回链 Font Generator、ASCII Art Generator 与 Font Mixer。
- 所有用户文本和 Canvas 预览添加 Clarity mask；分析事件只记录比例、预设、格式、成功/失败等枚举值，不记录输入文本、文件名或图像内容。

## 6. 上线验收

- 功能：五种背景、两种自定义颜色、三种对齐、三种比例、尺寸/字号/模糊、lowercase、pixelated、三种格式、下载、复制、重置全部可用。
- 一致性：预览与导出共用渲染器；验证尺寸、MIME、透明 alpha、换行、长文本、多行、Emoji/非拉丁字符和空输入。
- 响应式：390、768、960–1100、1440 px 无横向溢出，移动端核心操作不被 Cookie 浮层遮挡。
- SEO：200、canonical、robots、title、description、唯一 H1、Schema、sitemap、llms、首页内链、尾斜杠 301 全部通过。
- 发布：测试通过后同一版本 commit、push、Cloudflare Pages 部署；同时验证不可变部署 URL 与生产域名。
- 搜索控制台：如当前环境没有 GSC/Bing 登录态，只记录“尚未提交”，不得把代码上线等同为已提交收录。

## 7. 首周监控

- GSC：抓取状态、canonical 选择、`brat generator` 与颜色/透明/PNG 修饰词的展现和点击。
- GA4/Clarity：生成器开始、预设选择、比例、下载格式、复制成功/失败、重置；不采集用户文本。
- 决策：若页面有展现但 CTR 低，先优化 title/description；若排名停滞但任务完成率高，补高质量相关内链和真实外部引用；只有修饰词形成稳定独立意图后再新增页面。
