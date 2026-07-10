# 冷启动发布文案草稿（C-118，M12 启动）

> Status: active
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-10
> Execution status: `docs/marketing/execution-backlog.md`
> 说明：按 `roadmap.md` 六节软文模板写的三个第一梯队渠道初稿。发布前 Owner 过一遍口吻、补真实截图/动图（建议：快排自定义输入动画、Cmd+K 搜索、测验答题各一段录屏）。

---

## ① 掘金 · 项目分享文

**标题**：用 Vue3 写了一年算法可视化，92 个算法全部做成了可交互的逐步动画

**正文**：

大家好。一年前我背八股背到快排第 N 遍还是记不住 partition 的边界，一怒之下决定：把每个算法都做成动画，亲眼看它一步一步跑。

今天它长成了这个样子（在线体验：https://algo.illegalscreed.cn/?utm_source=juejin&utm_medium=community&utm_campaign=launch-2026q3&utm_content=project-story ）：

- **92 个算法、9 大类**：排序 16 种、图论 12（Dijkstra 到网络流、LCA）、DP 11（背包到换根 DP）、字符串 8（KMP 到 Z 函数）、数论 10（筛法到 FFT、Pollard's Rho）、计算几何、回溯、查找……
- **逐步动画播放器**：每一步配中文旁白字幕，TypeScript/Python/Go/Rust 四语言代码随步高亮当前行；支持 0.5×–3× 倍速、循环播放、←/→/空格键盘操控。
- **改数据看变化**：排序算法可以输入你自己的数组（URL 带 `?input=9,5,27,1,14` 直接分享给同学）。
- **测验模式**：播到关键步会停下来问你「下一步区间是哪半？」——答对才继续，学没学会立刻现形。
- **复杂度速查表 + 四条学习路径**：不知道从哪学起就走「新手入门 12 站」。

（此处放 2-3 段录屏动图）

**技术栈**：Vue 3 `<script setup>` + TypeScript + Pinia + Vite，零 UI 库（新拟物风全手写 Less）。可视化是自研的「可插拔轨道」架构：一个 Step 快照上挂 20 种可选轨道（柱状/图/矩阵/棋盘/迷宫/回文带/蝶形网络……），播放器一行 `v-if` 条件渲染——加一个新算法平均只要一个 module 文件 + 一页正文。测试 2000+（Vitest + Playwright），覆盖率 96%。

做的过程中最深的体会：**为了把一个算法讲清楚，你得先把它理解到能挑出「最有戏剧性的那个实例」**——比如 Pollard's Rho 我特意挑了 n=8051，让龟兔恰好在 mod 97 的「ρ」环上相遇。

免费、无广告、开源思路欢迎交流。如果对你复习/学习有帮助，帮我点个赞或转给正在准备面试的朋友～

---

## ② V2EX · 分享创造

**标题**：[分享创造] 把 92 个算法做成了逐步动画：四语言代码同步、可改输入、带测验

**正文**：

背算法背不动，索性做了个可视化站：https://algo.illegalscreed.cn/?utm_source=v2ex&utm_medium=community&utm_campaign=launch-2026q3&utm_content=project-intro

几个可能有意思的点：

1. 不是播视频，是真·逐步执行快照：拖进度条到任何一步，柱子/图/DP 表和四种语言的代码高亮行完全同步。
2. 排序算法支持自定义输入，URL 直接分享：https://algo.illegalscreed.cn/docs/quick-sort?input=9,5,27,1,14&utm_source=v2ex&utm_medium=community&utm_campaign=launch-2026q3&utm_content=quick-sort-demo
3. 播放到关键步会弹题（比如二分查找问你下一步区间），答错给你标出正确答案。
4. Cmd+K 全站搜索、复杂度速查表、四条学习路径。

纯前端 SPA（Vue3+TS），2000+ 测试。做了一年，图论/DP/数论/几何都齐了。求拍砖，尤其是动画节奏和文案是否讲得清楚。

---

## ③ B站 · 视频脚本大纲（60 秒版 ×3 支）

**S1《60 秒看懂快速排序》**
0-5s 痛点钩子：「快排的 partition 你是不是每次都要重新想？」→ 5-40s 录屏：默认数组播放，pivot 品红、区间栈右侧堆叠，旁白跟字幕走 → 40-50s 高潮：改输入为观众点播的数组重放 → 50-60s 收尾：站名 + 「简介有链接，92 个算法都有」。

简介链接：https://algo.illegalscreed.cn/docs/quick-sort/?utm_source=bilibili&utm_medium=video&utm_campaign=launch-2026q3&utm_content=s1-quick-sort

**S2《二分查找会考你》**
钩子「你以为你会二分？」→ 播放到探针步弹出测验 → 故意答错（红✗ 高亮正确项）→「答对才让你继续」→ 收尾导流。

**S3《Pollard 的 ρ 到底是什么形状》**
钩子「大数分解为什么叫 Rho 算法？」→ 龟兔追逐 → gcd=97 命中 →「揭开 mod 97 的世界」四色 ρ 现形——名字的由来一目了然 → 收尾导流。

---

## 发布节奏建议（C128 执行）

1. 第 1 周：掘金文 + V2EX 帖同日发（工作日上午 10 点），当天盯评论快速回复。
2. 第 2 周：B站 S1 视频（简介与置顶评论放链接）；观察三渠道 48h 数据。
3. 数据对比后押注最优渠道进入放大阶段（roadmap 阶段 2）；蹭 9-10 月秋招窗口提前 2 周铺量。

## Owner 行动项（站外，需要账号/人工）

当前状态与最晚输入阶段统一在 `docs/marketing/execution-backlog.md` 维护；本节只保留素材提醒。

- [ ] 赞赏码/爱发电入口图（提供图片后站内挂 Footer）
- [ ] 按 C124 清单完成 Bing Webmaster + Google Search Console 验证与 sitemap 提交
- [ ] C128 按上述节奏发帖；录屏动图三段（快排自定义输入 / 测验答题 / ρ 现形）

## 变更历史

- 2026-07-05：创建（C-118，M12 启动包）。
- 2026-07-10：C-123 将发布动作后置到分析归因之后；状态与外部依赖改由 execution backlog 统一维护。
- 2026-07-10：C-125 用统一 UTM 规则为掘金、V2EX 与 B站 S1 草稿生成可归因链接；正式发布仍等生产统计验证。
- 2026-07-10：C-129 撤销第三方统计前置条件；保留现有 UTM 渠道标签链接，发布不再等待属性 ID。
