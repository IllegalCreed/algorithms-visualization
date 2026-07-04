# 设计：线段相交（C-20260705-084，复用 HullView + edgeClasses）

> Status: verified
> Stable ID: C-20260705-084
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

12 点 3 对线段（分区放置，一屏同显）：

- 对 1：(0,0)-(2,2) vs (0,2)-(2,0) → **规范相交**，D=(-4,4,4,-4)。
- 对 2：(3,0)-(5,0.6) vs (3,1.6)-(5,2.4) → **不相交**（D1=-3.2、D2=-3.6 同号，一步判否）。
- 对 3：(6,0)-(8,2) vs (7,1)-(8,0) → **端点相触**（D3=cross(A,B,C)=0 且 C=(7,1) 在 AB 框上）。

## T0：HullView additive edgeClasses

`HullTrack` 补 `edgeClasses?: (string | null)[]`（与 `edges` 平行；null 用默认样式）。CSS 类：`seg-test`（琥珀 4px）/`seg-yes`（绿 4px）/`seg-no`（灰虚线）。`SegIntExecPoint = 'init'|'test'|'verdict'|'done'`。

## T1：oracle + module + sources

`segint.ts`：`SI_POINTS`（12 点）+ `SI_PAIRS`（3 对，边下标）+ `cross2`/`onSeg` + `segIntersect(a,b,c,d)` 返回 {hit, kind:'proper'|'touch'|'none', ds:[D1..D4]}。
`segint.module.ts`：init（12 点 + 6 边灰显）→ 每对 test（该对两边 seg-test，caption 四叉积）+ verdict（seg-yes/seg-no 定色，caption 结论；已判对保持颜色）→ done（汇总 2 相交 1 不相交）。8 步。
`segint.sources.ts`：四语言跨立试验（d1..d4 + 特判 onSeg），lineMap init/test/verdict/done。

## T2：页面 + 接线

`SegmentIntersection.vue` 正文（跨立直觉/四叉积/D=0 特判/无除法鲁棒）；路由 `/docs/segment-intersection`；菜单/首页几何第 4 项；新 svg；改 TC-HOOK。

## 复用与零回归

HullView edgeClasses additive（凸包页 edges 不传类 → 默认样式不变）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：HullView +edgeClasses（seg-test 琥珀/seg-yes 绿/seg-no 灰虚线）；segint oracle 手算对拍（proper/none/touch）、module 8 步；ts lineMap done 14→12（越界修复）。
