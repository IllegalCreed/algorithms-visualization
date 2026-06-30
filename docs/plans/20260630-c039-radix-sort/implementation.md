# 实现记录：基数排序 Radix Sort（C-20260630-039）

> Status: verified
> Stable ID: C-20260630-039
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **radix-sort.module.ts + radix-sort.ts + radix-sort.sources.ts**（L3）：先 `radix-sort.module.spec.ts`（TC-RADIX-MOD-01..12）跑红 → 实现 oracle + sources + buildRadixSortSteps 跑绿。`RadixExecPoint` 加到 `player/types.ts`（additive）。
2. **RadixSort.vue**（L4）：先 `RadixSort.spec.ts`（TC-VIEW-RADIX-01/02）跑红 → 极简一行接 AlgorithmPlayer 跑绿。
3. **接线**：路由 + 排序菜单/首页 children 追加基数排序 + RadixIcon import + 改 TC-HOOK-02-4（排序 8→9）。
4. **e2e**（L5）：`e2e/radix-sort.e2e.ts`（TC-E2E-RADIX-01）。
5. 全门禁 → 回写四文档/三索引/roadmap(M7 doing)/sorting-backlog(S1 出池) → 两提交 → 双轨部署。

## 关键实现笔记

- **范式探查先行**：排序与数据结构/图算法不同——复用「算法播放器」框架（C-006）。先派 Explore + 精读 counting-sort.module/types.ts 摸清：`Step<P>{array:[key,val][], pointers, emphasis, vars, point, caption, count?}` + `AlgorithmModule<P>{title,initialInput,buildSteps,sources}` + `LangSource<P>{lang,label,code,lineMap}`，视图就一行 `<AlgorithmPlayer :module="..."/>`。
- **零框架改动复用 CountView**：基数排序每轮 10 桶（数字 0–9）→ 直接用 `count?: CountTrack` 字段（`{min:0, buckets:[10 计数], activeBucket}`），AlgorithmPlayer `v-if="current.count"` 即渲染 CountView，桶底标签 `min+i`=0–9 恰为数字位。**没碰 types.ts 的 Step/CountTrack、没碰 AlgorithmPlayer/CountView**（types.ts 仅 additive 加 `RadixExecPoint`）→ 8 排序零回归。
- **buildRadixSortSteps**：work `[String(i),v]` 位置键（同计数排序，柱在原位、值被覆盖，不做 FLIP）；`passes=String(max).length`（max 63→2 轮）。每轮 d（div=10^d）：passStart（桶清零）→ distribute（读 work[i]、digit=⌊v/div⌋%10、buckets[digit].push(v)、count 桶填充、读游标 id'1'）→ collect（按桶 0→9 桶内序回写 work[w][1]=v、remaining 递减、写游标 id'3'）。末 done（sortedUpTo=n）。35 步。
- **主轨 BarsView 显示数字逐轮重排**（collect 覆盖值）、**桶轨 CountView 显示当前位 0–9 分布**——两轨配合讲清「按位分配收集」。
- **sources**：ts/python/go/rust 4 语言，lineMap 覆盖 passStart/distribute/collect/done；轮数 ts/py 用 `len(str(max))`、go/rust 用 `for div<=max; div*=10`（均 2 轮）。
- **接线**：路由 + 排序菜单/首页 children 追加基数排序（计数排序后）+ **RadixIcon import（radix.svg 已存在，原首页注释块引用过但没 import）**；改 **TC-HOOK-02-4**（排序 8→9）。Home spec 不查排序数，无需改。
- **坑**：① RadixIcon 被新条目用了但没 import（旧注释块 line 192 引用过）→ 补 `import RadixIcon from '@/assets/radix.svg'`，否则 type-check 失败。② radix.svg 已预置存在，无需新建。③ 视图 L4 spec 须 mock `useHighlighter` + `createPinia()`（同 CountingSort.spec）。

## 自测报告

见 [test-cases.md](./test-cases.md#自测报告2026-06-30)。全门禁绿（format/lint/type-check/单测 829 + 覆盖率 93.26%/e2e 33），真机截图自检通过（初始乱序 8 柱 → 拖末步全部转绿有序 [7,9,18,25,31,42,56,63]）。

## 变更历史

- 2026-06-30：创建（draft）→ Explore + 精读摸清排序播放器范式 → TDD（L3 radix-sort.module 13 → L4 RadixSort 视图 2 + 接线 + 改 TC-HOOK-02-4 → L5 e2e 1）→ 全门禁绿 → 真机自检 → verified。排序大类 8→9，复用算法播放器 + CountView 桶轨、零框架改动。
