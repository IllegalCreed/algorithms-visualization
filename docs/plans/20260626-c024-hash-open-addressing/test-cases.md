# 测试用例：哈希·开放寻址（线性探测 + 装载因子）

> Status: verified
> Stable ID: C-20260626-024
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级                | 文件                                             | 编号区间                 | 数量 |
| ------------------- | ------------------------------------------------ | ------------------------ | ---- |
| L3 开放寻址逻辑     | `src/components/structures/useProbe.spec.ts`     | `TC-PROBE-LOGIC-01..10`  | 10   |
| L4 HashProbeViz互动 | `src/components/structures/HashProbeViz.spec.ts` | `TC-VIZ-PROBEVIZ-01..08` | 8    |
| L4 哈希页（追加）   | `src/views/Article/DataStructure/Hash.spec.ts`   | `TC-VIEW-HASH-03`        | 1    |
| L5 e2e（追加）      | `e2e/hash.e2e.ts`                                | `TC-E2E-HASH-02`         | 1    |

**合计新增 20 个 Case。** 无现存 `PROBE` Case，命名空间干净；视图/ e2e 追加沿用哈希页 `HASH` 命名（同页）。

**回归（不新增、必须仍绿）**：哈希页现有 `TC-VIEW-HASH-01/02`、`TC-E2E-HASH-01`（HashViz 拉链）+ 8 排序 + 其余 7 结构（含骨架与各 `use*`/`*Viz`）+ 播放器 全部现有 Case —— 由全门禁证明 HashViz/骨架零改动、零回归。`TC-E2E-HASH-01` 仅第 7 行 `.playground` 需 `.first()` 消歧（两 Playground），断言意图不变。

## L3 — useProbe（`TC-PROBE-LOGIC-*`）

| TC                | 描述                                                     | 预期                                 |
| ----------------- | -------------------------------------------------------- | ------------------------------------ |
| TC-PROBE-LOGIC-01 | 初始扁平表：`[null,15,8,23,4,null,null]`、size 4         | slots/size 一致                      |
| TC-PROBE-LOGIC-02 | 装载因子 load = 4/7、isFull=false                        | ≈0.5714、false                       |
| TC-PROBE-LOGIC-03 | hash(key)=key%7                                          | 15→1、8→1、23→2、4→4                 |
| TC-PROBE-LOGIC-04 | insert 非冲突：5→格5（5%7=5 空）                         | ok、slot 5、path[5]、!collision      |
| TC-PROBE-LOGIC-05 | insert 冲突：9→探 2,3,4 落 5                             | ok、slot 5、path[2,3,4,5]、collision |
| TC-PROBE-LOGIC-06 | insert 查重：15 已在 → dup                               | !ok、reason dup                      |
| TC-PROBE-LOGIC-07 | search 命中：15→1 步、8→2 步（8 不在家被探到）           | found、slot/steps 一致               |
| TC-PROBE-LOGIC-08 | search 未命中：99（%7=1）探到空槽止、未命中              | !found、path 末位空槽、steps 5       |
| TC-PROBE-LOGIC-09 | 填满（再插 3 键）后 isFull、load=1，insert→full 不死循环 | full、reason full                    |
| TC-PROBE-LOGIC-10 | reset 回初始；has(8)=true、has(99)=false                 | slots 复原、has 一致                 |

## L4 — HashProbeViz 互动（`TC-VIZ-PROBEVIZ-*`）

| TC                 | 描述                                                              | 预期                 |
| ------------------ | ----------------------------------------------------------------- | -------------------- |
| TC-VIZ-PROBEVIZ-01 | 初始：7 格 + 4 filled + 插入/查找/重置 3 按钮 + readout 含「4/7」 | 各断言通过           |
| TC-VIZ-PROBEVIZ-02 | 初始 filled 格值含 15/8/23/4                                      | 文本包含             |
| TC-VIZ-PROBEVIZ-03 | 插入 5（非冲突）：filled→5、status 含「落座」                     | 5 filled、status 含  |
| TC-VIZ-PROBEVIZ-04 | 插入 9（冲突）：filled→5、status 含「探测」                       | 5 filled、status 含  |
| TC-VIZ-PROBEVIZ-05 | 查找 8（命中）：status 含「命中」                                 | status 含「命中」    |
| TC-VIZ-PROBEVIZ-06 | 查找 99（未命中）：status 含「不在表中」                          | status 含            |
| TC-VIZ-PROBEVIZ-07 | 填满后插入：status 含「扩容」、readout 含「7/7」                  | status/readout 含    |
| TC-VIZ-PROBEVIZ-08 | 重置：filled 回 4、readout 回「4/7」                              | 4 filled、readout 含 |

## L4 — 哈希页（追加 `TC-VIEW-HASH-03`）

| TC              | 描述                                | 预期     |
| --------------- | ----------------------------------- | -------- |
| TC-VIEW-HASH-03 | 哈希页含 HashProbeViz（开放寻址节） | 组件存在 |

## L5 — e2e（追加 `TC-E2E-HASH-02`）

| TC             | 描述                                                                                                                   | 预期       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-HASH-02 | `/docs/hash` 限定 `.probe-viz`：初始 7 格 4 filled / 插入 9 status 含「探测」/ 查找 99 含「不在表中」/ 重置回 4 filled | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useProbe` 纯逻辑（insert 非冲突/冲突/dup/full、search 命中/未命中、has、reset、满表守卫）L3 全覆盖；HashProbeViz 同步分支（onInsert ok/dup/full、onSearch found/not、readout/pct）L4 覆盖（探测走位 setTimeout 分步分支由 e2e/肉眼复核）。

## 变更历史

- 2026-06-26：创建并落地。M4 深度 D2。实际新增 20 个 Case（useProbe 10 + HashProbeViz 8 + view 1 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.25%/89.38%/93.16%/93.33%（聚合均过门槛）；useProbe 纯逻辑 L3 全覆盖、HashProbeViz 86.81% 行（走位 setTimeout 分支由 e2e 复核）。单测 564 passed（85 文件）+ e2e 20 passed。注：哈希页加第二个 Playground 后，现有 `TC-E2E-HASH-01` 第 7 行 `.playground` 选择器命中 2 个（严格模式），改为 `.first()` 消歧（断言意图不变、非语义改写）；其余 HashViz/骨架零改动、零回归。命名空间 `PROBE`/`PROBEVIZ` 干净，避让拉链 `HASH`/`HASHVIZ`。
