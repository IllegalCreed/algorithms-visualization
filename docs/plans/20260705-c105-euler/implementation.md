# 实现记录：欧拉路径 Hierholzer（C-20260705-105，纯复用 GraphView · M9-3）

> Status: verified
> Stable ID: C-20260705-105
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：euler.module.spec（TC-EU-MOD-01..12）红 → euler.{ts,sources,module} 绿（types 仅 +EulerExecPoint）。
2. T2：EulerPath.vue + 路由 + 菜单/首页图算法第 12 项 + svg + TC-HOOK（11→12）+ 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- 实例边输入序是精心挑的：`[(1,3),(3,4),(4,2),(2,3),(2,1),(1,0),(0,2)]` 让贪心先走 1-3-4-2-3 在终点 3 提前卡住（3 条边用光），弹栈后栈顶 2 还有余边——「子环 2-1-0-2 插入」的 Hierholzer 精髓剧情才出现；朴素输入序会一口气走完 7 边、没有中途回溯。
- 弹栈细节：首 back 弹的是栈顶的 3（第二次出现），栈底部仍有另一个 3——test-cases MOD-08 的 stackNodes 断言据此改为 activeNode 断言。
- module 合并策略：首 back 单独一步（教学点），后续连环 back×7 合并为一步（清栈 + 反转）；GraphView 纯复用（stackNodes 虚线环 + nodeBadge 剩余度数 + checkPair 高亮奇度对 + edgeClass mst 消边）。
- oracle 三件：eulerTrace 栈法 + bruteEulerPath 回溯搜路（完全不同的搜索方式）+ isValidEulerPath 验证器，双向对拍。
- lint 陷阱：EULER_N 导入 module 未用被 no-unused-vars 拦，删除。

## 自测报告

见 [test-cases.md](./test-cases.md) 自测报告节：1910/1910 全绿、96.22%/95.84%，e2e 3/3，真机关键步核验通过。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
