# 需求：线段相交（C-20260705-084，计算几何第 4 页 · 复用 HullView）

> Status: verified
> Stable ID: C-20260705-084
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

叉积在凸包页判「转向」、卡壳页判「远近」，本页用它回答几何最基本的判定问题：**两条线段是否相交**——扫描线求全部交点、多边形运算、碰撞检测的原子操作。

**跨立试验**：线段 AB 与 CD 相交 ⟺ **A、B 分居直线 CD 两侧**且 **C、D 分居直线 AB 两侧**。用叉积的符号表达：`D1=cross(C,D,A)`、`D2=cross(C,D,B)`、`D3=cross(A,B,C)`、`D4=cross(A,B,D)`；若 `D1·D2<0 且 D3·D4<0` → **规范相交**。任一 D=0 表示共线/端点落在对方直线上，需补**框上检查**（on-segment）判是否**相触**。全程只用乘法与比较，无除法、无精度灾难。

## 目标

计算几何第 4 页「线段相交」，接入播放器，**复用 HullView**（additive `edgeClasses`——与 edges 平行的类数组，线段即带类的边）：

1. **三对线段三种结局**：① 规范相交（D=(-4,4,4,-4)，四叉积两两异号）；② 同侧不相交（D1、D2 同号，一步判否）；③ 端点相触（D3=0 + 点在框上 → 相交）。
2. **逐对判定**：每对两步——`test`（两线段琥珀高亮，caption 给四叉积值）+ `verdict`（相交→绿粗，不相交→灰虚线）；`init` + 3×2 + `done` 共 8 步。
3. 判定函数与逐对手算叉积对拍。

## 验收标准

- `/docs/segment-intersection` 新页：正文（跨立直觉、四叉积、D=0 特判、无除法的鲁棒性）+ 播放器同屏，四语言随步高亮。
- 动画：三对线段逐对测试/判定分色；done 汇总 2 相交 1 不相交。
- 菜单 + 首页「计算几何」第 4 项，新图标；全门禁 + 真机自检；既有零回归（HullView edgeClasses additive）。

## 非目标

- 不做 Bentley-Ottmann 扫描线求 n 条线段全部交点（正文点出为延伸）；不求交点坐标（只判定）。
- 不改 AlgorithmPlayer；HullView 仅 additive。

## 变更历史

- 2026-07-05：创建（draft → approved）。线段相交跨立试验，复用 HullView（additive edgeClasses），三对三结局。
- 2026-07-05：交付验收（approved → verified）。19 Case 全绿 + 改 2 HOOK；真机三对分色（绿 X 规范相交/灰虚线不相交/绿相触）；其它几何页零回归。
