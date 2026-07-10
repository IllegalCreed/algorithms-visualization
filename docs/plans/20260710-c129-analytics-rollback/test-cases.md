# 测试用例：撤销第三方分析接入

> Status: verified
> Stable ID: C-20260710-129
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## Case

| Case ID                | 层级 | 场景                     | 预期                                             |
| ---------------------- | ---- | ------------------------ | ------------------------------------------------ |
| TC-ANL-ROLLBACK-129-01 | L3   | production/selfhost 配置 | 仅保留 base，不含分析 provider/script/website ID |
| TC-ANL-ROLLBACK-129-02 | L3   | App 与三类交互源码       | 不导入 client、不调用 `trackEvent`               |
| TC-ANL-ROLLBACK-129-03 | L3   | UTM 生成能力             | 纯函数和 `marketing:link` 入口继续存在           |

## TDD 记录

| 阶段                 | 红测                        | 绿测         | 结果   |
| -------------------- | --------------------------- | ------------ | ------ |
| T1 rollback boundary | 2 failed / 1 passed（预期） | 3 passed / 3 | passed |

## 变更历史

- 2026-07-10：创建 3 个撤销边界 Case。
- 2026-07-10：红测准确命中环境与运行时残留；删除接线并保留 UTM 后 3/3，完整门禁通过。
