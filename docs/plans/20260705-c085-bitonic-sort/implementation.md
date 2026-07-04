# 实现记录：双调排序（C-20260705-085，新建 NetworkView）

> Status: verified
> Stable ID: C-20260705-085
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. T0：types +Comparator/NetworkTrack/NetworkExecPoint/Step.network?；NetworkView.spec（TC-VIZ-NETVIEW-01..03）+ AlgorithmPlayer.spec（TC-PLAYER-NET-01/02）红 → NetworkView.vue + v-if 绿。
2. T1：bitonic.module.spec（TC-BN-MOD-01..12）红 → bitonic.{ts,sources,module} 绿。
3. T2：BitonicSort.vue + 路由 + 菜单/首页排序第 16 项 + svg + TC-HOOK + 页 spec + e2e。
4. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **新建第 20 轨 NetworkView**：8 wire 均布 + 左端 .net-val 标当前值；比较器按列均布竖线 + 端点圆 + 大值流向三角（asc 指下/desc 指上）；三态 .net-active（琥珀）/.net-done（绿）/默认灰，由 currentCol 推导。
- **oracle bitonic.ts**：buildComparators 位运算展开（k×j 双循环 → 6 列 24 比较器）；runNetwork 逐列快照；networkSortsAll(200) LCG 随机自检（网络数据无关性的直接验证）。
- **module 8 步**：init（固定网络说明）→ column×6（快照+colNote 分构造/合并阶段、列 2 点明双调成形）→ done（并行深度语义）。
- 页面放 SortAlgorithm 目录；排序 children 15→16（菜单/首页第 3 位，冒泡/鸡尾酒后）。

## 自测报告

- 门禁全绿 1608/95.83%/95.38%；e2e 3/3 首跑全过；真机三态网络+双调成形+有序。
- 回归：新 Step.network? additive；既有算法不设 → NetworkView 不渲染。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
