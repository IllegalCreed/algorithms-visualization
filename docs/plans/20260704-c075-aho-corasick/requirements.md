# 需求：AC 自动机 Aho-Corasick（C-20260704-075，字符串第 7 页 · 多模式匹配）

> Status: verified
> Stable ID: C-20260704-075
> Owner: IllegalCreed
> Created: 2026-07-04
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

字符串大类已铺开三种**单模式匹配**（KMP 部分匹配表 / Rabin-Karp 滚动哈希 / Boyer-Moore 坏字符）+ 回文（Manacher）+ 后缀结构（后缀数组 / LCP）。本页补最后一块拼图：**多模式匹配**。

**AC 自动机（Aho-Corasick）**：一次在文本里找出**一组模式**的所有出现（含重叠）。做法是把所有模式塞进一棵 **Trie**，再给每个状态建一条 **fail 指针**——它是 **KMP 的部分匹配表 π 的多模式推广**：`fail[u]` 指向「u 代表的字符串的最长真后缀，且该后缀是 Trie 中某条路径」。构造用 **BFS**（父的 fail 已算好才能算子的）：`fail[子] = goto(fail[父], 边字符)`，沿 fail 链回退直到有该字符转移或到根。匹配时文本指针**不回退**，当前状态遇到没有的字符就沿 fail 跳，走到的每个状态沿 **输出链**报告所有以此结尾的模式，总复杂度 **O(文本长 + 模式总长 + 命中数)**。

## 目标

在字符串大类新增第 7 页「AC 自动机」，接入算法播放器（`AlgorithmPlayer`），**复用 GraphView（状态节点 + trie 边 + fail 边），不新建轨**：

1. **建 Trie**：逐个把模式插入 Trie，节点 + trie 边（实线）逐步浮现，终止状态标模式名。
2. **建 fail（BFS）**：按 BFS 序逐状态算 fail 指针；指向根的默认 fail 只在字幕说明，跨分支的**非平凡 fail 边**画成**虚线**并解释「沿父的 fail 找该字符转移」。
3. **匹配**：文本逐字符走自动机，当前状态高亮；遇无转移沿 **fail 跳**（fail 边点亮）；到达的状态若是某模式终点则**报告命中**（含沿输出链的重叠命中）。
4. 固定模式 `{he, she, hers}` + 文本 `"ushers"` → 8 状态、3 条非平凡 fail 边（`sh→h`、`she→he`、`hers→s`）；命中 **she[1,3]、he[2,3]、hers[2,5]**（三处重叠）。

## 验收标准

- `/docs/aho-corasick` 新页：介绍正文（讲清 Trie + fail 指针是 π 的多模式版 + BFS 构造 + 匹配不回退）+ 播放器同屏，右侧四语言代码随步高亮。
- 动画：Trie 逐模式成形 → BFS 逐状态建 fail（非平凡 fail 边虚线）→ 文本 ushers 逐字符匹配（fail 跳可见、重叠命中报告）；走到 `done` 汇总三处命中。
- 菜单 + 首页「字符串」新增第 7 项，新图标 `aho-corasick.svg`。
- 全门禁绿（format/lint/type-check/单测覆盖率/e2e）；真机自检确认 Trie、fail 边、匹配轨迹、重叠命中；既有算法零回归（尤其 8 个图算法的 GraphView 消费者）。

## 非目标

- 不做通用交互输入（自定义模式/文本）——固定 `{he,she,hers}` + `"ushers"` 讲清即可。
- 指向根的默认 fail 边**不画**（只在字幕说明），避免图面被指向根的连线淹没；只画跨分支的非平凡 fail 边。
- 不做后缀自动机 / 后缀树——本页聚焦 Trie + fail 的多模式匹配。
- 不改 AlgorithmPlayer；GraphView 仅 additive 加一条 `.fail` 边样式（`edgeClass` 已是通用字典，其它算法零回归）。

## 变更历史

- 2026-07-04：创建（draft → approved）。字符串第 7 页，AC 自动机 Aho-Corasick 多模式匹配，复用 GraphView（additive .fail 边样式），承接 KMP 把「单串 π 跳」推广到「Trie 上 fail 跳」。
- 2026-07-04：交付验收（approved → verified）。18 Case 全绿（GraphView .fail 2 + module 12 + 视图 3 + e2e 1）+ 改 TC-HOOK 2；真机自检确认 Trie 逐模式成形（8 状态 + 终态 badge he/she/hers）、3 条 fail 虚线边（sh→h/she→he/hers→s）、匹配 fail 跳（读 'r' 时 she→he 跳到 her）、三处重叠命中 she[1,3]/he[2,3]/hers[2,5]；8 图算法零回归；GraphTrack/AlgorithmPlayer 零改动。
