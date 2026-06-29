# 测试用例：布隆过滤器 Bloom Filter（C-20260629-036）

> Status: verified
> Stable ID: C-20260629-036
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（useBloom 纯逻辑）/ L4（BloomViz 互动 + BloomFilter 视图）/ L5（布隆页 e2e）
> 命名空间：`TC-BLOOM-LOGIC-*`、`TC-VIZ-BLOOMVIZ-*`、`TC-VIEW-BLOOM-*`、`TC-E2E-BLOOM-*`；**改** `TC-HOOK-01-2` / `TC-HOOK-02-4`

## L3 —— `useBloom` 纯逻辑（`src/components/structures/useBloom.spec.ts`）

固定 m=16、k=3，哈希 `h1=x%16 / h2=7x%16 / h3=(11x+5)%16`。

| 用例 ID           | 场景            | 输入 / 操作                   | 期望                                                                                        |
| ----------------- | --------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| TC-BLOOM-LOGIC-01 | 初始规模        | 初始                          | `bits.length===16` 且全 false；`size===16`、`k===3`                                         |
| TC-BLOOM-LOGIC-02 | 哈希值·3        | `hashes(3)`                   | `[3,5,6]`                                                                                   |
| TC-BLOOM-LOGIC-03 | 哈希值·7/11     | `hashes(7)` / `hashes(11)`    | `[7,1,2]` / `[11,13,14]`                                                                    |
| TC-BLOOM-LOGIC-04 | 加入置位        | `add(3)`                      | 返回 positions `[3,5,6]`；bits 中恰 3 位为 true（3/5/6）                                    |
| TC-BLOOM-LOGIC-05 | 多次加入并集    | `add(3)`、`add(7)`、`add(11)` | 为 true 的位 = `{1,2,3,5,6,7,11,13,14}`（9 位）                                             |
| TC-BLOOM-LOGIC-06 | 查询·真命中     | 加 3/7/11 后 `query(7)`       | `mightExist===true`、`actuallyAdded===true`、`falsePositive===false`                        |
| TC-BLOOM-LOGIC-07 | 查询·一定不存在 | 加 3/7/11 后 `query(5)`       | positions `[5,3,12]`；`mightExist===false`（bit12=0）                                       |
| TC-BLOOM-LOGIC-08 | 查询·误判       | 加 3/7/11 后 `query(2)`       | positions `[2,14,11]`；`mightExist===true`、`actuallyAdded===false`、`falsePositive===true` |
| TC-BLOOM-LOGIC-09 | 查询·未命中有 0 | 加 3/7/11 后 `query(4)`       | positions `[4,12,1]`；`mightExist===false`                                                  |
| TC-BLOOM-LOGIC-10 | 加入幂等        | `add(3)` 两次                 | 仍恰 3 位为 true（位已 1 再置不增）                                                         |
| TC-BLOOM-LOGIC-11 | 空表查询        | 初始 `query(7)`               | `mightExist===false`（全 0）                                                                |
| TC-BLOOM-LOGIC-12 | 重置复原        | 加 3/7/11 后 `reset()`        | bits 全 false；其后 `query(7).mightExist===false`                                           |

## L4 —— `BloomViz` 互动（`src/components/structures/BloomViz.spec.ts`）

挂载组件断言。helper：`add`（填 a 点加入）、`query`（填 a 点查询）。

| 用例 ID            | 场景            | 操作                  | 期望                                             |
| ------------------ | --------------- | --------------------- | ------------------------------------------------ |
| TC-VIZ-BLOOMVIZ-01 | 初始结构渲染    | mount                 | 16 个 `.bit-cell`、a 输入、加入/查询/重置 按钮   |
| TC-VIZ-BLOOMVIZ-02 | 初始全 0        | mount                 | `.bit-cell.set` 数量 0                           |
| TC-VIZ-BLOOMVIZ-03 | 加入置 3 位     | add 3                 | `.bit-cell.set` 数量 3；status 含「加入」        |
| TC-VIZ-BLOOMVIZ-04 | 多次加入并集    | add 3、add 7、add 11  | `.bit-cell.set` 数量 9                           |
| TC-VIZ-BLOOMVIZ-05 | 查询·真命中     | add 3/7/11 后 query 7 | status 含「可能存在」且不含「误判」              |
| TC-VIZ-BLOOMVIZ-06 | 查询·一定不存在 | add 3/7/11 后 query 5 | status 含「一定不存在」                          |
| TC-VIZ-BLOOMVIZ-07 | 查询·误判       | add 3/7/11 后 query 2 | status 含「误判」                                |
| TC-VIZ-BLOOMVIZ-08 | 探测位点亮      | add 3/7/11 后 query 7 | `.bit-cell.probe` 数量 3                         |
| TC-VIZ-BLOOMVIZ-09 | 重置清空        | add 3 后 重置         | `.bit-cell.set` 数量 0；`.bit-cell.probe` 数量 0 |

