# 实现记录：布隆过滤器 Bloom Filter（C-20260629-036）

> Status: verified
> Stable ID: C-20260629-036
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **useBloom.ts**（L3）：先 `useBloom.spec.ts`（TC-BLOOM-LOGIC-01..12）跑红 → 实现固定 m/k + 哈希 + add/query/reset 跑绿。
2. **BloomViz.vue**（L4）：先 `BloomViz.spec.ts`（TC-VIZ-BLOOMVIZ-01..09）跑红 → 实现 16 位数组 + 探测点亮 + 误判演示跑绿。
3. **BloomFilter.vue + 4 处接线**（L4）：先 `BloomFilter.spec.ts`（TC-VIEW-BLOOM-01/02）跑红 → 建页 + 路由/菜单/首页/图标 + 改 HOOK 计数 14→15 跑绿。
4. **e2e**（L5）：`e2e/bloom-filter.e2e.ts`（TC-E2E-BLOOM-01）。
5. 全门禁 → 回写四文档/三索引/roadmap/backlog（**M4 广度收官**）→ 两提交 → 双轨部署。

## 关键实现笔记

- **三个确定性哈希**：`bloomHashes(x)=[x%16, 7x%16, (11x+5)%16]`（模块级纯函数）。useBloom 暴露 `hashes` 包一层。
- **状态**：`bits` 用 `ref<boolean[]>`（16 个 false），index 赋值 `bits.value[p]=true` 在 Vue3 ref 数组上是响应式的（.value 为 reactive proxy），viz 直接绑 `bloom.bits.value` 渲染。`added` 用普通 `Set`（非响应式）——它**只**用于教学点破误判，不参与布隆判断、不需要驱动渲染。
- **add**：置 3 位 + `added.add(x)`，返回 positions；幂等（位已 1 再置仍 1）。
- **query**：`mightExist = positions.every(p => bits[p])`；`falsePositive = mightExist && !added.has(x)`。布隆本身不知道是否误判（它不存原值），靠旁路 `added` 集合对比才能标注「这是假阳性」——这正是教学关键。
- **reset**：bits 重建全 false + `added.clear()`。
- **点亮 class**：BloomViz 用 `bloom.bits.value[i]` → `.set`（绿），`probe`（`Set<number>` 本次哈希位）→ `.probe`（橙描边）；`isFalsePositive` ref → status 标橙红 `.warn`。add/query 同步置态，L4 直接断言 `.set` 计数 / `.probe` 计数 / status。
- **演示数据**（加 3/7/11 → 位 {1,2,3,5,6,7,11,13,14}）：query(7) 真命中、query(5) 位含 0 一定不存在、query(2) 位 [2,14,11] 全 1 但没加过 → 误判（干净的 3 互异位假阳性例子）。
- **坑预防**：按钮「加入/查询/重置」btn includes 互不为子串；状态「可能存在」「一定不存在」「误判」三者互不为子串（注意「一定不存在」含「存在」但不含「可能存在」），故 query(7) 断言含「可能存在」且 NOT「误判」、query(5) 含「一定不存在」、query(2) 含「误判」均安全。

## 自测报告

见 [test-cases.md](./test-cases.md#自测报告2026-06-29)。全门禁绿（format/lint/type-check/单测 770 + 覆盖率 92.91%/e2e 30），真机截图自检通过（加入 3/7/11 后 9 格置 1、查询 2 演示误判假阳性）。

## 变更历史

- 2026-06-29：创建（draft）→ TDD（L3 useBloom 12 → L4 BloomViz 9 → L4 BloomFilter 视图 2 + 4 处接线 + 改 2 HOOK → L5 e2e 1）→ 全门禁绿 → 真机自检 → verified。**M4 广度 B1–B7 全收官。**
