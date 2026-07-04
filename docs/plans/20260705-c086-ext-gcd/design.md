# 设计：扩展欧几里得（C-20260705-086，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-086
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

30,18：下行 `[30,18,1]/[18,12,1]/[12,6,2]/[6,0,−]`；基例 (1,0)；回代行 2 `(0,1)`、行 1 `(1,−1)`、行 0 `(−1,2)`；每层验证 `a·x+b·y=6`。模逆元例 `extgcd(3,7)` → 3⁻¹ mod 7 = 5。

## 复用（无 T0）

MatrixView 第 8 消费者零改动：`labels=['a','b','q','x','y']`、`rowLabels=['第0层','第1层','第2层','基例']`、`cells:(number|null)[][]`（q 基例行与未填 x/y 为 null）、`emptyText:''`、`active`（当前填格）、`updatedCell`（刚填）、`sources`（回代引用的下一行 x'/y' 两格）。`ExtGcdExecPoint = 'init'|'down'|'base'|'up'|'done'`（仅 types 加执行点类型，无轨字段改动）。

## T1：oracle + module + sources

`extgcd.ts`：`EG_A=30, EG_B=18`；`extGcd(a,b)` 递归返回 `{g,x,y}`；`egRows()` 返回下行表 + 回代系数（与递归对拍）。
`extgcd.module.ts`：init（空表）→ down×3（行 i 填 a,b,q，active/updatedCell 扫过）→ base（行 3 填 6,0 + x=1,y=0，caption 基例恒等式）→ up×3（行 i 填 x=y'、y=x'−q·y'，sources=[[i+1,3],[i+1,4]]，caption 公式 + 验证 a·x+b·y=6）→ done（x=−1,y=2 + 模逆元语义）。9 步。vars：a/b、gcd、当前层、Bézout。
`extgcd.sources.ts`：四语言递归 extgcd，lineMap init/down/base/up/done。

## T2：页面 + 接线

`ExtGcd.vue`（Algorithm 目录）正文（Bézout、下行/回代推导、模逆元 3⁻¹ mod 7=5、RSA）；路由 `/docs/ext-gcd`；菜单/首页数论第 5 项；新 svg；改 TC-HOOK；GCD 页尾双向链接。

## 复用与零回归

MatrixView 零改动（Floyd/编辑距离/背包×2/LCS/LIS/硬币找零 7 消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：MatrixView 第 8 消费者零改动（labels/rowLabels/cells/emptyText/active/updatedCell/sources 全复用）；extgcd oracle egRows 与递归 extGcd 对拍、module 9 步。
