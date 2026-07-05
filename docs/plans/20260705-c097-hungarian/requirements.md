# 需求：二分图匹配·匈牙利算法（C-20260705-097，图算法第 10 页 · 纯复用 GraphView）

> Status: verified
> Stable ID: C-20260705-097
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

图算法线还缺**二分图最大匹配**：左边工人右边岗位、连线表「能干」，问最多安排几对。**匈牙利算法**逐个左点找**增广路**：试探心仪岗位，空闲就定下；被占了就问占用者「能不能让路」（递归给它找别的）——让路成功整条路径翻转，匹配数 +1。O(V·E)，最大流的组合特例，König 定理的算法化。

## 目标

图算法第 10 页「二分图匹配」，接入播放器，**纯复用 GraphView（零改动零新字段）**：

1. **二分图叙事**：左右两列布局（L1-L3 / R1-R3）；`edgeClass` 试探边 `current`（琥珀）、匹配边 `mst`（绿粗）、死路 `rejected`（灰虚）；`nodeBadge` 显示配对（R1←L2）；`activeNode` 当前求偶者；`doneNodes` 已匹配点。
2. 固定实例（Python 已核验）：`L1:{R1,R2}、L2:{R1}、L3:{R2,R3}`——L1 直接匹配 R1；L2 撞 R1 → L1 **让路**到 R2（增广翻转）；L3 撞 R2 → L1 撞 R1 → L2 **无路死巷**回退 → L3 改配 R3。最大匹配 **3** = 暴力枚举对拍。**12 步** = init + (try/match/fail)×10 + done。
3. 正文：增广路直觉（一让一定）→ 复杂度 O(V·E) → König 定理（最大匹配 = 最小点覆盖）→ 应用（任务指派/宿舍分配/棋盘覆盖）；链接最大流页（匹配 = 单位容量最大流）。

## 验收标准

- `/docs/hungarian` 新页：正文 + 播放器同屏，四语言随步高亮；试探/让路/定亲/死路四态边色；done 给匹配数 3。
- 菜单 + 首页「图算法」第 10 项，新图标；改 TC-HOOK（图算法 children 9→10 + 数组尾 +hungarian，两 spec）。
- 全门禁 + 真机自检；GraphView 纯复用零改动（既有 10 消费者零回归）。

## 非目标

- 不做 Hopcroft-Karp / KM 带权匹配（正文点到）；不做通用图匹配（带花树）。
- 不改 AlgorithmPlayer / GraphView（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。匈牙利算法纯复用 GraphView；增广翻转 + 死路回退，12 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK（图算法 9→10）；真机增广步双绿边 + 4 done 节点；GraphView 10 既有消费者零回归（e2e 3/3）。
