# 设计：中国剩余定理（C-20260705-087，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-087
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

孙子算经 `rs=[2,3,2]、ms=[3,5,7]`：`M=105`；`M₀=35（≡2 mod 3，逆 2）、M₁=21（≡1 mod 5，逆 1）、M₂=15（≡1 mod 7，逆 1）`；项 `140/63/30`（每项对异模全 ≡0、对本模 ≡rᵢ，已全验）；合计 `233`，`233 mod 105 = 23`（23 mod 3/5/7 = 2/3/2 ✓）。

## 复用（无 T0）

MatrixView 第 9 消费者零改动：`labels/colLabels=['r','m','Mᵢ','tᵢ','项']`、`rowLabels=['同余①','同余②','同余③','合计']`、`cells:(number|null)[][]`（未填为 null，合计行仅末格）、`emptyText:''`、`active/updatedCell`（当前填格）、`sources`（mi 步引用 mᵢ；inv 步引用 Mᵢ/mᵢ；term 步引用 r/Mᵢ/tᵢ；sum 步引用三项）。`CrtExecPoint = 'init'|'mi'|'inv'|'term'|'sum'|'done'`（仅 types 加执行点类型，无轨字段改动）。

## T1：oracle + module + sources

`crt.ts`：`CRT_RS=[2,3,2]、CRT_MS=[3,5,7]`；`crtBrute()` 暴力扫 0..M−1 作独立真值；`modInverse(a,m)` 复用 `extgcd.ts` 的 `extGcd`；`crtRows()` 返回每行 `{r,m,Mi,ti,term}` + `crtSolve()` 构造解（与暴力对拍）。
`crt.module.ts`：init（r/m 两列就位 + M=105）→ 每行三步 mi（M/mᵢ，「只在第 i 条有声音」）/ inv（扩欧求逆校准成 1，caption 带 `Mᵢ≡· (mod mᵢ)` 与验证）/ term（专属项，caption 验证本模 ≡rᵢ、异模 ≡0）→ sum（233，sources 三项）→ done（233 mod 105 = 23 + RSA-CRT 语义）。**12 步**。vars：模、M、当前同余、合计/x。
`crt.sources.ts`：四语言 crt（reduce 求 M → 循环 Mᵢ/tᵢ/累加 → mod M），lineMap init/mi/inv/term/sum/done。

## T2：页面 + 接线

`Crt.vue`（Algorithm 目录）正文（孙子算经原题、三步构造、唯一性、RSA-CRT/裂模应用、链扩欧+快速幂）；路由 `/docs/crt`；菜单/首页数论第 6 项；新 svg（三模汇聚 → x=23）；改 TC-HOOK；扩欧页「中国剩余定理」双向链接。

## 复用与零回归

MatrixView 零改动（Floyd/编辑距离/背包×2/LCS/LIS/硬币找零/扩欧 8 消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：MatrixView 第 9 消费者零改动（labels/rowLabels/cells/emptyText/active/updatedCell/sources 全复用）；crt oracle crtBrute 暴力独立真值与 crtSolve 构造解对拍、module 12 步。
