# 实现记录：Pollard's Rho（C-20260705-108，纯复用 GraphView · M9-6 收官）

> Status: verified
> Stable ID: C-20260705-108
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：rho.module.spec（TC-RHO-MOD-01..12）红 → rho.{ts,sources,module} 绿（types 仅 +RhoExecPoint）。
2. T2：PollardRho.vue + 路由 + 菜单/首页数论第 10 项 + svg + TC-HOOK（9→10）+ 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- 实例 n=8051（83×97）是 Pollard 教学经典：mod 97 序列 [2,5,26,95,5,26,95,5] 尾 1 环 3——极简 ρ；龟兔第 3 轮 gcd(|677−871|)=97，677≡871≡95 恰为「环上相遇」的可视化实证。
- ρ 布局手法：节点=8 个序列值（mod n 真值做 label），坐标按「mod 97 同余同站台」聚簇（三站台三角排布、二圈值径向内缩）——race 阶段看着是乱跳的链，reveal 步 nodeGroup 四色一上，「同站台绕圈」瞬间现形。
- 龟兔用 GraphView 既有 checkPair（2-SAT 的蓝环对）零改动承载；走过链边 edgeClass mst 渐绿。
- 教训重演：race 三元表达式第一分支模板串末尾多逗号 → Transform failed（C-090/C-098 同款），修一处即绿；lineMap 四语言 race/hit/reveal/done 各有落点错位，逐行数后全部修正（reveal 与 race 同落 gcd 显影行——语义即「为什么 gcd 能显影」）。

## 自测报告

见 [test-cases.md](./test-cases.md) 自测报告节：1959/1959 全绿、96.27%/95.90%，e2e 3/3，真机 reveal 四色站台核验通过。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
