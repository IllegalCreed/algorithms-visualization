# 实现：撤销第三方分析接入

> Status: verified
> Stable ID: C-20260710-129
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序

1. 增加禁用边界测试并确认现状红测。
2. 删除 Umami transport、配置、接线、隐私入口和 analytics L5。
3. 保留并验证 UTM CLI/纯函数。
4. 跑全门禁、双 base 与产物扫描；提交后按既有双轨流程发布。
5. 回写 C125 superseded 与当前项目事实。

## 检查清单

- [x] T1 禁用边界先红后绿。
- [x] T2 删除第三方运行时与 UI 接线。
- [x] T3 全门禁、coverage、L5、双 base。
- [x] T4 文档回写并将 C125 标记 superseded。

## 自测报告

| 项目                      | 结果                                                                 |
| ------------------------- | -------------------------------------------------------------------- |
| 红测                      | 3 条边界用例中 2 失败、1 通过；准确暴露环境配置和运行时接线仍存在    |
| 定向绿测                  | rollback + UTM 共 2 files / 8 tests 通过                             |
| `pnpm verify`             | 282 files / 2041 tests；production 95 页通过                         |
| coverage                  | statements 96.37%、branches 95.68%、functions 94.89%、lines 96.88%   |
| Playwright                | 103 files / 110 tests 通过                                           |
| production/selfhost build | 两套各 95 页通过；产物扫描无 Umami/Plausible/website ID/privacy page |
| `pnpm marketing:link`     | 生成 HTTPS UTM 链接通过                                              |

## 变更历史

- 2026-07-10：创建，进入禁用边界红测。
- 2026-07-10：完成红绿回滚、全门禁、coverage、L5、双 base 与产物扫描；状态转 verified。
