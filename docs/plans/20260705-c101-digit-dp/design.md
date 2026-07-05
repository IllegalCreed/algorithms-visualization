# 设计：数位 DP（C-20260705-101，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-101
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

`N=245`、禁 4。走位（高→低）：百位 d=2：free 可填 {0,1}（<2 且 ≠4）2 个 × 9²=81 → **162**，tight 2≠4 ✓ 贴着走；十位 d=4：free {0,1,2,3} 4 个 × 9=36 → **36**，tight 位上就是 4 → **断裂**；个位 d=5：tight 已断整位跳过；合计 162+36=**198**（含 0，tight 未活到最后故无 N 自身 +1）→ [1,245] = **197 = 暴力**。

## 复用（无 T0）

MatrixView 第 14 消费者零改动：4 行 `rowLabels=['百位 2','十位 4','个位 5','合计']` × 4 列 `colLabels=['位上','可选数','后缀 9^k','小计']`；free 步填行 4 格（updatedCell=小计）、tight 步 active=位上格、broken 行仅 [5,null,null,null]、sum 步 sources=[[0,3],[1,3]]。`DigitDpExecPoint = 'init'|'free'|'tight'|'broken'|'sum'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`digitdp.ts`：`DD_N=245`、`DD_BAN=4`；`digitWalk()` 返回 `{rows:[{d,cnt,pow,sub,tightOk}],total,ans}`；`bruteCount()` 逐个检查（独立真值）。
`digitdp.module.ts`：init（暴力爆炸 + 两分支思路）→ 百位 free/tight → 十位 free/tight（断裂戏剧点 caption）→ broken（个位跳过）→ sum（198 → 减 0 得 197，sources 两小计）→ done（197 + 记忆化模板 + 应用清单）。**8 步**。vars：N、当前位、tight 状态、累计。
`digitdp.sources.ts`：四语言迭代走位（free 分支累加 + tight 判定 + 末尾 N 自身补偿 + 去 0），lineMap init/free/tight/broken/sum/done。

## T2：页面 + 接线

`DigitDp.vue`（Algorithm 目录）；路由 `/docs/digit-dp`；菜单/首页「动态规划」第 10 项（tree-dp 后）；新 svg（数位 2·4·5 + 断裂闪电)；改 TC-HOOK（DP 9→10 两 spec）。

## 复用与零回归

MatrixView 零改动（13 既有消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：走位表 free/tight 双步、broken 整位跳过、sum 去 0；oracle digitWalk 与 bruteCount 逐检对拍；module 8 步。
