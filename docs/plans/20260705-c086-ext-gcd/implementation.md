# 实现记录：扩展欧几里得（C-20260705-086，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-086
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：extgcd.module.spec（TC-EG-MOD-01..12）红 → extgcd.{ts,sources,module} 绿（types 仅 +ExtGcdExecPoint）。
2. T2：ExtGcd.vue + 路由 + 菜单/首页数论第 5 项 + svg + TC-HOOK + 页 spec + e2e；GCD 页双向链接。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **MatrixView 第 8 消费者纯复用零改动**：5 列 [a,b,q,x,y]×4 行；active 当前格、updatedCell 刚填格、sources 高亮回代引用的下一行 (x′,y′)、emptyText='' 隐 null。types 仅 +ExtGcdExecPoint。
- oracle extgcd.ts：递归 extGcd + egRows（下行表 + 回代系数，二者对拍）；每行满足 a·x+b·y=6。
- module 9 步：init → down×3（填 a,b,q + 除法式 caption）→ base（(1,0) 恒等式）→ up×3（公式 + 逐层验证 caption）→ done（Bézout + 模逆元 RSA 语义）。
- 双向链接：GCD 页尾「扩展版」→ 本页；本页 → GCD/快速幂（RSA 拼图叙事）。

## 自测报告

- 门禁全绿 1623/95.86%/95.44%；e2e 3/3 首跑全过；真机回代三色高亮 + 逐层验证。
- 回归：MatrixView/AlgorithmPlayer 零改动，7 既有消费者零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
