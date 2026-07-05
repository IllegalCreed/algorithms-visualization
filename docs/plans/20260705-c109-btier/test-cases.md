# 测试用例：M9 B 档变体正文补强（C-20260705-109）

> Status: verified
> Stable ID: C-20260705-109
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L4
> 命名空间：`TC-VIEW-BELLMAN-04`、`TC-VIEW-SA-04`

## L4

| 用例 ID            | 期望                                            |
| ------------------ | ----------------------------------------------- |
| TC-VIEW-BELLMAN-04 | Bellman 页正文含「差分约束」与「x_v − x_u ≤ w」 |
| TC-VIEW-SA-04      | 后缀数组页正文含「后缀自动机」与「SAM」         |

## 回归

两页既有断言原样通过；无路由/菜单/播放器改动。

## 自测报告

- 执行：1961/1961 全绿（+2）；两页既有用例零回归；门禁四查全绿。
- B 档巡检表 10/10 全部闭环（8 项此前已点到 + 本次 2 项）。

## 变更历史

- 2026-07-05：创建即交付（draft → verified）。
