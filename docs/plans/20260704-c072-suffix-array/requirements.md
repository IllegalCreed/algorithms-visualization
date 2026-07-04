# 需求：后缀数组（C-20260704-072，字符串第 5 页 · 后缀结构 · 倍增法）

> Status: verified
> Stable ID: C-20260704-072
> Owner: IllegalCreed
> Created: 2026-07-04
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

字符串大类已有 4 页：三种模式匹配（KMP/Rabin-Karp/Boyer-Moore，共用 KmpView）+ 回文结构分析（Manacher，ManacherView）。还差一味最重要的**后缀结构**——它是一大批字符串问题（最长公共子串、不同子串计数、重复子串）的通用底座。

**后缀数组（Suffix Array）** 是把一个串的**所有后缀按字典序排好序**，用一个数组 `sa[]` 表示（`sa[i]` = 排名第 i 的后缀起点）。朴素做法对 n 个后缀直接排序是 O(n² log n)；**倍增法**用「先按长度 1 排、再按长度 2、4、8… 每次把已算的 rank 拼成新的排序关键字」，只需 O(n log²n)——每一轮把可比较的前缀长度翻倍，是「用上一轮结果加速这一轮」的又一典范。

## 目标

在字符串大类新增第 5 页「后缀数组」，接入算法播放器（`AlgorithmPlayer`）：

1. **新建 SuffixArrayView 后缀轨**（第 15 条播放器轨，additive 可插拔）：顶部原串（带下标）；下方一张**后缀表**——按当前 `sa` 顺序列出每个后缀（起点下标 + 后缀文本 + 当前 `rank` + 本轮排序关键字 `(rank[i], rank[i+k])`），随倍增逐轮细化；当前倍增长度 `k` 醒目。
2. **倍增逐轮重走**：`init`（列出后缀、按首字符定初始 rank + 排序）→ 每轮 `sort`（按 `(rank[i], rank[i+k])` 重排）+ `rank`（重编 0 基 rank）→ `done`（所有 rank 互不相同，`sa` 定型）。
3. 固定输入 `"banana"` → `sa = [5,3,1,0,4,2]`（后缀 a / ana / anana / banana / na / nana）；倍增 k=1→2 两轮收敛。

## 验收标准

- `/docs/suffix-array` 新页：介绍正文（讲清倍增思想：每轮比较长度翻倍、rank 拼关键字）+ 播放器同屏，右侧四语言代码随步高亮。
- 动画：后缀表随每轮 `sort`/`rank` 重排与重编号，`k` 翻倍；走到 `done` 时顺序 = 字典序，`sa = [5,3,1,0,4,2]`。
- 菜单 + 首页「字符串」新增第 5 项，新图标 `suffix-array.svg`。
- 全门禁绿（format/lint/type-check/单测覆盖率/e2e）；真机自检确认倍增两轮、终态 sa 正确；既有算法零回归。

## 非目标

- 不做 SA-IS / DC3 等线性构造——倍增法足够展示核心思想且步数可控。
- 不做 height 数组 / LCP——本页聚焦「构造后缀数组」本身，LCP 留待后续。
- 不改 AlgorithmPlayer 既有轨；SuffixArrayView 为新增 additive 轨。

## 变更历史

- 2026-07-04：创建（draft → approved）。字符串第 5 页，后缀数组倍增法，新建 SuffixArrayView 后缀轨（第 15 轨），给字符串大类补「后缀结构」维度。
- 2026-07-04：交付验收（approved → verified）。21 Case 全绿（SuffixArrayView 3 + 播放器接线 2 + module 12 + 视图 3 + e2e 1）+ 改 TC-HOOK 2；真机自检确认 banana 倍增两轮、后缀表按字典序 a/ana/anana/banana/na/nana、sa=[5,3,1,0,4,2]、rank 0-5 全不同；既有算法零回归；播放器可插拔轨达 15 条。
