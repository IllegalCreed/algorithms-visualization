# 实现记录：LCA 倍增（C-20260705-104，纯复用 MatrixView · M9-2）

> Status: verified
> Stable ID: C-20260705-104
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：lca.module.spec（TC-LCA-MOD-01..12）红 → lca.{ts,sources,module} 绿（types 仅 +LcaExecPoint）。
2. T2：Lca.vue + 路由 + 菜单/首页图算法第 11 项 + svg + TC-HOOK（10→11）+ 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- oracle `lca.ts`：父数组 `LCA_PAR=[-1,0,0,1,1,2,3,6]` 满足 par[u]<u，depth 一趟循环即得；`lcaTrace` 对齐后 u===v 直接返回（本页两查询都不走此支，64 全对里覆盖）；`bruteLca` 祖先集合 + 爬链，独立真值。
- module 11 步：build×3 逐列（up¹ 递推示例格 [[7,1],[6,1]]、up² [[7,2],[3,2]]）；查询步 sources 一律指「被查的跳表格」；jump 步承载「祖先相同不敢跳（可能越过）」的核心教学句。
- sources：`LangSource` 必填 `label`（Tab 文案）——首版漏掉被 type-check 拦下；lineMap 全部落语义行（ts jump 落判定行 12 而非执行行 13，写后逐行核对修正）。
- MatrixView 纯复用零改动，-1 → null 留空（emptyText=''），第 16 消费者。

## 自测报告

见 [test-cases.md](./test-cases.md) 自测报告节：1895/1895 全绿、96.21%/95.91%，e2e 3/3，真机关键步截图核验通过。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