## L4 —— `BloomFilter` 视图（`src/views/Article/DataStructure/BloomFilter.spec.ts`）

| 用例 ID          | 场景         | 期望                                                    |
| ---------------- | ------------ | ------------------------------------------------------- |
| TC-VIEW-BLOOM-01 | 页面骨架渲染 | 含 `Article`；含「布隆过滤器」标题文案；含 `Playground` |
| TC-VIEW-BLOOM-02 | 内嵌互动组件 | 渲染 `BloomViz`（存在 `.bloom-viz`、16 个 `.bit-cell`） |

## L5 —— 布隆页 e2e（`e2e/bloom-filter.e2e.ts`）

限定容器 `.bloom-viz`，避免与正文文字串扰。

| 用例 ID         | 场景            | 操作                                                         | 期望                                                                                |
| --------------- | --------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| TC-E2E-BLOOM-01 | 页面可达 + 互动 | 访问 `/docs/bloom-filter`；加入 3/7/11；查询 7；查询 2；重置 | 16 个 `.bit-cell`；查询 7 status 含「可能存在」；查询 2 含「误判」；重置后 set 清空 |

## 回归（改计数）

| 用例 ID      | 文件                                | 改动                                               |
| ------------ | ----------------------------------- | -------------------------------------------------- |
| TC-HOOK-01-2 | `src/views/Home/Main/hooks.spec.ts` | 数据结构分类条目数 14→**15**（新增「布隆过滤器」） |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 数据结构分类条目数 14→**15**（新增「布隆过滤器」） |

## 其它回归

- 既有 14 结构页 + 8 排序 + 播放器 + 骨架：现有 Case **零改动**全绿（除上面两条计数）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位（参考既有 ~90%）。

## 自测报告（2026-06-29）

- 执行命令：`pnpm format` → `pnpm format:check` / `pnpm lint:check` / `pnpm type-check` / `pnpm test:unit run --coverage` / `pnpm exec playwright test`
- 新增用例：L3 12（TC-BLOOM-LOGIC-01..12）+ L4 互动 9（TC-VIZ-BLOOMVIZ-01..09）+ L4 视图 2（TC-VIEW-BLOOM-01/02）+ L5 1（TC-E2E-BLOOM-01）= **24 新**；改 2 计数（TC-HOOK-01-2 / TC-HOOK-02-4）。
- 结果：**全绿**。单测 `770 passed`（112 文件）；e2e `30 passed`（含 TC-E2E-BLOOM-01）。
- 覆盖率（聚合）：Statements 92.91% / Branches 90.46% / Functions 93.91% / Lines 93.87%——均高于门槛（≥70% / ≥60%）。BloomViz.vue 90.24%/90/100/90；useBloom 纯逻辑由 12 条 L3 全量覆盖；BloomFilter.vue 静态模板挂载渲染。
- 真机自检（Playwright 截图，localhost:5173 `/docs/bloom-filter`）：初始 16 位全 0 + 位号 0..15 + 「m=16·k=3」提示；加入 3/7/11 后位 {1,2,3,5,6,7,11,13,14} 共 9 格绿（=1）；查询 2 → 探测位 2/14/11 橙描边且都是 1 → 状态红字「都是 1 → 可能存在；但其实从没加入过，这就是误判（假阳性）！」——误判演示到位。
- 结论：达成验收口径，**verified**；**M4 广度 B1–B7 全收官**。
