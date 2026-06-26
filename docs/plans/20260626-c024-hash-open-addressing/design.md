# 设计：哈希·开放寻址（线性探测插入/查找 + 装载因子，哈希页加节）

> Status: verified
> Stable ID: C-20260626-024
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
src/views/Article/DataStructure/Hash.vue   （现有页，拉链正文后加一节）
   │  … <Playground><HashViz/></Playground> …            ← C-021 既有拉链法，不动
   │  <h2>另一种解冲突：开放寻址</h2> 正文
   │  <Playground><HashProbeViz/></Playground>           ← 新增
   ▼
└─ 互动组件（src/components/structures/，新增）
     HashProbeViz.vue  ── 用 ── useProbe.ts（7 格扁平表 + 线性探测，可单测）
```

`HashViz`（C-021，拉链法 7 桶挂链）与 `HashProbeViz`（本次，开放寻址扁平表）并列在哈希页，互不依赖。骨架、HashViz、useHash 零改动。两者共用 `hash=key%7` 与同一组初始键 `[15,8,23,4]`，对照「链 vs 簇」。

## 2. 开放寻址逻辑 `useProbe.ts`（7 格扁平表 + 线性探测，可单测）

```ts
export const PROBE_SLOTS = 7; // 扁平表格数 = 散列 key % 7

export interface ProbeInsert {
  ok: boolean;
  reason?: 'dup' | 'full';
  home: number; // hash(key)
  slot: number; // 落座槽（ok 时），否则 -1
  path: number[]; // 探测路径（依次试过的槽下标，末位=落座槽）
  collision: boolean; // 是否发生过探测（home 已被占）
}
export interface ProbeSearch {
  found: boolean;
  home: number;
  slot: number; // 命中槽，否则 -1
  path: number[]; // 探测路径（依次看过的槽，末位=命中槽或终止空槽）
  steps: number; // 看过的格数 = path.length
}
export interface UseProbe {
  slots: Ref<(number | null)[]>; // 7 格扁平表；index = 槽号
  size: ComputedRef<number>;
  load: ComputedRef<number>; // 装载因子 size / 7
  isFull: ComputedRef<boolean>;
  hash: (key: number) => number;
  has: (key: number) => boolean;
  insert: (key: number) => ProbeInsert;
  search: (key: number) => ProbeSearch;
  reset: () => void;
}
```

- `hash(key) = key % 7`。
- `reset`：`slots = [null×7]`，依次 `insert` 初始 `[15,8,23,4]` → `[null,15,8,23,4,null,null]`（格 1-2-3 成一簇）。
- `search(key)`：从 `home=hash(key)` 起环绕线性探测，最多看 7 格——遇空槽 → `found:false`（path 末位=该空槽）；遇等值 → `found:true, slot=i`；`steps = path.length`（看过的格数，含终止空槽/命中槽）。
  - `search(15)` → path `[1]`、steps 1、命中；`search(8)` → path `[1,2]`、steps 2、命中（8 不在家、被探测找到）；`search(99)`（99%7=1）→ path `[1,2,3,4,5]`、steps 5、空槽止、未命中。
- `has(key) = search(key).found`（探测语义下「在不在」与查找一致）。
- `insert(key)`：先 `has` 查重（dup）→ 再 `isFull` 查满（full）→ 否则从 `home` 环绕探到首个空槽落座；`path` = 依次试过的槽（被占的 + 落座的），`slot` = path 末位，`collision = path.length > 1`。
  - 初始空表插 `[15,8,23,4]`：`15`→`[1]`；`8`→`[1,2]`（撞 15→落 2）；`23`→`[2,3]`（撞 8→落 3）；`4`→`[4]`。
  - 满表（size 7）插任意键 → `{ok:false, reason:'full'}`（`isFull` 守卫，避免环绕死循环）。
- **关键不变量**：同 4 键、同 `hash=key%7`，拉链法挂成「桶1 链 [15,8]」，开放寻址探成「格 1-2-3 一簇」——8、23 都不在自己「家」里，这是聚集的可测证据。

> 注：`slots` 用 `ref`，`insert`/`search`/`reset` 同步改它并同步返回结果；探测走位动画由 HashProbeViz 用 setTimeout 驱动（同步数据 + 延时高亮，L4 可断言）。

## 3. 开放寻址互动组件 `HashProbeViz.vue`

### 3.1 结构与布局

```
.probe-viz (column, center)
 ├─ .toolbar   输入框 + 插入 / 查找 / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽高
 │        .slot × 7（横排）
 │           .cell  ← 空(凹陷)/filled(浅绿凸起)/home(虚框)/probe(黄)/land(绿)/hit(深绿)/enter(渐入)
 │           .idx   ← 下标 0–6
 ├─ .readout  装载因子：已用 N/7 · ≈P%（进度条；近满橙）
 └─ .status   状态解说行
