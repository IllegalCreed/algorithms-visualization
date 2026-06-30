# 实现记录：桶排序 Bucket Sort（C-20260630-040）

> Status: verified
> Stable ID: C-20260630-040
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **BucketView 新轨**（L4）：types.ts 加 BucketExecPoint/BucketTrack/Step.bucket?；先 `BucketView.spec.ts`（TC-VIZ-BUCKETVIEW-01..04）跑红 → 实现 BucketView.vue 跑绿。
2. **AlgorithmPlayer 接桶轨**（L4）：先 AlgorithmPlayer.spec 加 TC-PLAYER-BUCKET-01/02 跑红 → 加 `<BucketView v-if="current.bucket">` 跑绿。
3. **bucket-sort.module + ts + sources**（L3）：先 `bucket-sort.module.spec.ts`（TC-BUCKET-MOD-01..13）跑红 → 实现跑绿。
4. **BucketSort.vue**（L4，全模板）：先 `BucketSort.spec.ts`（TC-VIEW-BUCKET-01/02）跑红 → Article 正文 + AlgorithmPlayer 跑绿。
5. **接线**：路由 + 排序菜单/首页 children 9→10 + BucketIcon import + 改 TC-HOOK-02-4。
6. **e2e**（L5）：`e2e/bucket-sort.e2e.ts`（TC-E2E-BUCKET-01）。
7. 全门禁 → 回写四文档/三索引/roadmap(M7 S2✓ + M8)/sorting-backlog(S2 出池) → 两提交 → 双轨部署。

## 关键实现笔记

- **BucketView（第 6 条 additive 轨）**：props `{ bucket: BucketTrack }`。横排 5 个 `.bucket-col`（活跃 `.active`），每桶内凹 `.bucket-pit` 自上而下排 `.bucket-cell`（显实际数值，蓝底），桶底 `.bucket-range` 值域标签（如 `0–9`）。空桶渲染 0 格。样式镜像 CountView 的新拟物（`.neumorphism-pressed`/`.neumorphism-flat` + active 高亮环），但桶里装**实际元素**而非计数萝卜——这正是不复用 CountView 的原因。
- **AlgorithmPlayer 接轨**：import BucketView + 紧跟 `<CountView>` 后加 `<BucketView v-if="current.bucket" :bucket="current.bucket" />`。与既有 4 个可选轨（aux/stack/tree/count）完全同模式——既有算法步骤无 bucket → 不渲染 → 零回归（TC-PLAYER-BUCKET-02 用 bubbleSortModule 验证）。
- **module 三阶段**：`work` 用位置键 `[String(i),v]`（柱原位、值覆盖、不 FLIP，同计数/基数）。`buckets:number[][]` 真实承载元素，`bsnap()` 深拷贝每步快照。distribute 8 步（读 work[i]、bucketOf=⌊v/10⌋ 封顶 4、push、蓝读游标 '1'、activeBucket）→ sortBucket 5 步（每桶 `.sort((x,y)=>x-y)`、空桶 caption「跳过」）→ concat 8 步（按桶 0→4 `shift()` 回写 work[w]、绿写游标 '3'、`emphasis.sortedUpTo=w+1`）→ done 1 步（sortedUpTo=n）。共 22 步。桶排序无 `Math.max` 依赖，n=0 天然安全（无需基数排序那样的空数组守卫）。
- **oracle**：`bucketSortTrace` 直接 `[...input].sort((a,b)=>a-b)`，只校验末步有序——步骤正确性由 module.spec 逐阶段断言（桶状态、活跃桶、游标、步数结构）。
- **全模板视图**：`BucketSort.vue` = `<Article>` 正文（h1 + sub + 3 段「什么是/怎么做/复杂度适用」+ Callout 对照计数/基数）+ `<AlgorithmPlayer :module="bucketSortModule"/>`（Vue 3 多根，正文 720 阅读宽、播放器全宽）。区别于既有 9 排序的「裸播放器一行」——这是 M8 全模板首例。
- **坑/注意**：① Home hooks 旧注释里有「桶排序」「基数排序」两段被注释的占位（引用 BucketIcon 但未 import），实现真实条目时一并删除两段注释 + 补 `import BucketIcon`，避免 C-039 那次的「残留注释 + 未 import」类型错误。② prettier 会重排 BucketSort.vue 正文 + index.md 表格列宽（门禁前 `pnpm format` 统一处理）。

## 自测报告

- 见 [test-cases.md](./test-cases.md) 自测报告：全门禁绿（单测 850 passed / 123 文件、e2e 34 passed、format/lint/type-check exit 0）；覆盖率 94.05%/91.49%/94.37%/94.93%；真机 /docs/bucket-sort 初始乱序→末步 [3,9,21,25,29,37,43,49] 升序自检通过。零回归。

## 变更历史

- 2026-06-30：创建（draft）。
