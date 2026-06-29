# 实现记录：线段树 Segment Tree（C-20260629-033）

> Status: verified
> Stable ID: C-20260629-033
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **useSegTree.ts**（L3）：先 `useSegTree.spec.ts`（TC-SEG-LOGIC-01..11）跑红 → 实现固定建树 + `query` / `update` / `reset` 跑绿。
2. **SegTreeViz.vue**（L4）：先 `SegTreeViz.spec.ts`（TC-VIZ-SEGVIZ-01..08）跑红 → 实现 SVG 二叉树 + 区间和/更新/重置点亮跑绿。
3. **SegmentTree.vue + 4 处接线**（L4）：先 `SegmentTree.spec.ts`（TC-VIEW-SEG-01/02）跑红 → 建页 + 路由/菜单/首页/图标 + 改 HOOK 计数 12→13 跑绿。
4. **e2e**（L5）：`e2e/segment-tree.spec.ts`（TC-E2E-SEG-01）。
5. 全门禁 → 回写四文档/三索引/roadmap/backlog → 两提交 → 双轨部署。

## 关键实现笔记

- **建树**：`build(arr, nodes, pos, lo, hi, depth)` 递归写 `nodes[pos]`；`lo===hi` 叶 `sum=arr[lo]`，否则 `mid=(lo+hi)>>1` 建左右后 `sum=左+右`。n=8（2 的幂）→ 恰 15 节点、叶 pos 7..14、root 37。`nodes` 用 `ref`（update/reset 会改）。
- **query 三态拆段**（纯）：`go(pos)` —— 与 [l,r] 不相交→0；完全落入→`covered.push(pos)` 返回 `sum`；部分相交→`go(左)+go(右)`。covered 即「canonical 整段」集（O(log n) 个）。
- **update 叶→根**（同步）：从 root 按 `i<=mid` 下沉收集 root→leaf，叶置新值，`reverse()` 得叶→根后逐个重算内部 `sum=左+右`；每步用 `{...list[p], sum}` 重建对象 + 末尾 `nodes.value=[...list]` 触发响应式。返回 `{path}`（叶→根）。
- **点亮 class**：SegTreeViz 用两个 `Set<number>`（pos）—— `covered`（查询整段，绿 `#4caf50`）与 `onpath`（更新路径，黄 `#ffcf5c`）；onRange 置 covered/清 onpath、onUpdate 反之、onReset 清两者。`:class="{ covered, onpath, leaf }"` 绑定在 `<g class="seg-node">`。
- **同步置态保证 L4 可断言**：query/update 同步返回、同步写 status + 高亮 Set；高亮渐显交给 CSS `transition: fill 0.25s`（无 setTimeout 步进），故 L4 能直接断言 `.covered` 数=2、`.onpath` 数=4，无需推进定时器。
- **坐标复用**：`xOf(pos)` 用 `depth=⌊log2(pos+1)⌋` + 折半定位（承袭 Tree/Heap），`yOf=24+depth*58`；边 pos 1..14 连 parent `(pos-1)>>1`，共 14 条。
- **输入校验**：区间和要 `0≤a≤b≤7` 整数；更新要 `0≤a≤7` 整数下标 + 整数新值；非法只改 status 不动数据。
- **坑**：本变更无新坑——按钮文案「区间和 / 更新 / 重置」互不为子串，状态「取用 / 更新了」区分清晰；重置走 `seg.reset()` 重建，始终可点。真机首张截图因浏览器旧标签残留误显 update 态，干净 reload 后初始 root 37 正确。

## 自测报告

见 [test-cases.md](./test-cases.md#自测报告2026-06-29)。全门禁绿（format/lint/type-check/单测 724 + 覆盖率 92.8%/单测聚合/e2e 28），真机截图自检通过。

## 变更历史

- 2026-06-29：创建（draft）→ TDD（L3 useSegTree 11 → L4 SegTreeViz 8 → L4 SegmentTree 视图 2 + 4 处接线 + 改 2 HOOK → L5 e2e 1）→ 全门禁绿 → 真机自检 → verified。