```

### 3.2 交互与动画

- **插入**：`r = h.insert(v)`（**同步**改 slots）→ 同步置 status（含 `home`、探测次数、落座槽、装载因子，可测）→ 走位点亮：依次把 `r.path` 前段（被占槽）标 `.probe` 黄、末位标 `.land` 绿；落座槽用 `.enter` 渐入（探测走到才显值）。dup/full 不走位、仅 status。
- **查找**：`r = h.search(v)`（同步）→ 同步置 status（found/步数）→ 依次把 `r.path` 标 `.probe`，命中槽收尾标 `.hit` 深绿。
- 分步 `setTimeout`（卸载清理、`busy` 防重入）；`reset` 可随时中断动画（clearTimers + busy=false）。结果同步、L4 可断言。

### 3.3 视觉映射

| 元素       | 态       | 颜色 / 处理                      |
| ---------- | -------- | -------------------------------- |
| 格         | 空 empty | 凹陷（inset 阴影）、无字         |
| 格         | filled   | 浅绿 `#8bd3a0` 凸起 + 深绿字     |
| 格         | home     | 高亮绿 `#42b883` 虚框            |
| 探测中     | probe    | 黄 `#ffcf5c` + 上浮              |
| 落座       | land     | 深绿 `#4caf50` + 白字 + 上浮     |
| 命中       | hit      | 更深绿 `#2e7d32` + 白字          |
| 新入渐显   | enter    | opacity 0 → 1                    |
| 装载因子条 | bar      | 高亮绿；近满（=1）转橙 `#ff8a65` |

### 3.4 装载因子读数（开放寻址的命脉）

`已用 {{ h.size }}/7 · ≈{{ pct }}%` + 进度条 `width: pct%`；`h.isFull` 时数字与条转橙，插入被拒、status 提示「该扩容 rehash」。

## 4. 哈希页加节 `Hash.vue` 正文大纲（拉链正文后插入）

```
…（现有 HashViz 段 + 拉链正文，不动）…
<h2>另一种解冲突：开放寻址</h2>
<p>拉链法把冲突挂到桶外的链上；开放寻址不挂链，所有键住同一张扁平表，冲突就在表内往后探一格（线性探测）。</p>
<p>还是 hash=key%7、还是 [15,8,23,4]，散进 7 格扁平表：15→1、8 撞 1 探到 2、23 撞 2 探到 3、4→4，冲突挤成一簇（聚集）。试试插入/查找。</p>
<Playground><HashProbeViz/></Playground>
<p>查找顺同样的路探，探到空位=不在表中。装载因子（已用/总格）是命脉：越接近 1 聚集越重；满了必须扩容 rehash（实战常超 ~0.7 就扩）。</p>
<p>两法取舍：拉链简单、能超表长；开放寻址数据集中、缓存友好。Java HashMap 用拉链，Python dict / Go map 用开放寻址。</p>
…（现有「哈希表在哪里用」段 + 引出图，不动）…
```

## 5. 组件清单与改动面

| 文件                                         | 类型       | 改动                                                         |
| -------------------------------------------- | ---------- | ------------------------------------------------------------ |
| `src/components/structures/useProbe.ts`      | **新增**   | 7 格扁平表 + 线性探测 insert/search + 装载因子               |
| `src/components/structures/HashProbeViz.vue` | **新增**   | 扁平表 + 线性探测走位 + 装载因子读数互动                     |
| `src/views/Article/DataStructure/Hash.vue`   | 改（加节） | 拉链正文后插入「开放寻址」节 + `<Playground><HashProbeViz/>` |
| `e2e/hash.e2e.ts`                            | 改（消歧） | TC-E2E-HASH-01 第 7 行 `.playground` → `.first()`（两件）    |

**零改动**：`article/` 骨架 / `HashViz`/`useHash` / 其余 `structures/*` / 路由 / 菜单 / 首页 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useProbe`/`HashProbeViz` 是全新文件，除哈希页外无人 import → 对 HashViz 与其余零影响。
- `Hash.vue` 仅**追加**一节（h2 + 正文 + 第二个 Playground）：现有 `TC-VIEW-HASH-01`（Article+HashViz 存在）、`TC-VIEW-HASH-02`（「哈希表」标题 + `.playground` 存在，`find` 取首个）**不受影响**——新节用 `.probe-viz` 作用域隔离。
- 新增 `TC-VIEW-HASH-03`（哈希页含 HashProbeViz）、`TC-E2E-HASH-02`（开放寻址节 e2e，限定 `.probe-viz`）。
- 唯一回归点：`TC-E2E-HASH-01` 第 7 行 `page.locator('.playground').toBeVisible()` 在两个 Playground 下命中 2 个（Playwright 严格模式）→ 改 `.first()`，断言意图不变（与 C-023 树页加第二件同款机械消歧）。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useProbe`（`TC-PROBE-LOGIC-*`）：初始 slots `[_,15,8,23,4,_,_]`/size 4/load 4÷7；insert 非冲突（5→格5）/冲突（9→探 2,3,4 落 5）/dup/full；search 命中（15→1 步、8→2 步）/未命中（99→空止）；has；reset；满表守卫不死循环。
- **L4 互动** `TC-VIZ-PROBEVIZ-*`：初始 7 格 + 4 filled + 3 按钮 + readout 含「4/7」；插入非冲突 status 含「落座」且 filled→5；插入冲突 status 含「探测」；查找命中 status 含「命中」；查找未命中 status 含「不在表中」；填满后插入 status 含「扩容」；重置回 4 filled。
- **L4 视图** `TC-VIEW-HASH-03`：哈希页含 `HashProbeViz`（findComponent）。
- **L5 e2e** `TC-E2E-HASH-02`：`/docs/hash` 限定 `.probe-viz`：初始 7 格 4 filled、插入 9 status 含「探测」、查找 99 status 含「不在表中」、重置回 4 filled。
