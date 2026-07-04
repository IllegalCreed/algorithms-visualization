# 需求：LCP / height 数组（C-20260704-073，字符串第 6 页 · 后缀结构 · Kasai）

> Status: verified
> Stable ID: C-20260704-073
> Owner: IllegalCreed
> Created: 2026-07-04
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

C-072 构造了**后缀数组** `sa`（把所有后缀按字典序排好），并在页尾预告：「再算一遍相邻后缀的最长公共前缀（height/LCP），不同子串计数、最长重复子串等应用就都水到渠成——那是后缀结构的下一步。」本页就是这一步。

**LCP 数组（height）**：`lcp[i]` = 排序后**相邻两个后缀** `sa[i-1]` 与 `sa[i]` 的**最长公共前缀长度**。直接对每对比较是 O(n²)；**Kasai 算法**用一个漂亮的单调性做到 **O(n)**：**按后缀在原串中的起点 `i=0,1,2…` 顺序处理**，维护一个公共前缀长度 `h`，则去掉首字符后 `h` 至多减 1（`h[i] ≥ h[i-1] − 1`）——所以 `h` 全程只增或减 1，字符不重复比较。有了 sa + lcp，「不同子串数 = n(n+1)/2 − Σlcp」「最长重复子串 = max(lcp)」一趟即得。

## 目标

在字符串大类新增第 6 页「LCP / height 数组」，接入算法播放器（`AlgorithmPlayer`）：

1. **扩展 SuffixArrayView 为「LCP 模式」**（additive，SA 构造页不受影响）：复用后缀表（起点 / 后缀 / rank），把「关键字」列换成 **LCP 列**（逐格填 `sa[i-1]` 与 `sa[i]` 的 LCP）；当前处理的后缀行琥珀高亮、其排序前驱行蓝高亮。
2. **Kasai 逐步重走**：`init`（展示已排好的后缀表 + 空 LCP 列）→ 对每个原始下标 `i`：`fill`（找到 `i` 的排序位次、与前驱比较、`h` 只减 1 起扩、填 `lcp[rank[i]]`）或 `skip`（`rank[i]=0` 无前驱）→ `done`（LCP 齐、给出应用值）。
3. 固定输入 `"banana"`（sa=[5,3,1,0,4,2]）→ `lcp=[0,1,3,0,0,2]`；应用：不同子串数 **15**、最长重复子串 **"ana"（长 3）**。

## 验收标准

- `/docs/lcp-array` 新页：介绍正文（讲清 LCP 定义 + Kasai 的 h 单调性）+ 播放器同屏，右侧四语言代码随步高亮。
- 动画：后缀表 + LCP 列**非顺序填充**（Kasai 按原始下标处理，直观展示「跳着填」）；当前/前驱行分色；`h` 计数在 vars 可见「只减 1」。走到 `done`，lcp=[0,1,3,0,0,2]、max=3。
- 菜单 + 首页「字符串」新增第 6 项，新图标 `lcp-array.svg`。
- 全门禁绿（format/lint/type-check/单测覆盖率/e2e）；真机自检确认 LCP 列、Kasai 顺序、应用值；既有算法零回归（尤其 C-072 SuffixArrayView 构造模式）。

## 非目标

- 不做后缀自动机 / 后缀树——本页聚焦「SA 的伴生数组 LCP」。
- 不做基于 LCP 的复杂应用（多串最长公共子串等）——只点出「不同子串数 / 最长重复子串」两个一趟应用。
- 不改 AlgorithmPlayer；SuffixArrayView 仅 additive 扩展（构造模式零回归）。

## 变更历史

- 2026-07-04：创建（draft → approved）。字符串第 6 页，LCP/height 数组 Kasai 算法，扩展 SuffixArrayView 为 LCP 模式，接续 C-072 后缀数组、把后缀结构的构造→应用讲通。
- 2026-07-04：交付验收（approved → verified）。19 Case 全绿（SuffixArrayView LCP 模式 3 + module 12 + 视图 3 + e2e 1）+ 改 TC-HOOK 2；真机自检确认 LCP 列 [-,1,3,0,0,2]、Kasai 非顺序跳填、当前/前驱行高亮、max=3/不同子串 15；C-072 构造模式零回归；AlgorithmPlayer 零改动。
