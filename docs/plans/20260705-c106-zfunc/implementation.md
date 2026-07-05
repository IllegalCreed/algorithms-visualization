# 实现记录：Z 函数（C-20260705-106，复用 ManacherView additive 标签 · M9-4）

> Status: verified
> Stable ID: C-20260705-106
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. T0：VIZ spec（TC-VIZ-MN-04/05）红 → types +labels?/statusLabels? + ManacherView 回退消费 绿。
2. T1：zfunc.module.spec（TC-Z-MOD-01..12）红 → zfunc.{ts,sources,module} 绿（types +ZExecPoint）。
3. T2：ZFunction.vue + 路由 + 菜单/首页字符串第 8 项 + svg + TC-HOOK（7→8）+ 页 spec + e2e。
4. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- 实例 aabaaab 三剧情齐靠精心挑串：i=4 镜像 z[1]=1 恰好 = box 余量 r−i=1（达界），右扩 +2 后 box 大步刷新 [4,7)；i=5 镜像 1 < 余量 2（纯抄零比较）。
- oracle 事件带 prevBox（进入本 i 时的旧 box）——mirror 步视觉要显旧 box 带与旧 l 的镜像位置，boxUpd 后的新 box 只在 extend 步亮。
- ManacherView additive：labels?/statusLabels? 两可选字段 + 模板三处回退读取；Manacher 页不设全回退（VIZ-05/06 + e2e manacher 实证零回归）。
- z[0] 约定取 n（整串比自己），caption 建立「LCP」语义即不参与三分支。
- lint 陷阱重演：Z_S 导入 module 未用（C-105 同款），删除；ts done 行首次落在闭合括号 14 → 修 13（return 行）。

## 自测报告

见 [test-cases.md](./test-cases.md) 自测报告节：1927/1927 全绿、96.25%/95.90%，e2e 3/3，真机 mirror/extend 关键步核验通过。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
