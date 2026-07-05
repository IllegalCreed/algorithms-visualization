# 需求：M9 B 档变体正文补强（C-20260705-109，两页正文各一段 · M9 B 档收尾）

> Status: verified
> Stable ID: C-20260705-109
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

`docs/plans/completion-backlog.md` B 档变体巡检表遗留两项待补：**差分约束**（应挂靠 Bellman-Ford 页）与**后缀自动机**（应挂靠后缀数组页）。其余 8 项巡检时已确认在各页正文点到。原则：变体不开新页，正文一段讲清「是什么 + 与本页算法的关系」。

## 目标

1. Bellman.vue 末尾新增「差分约束」一节：x_v − x_u ≤ w ⟺ 边 u→v 权 w（三角不等式同构），跑 Bellman-Ford 得可行解、负环 = 矛盾无解。
2. SuffixArray.vue 结尾段扩写「后缀自动机（SAM）」点到：O(n) 自动机、在线构造、适用场景与学习定位。
3. 各 +1 L4 断言（TC-VIEW-BELLMAN-04 / TC-VIEW-SA-04）。

## 验收标准

正文两段上线 + 两断言绿 + 全门禁；无路由/菜单/播放器改动。**至此 M9（A 档 6 页 + B 档巡检）全部完成。**

## 非目标

不做差分约束/SAM 的独立可视化页（机动项模拟退火另行评估）。

## 变更历史

- 2026-07-05：创建即交付（draft → verified）。轻量正文变更，随 C-108 同批真机验证。
