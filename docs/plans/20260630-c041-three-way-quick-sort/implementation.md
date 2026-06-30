# 实现记录：三路快排 3-way Quicksort（C-20260630-041）

> Status: verified
> Stable ID: C-20260630-041
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **类型**：types.ts 加 `ThreeWayExecPoint`（additive，不改任何轨）。
2. **新图标**：`src/assets/three-way-quick.svg`（三段柱剪影）。
3. **module + oracle + sources**（L3）：先 `three-way-quick.module.spec.ts`（TC-3WQUICK-MOD-01..13）跑红 → 实现 `three-way-quick.{ts,sources.ts,module.ts}` 跑绿。
4. **ThreeWayQuickSort.vue**（L4，全模板）：先 `ThreeWayQuickSort.spec.ts`（TC-VIEW-3WQUICK-01/02）跑红 → Article 正文 + AlgorithmPlayer 跑绿。
5. **接线**：路由 + 排序菜单/首页「快速排序」后插「三路快排」+ import 图标 + 改 TC-HOOK-02-4（10→11）。
6. **e2e**（L5）：`e2e/three-way-quick-sort.e2e.ts`（TC-E2E-3WQUICK-01）。
7. 全门禁 → 回写四文档/三索引/roadmap(M7 阶段二首项)/sorting-backlog(S3 出池) → 两提交 → 双轨部署。

## 关键实现笔记

- **零新轨、纯复用**：三路快排是快排（C-012）的变体，复用 `Step.stack`（StackTrack 区间栈）+ `Step.pointers`（三指针）+ `Step.emphasis`（groupMembers 当前区间 + sortedIndices 已钉死段）+ BarsView/StackView 两个既有轨。只往 types.ts 追加 `ThreeWayExecPoint`（additive 类型），不碰 AlgorithmPlayer/任何轨组件 → 既有 10 排序 + 播放器零回归。
- **荷兰国旗划分**：pivot=work[lo][1]；`lt=i=lo, gt=hi`；`while(i<=gt)`：`<`→swap(work[lt],work[i]),lt++,i++；`>`→swap(work[i],work[gt]),gt--（i 不动）；`==`→i++。循环结束 `[lt,gt]` 段全 ==pivot、入 placed 钉死。三指针配色 lt 绿(id'3')/i 蓝(id'1')/gt 红(id'0')，复用 store colors[3/1/0]。
- **显式区间栈**：`stack:{lo,hi}[]`，初始 `[{0,n-1}]`；先压右 `[gt+1,hi]`、后压左 `[lo,lt-1]`（同快排「先右后左 → pop 先取左」）；单元素子区间直接 placed.push（不入栈）。stackSnap 同快排：frames 深拷贝 + pop 步带 popped。
- **执行点粒度**：每个 i 发 `compare`（决策）+ 一个分支步 `less`/`greater`/`equal`（动作），同快排「compare + swap/noSwap」节奏。固定 [5,3,8,3,5,8,3,5] 共 36 步：首划分 [0,7] pivot=5 一趟成 [3,3,3|5,5,5|8,8]、中段钉死，再处理 [0,2]/[6,7]（全等子段）。
- **emphasis 设计**：pivot 是**值非下标**，不占 pivotIndex；三段靠 lt/i/gt 三指针 + groupMembers（当前区间高亮）+ sortedIndices（已钉死段绿）表达。TC-MOD-08 验证首 push 步 array=[3,3,3,5,5,5,8,8] 且 [3,4,5] 入 sortedIndices。
- **测试用不变量替代魔数**：递归步数依赖数据、难手算精确，故测 `#compare==#less+#greater+#equal`、`#pop==#pivotSelect==#push` 等结构不变量 + 首划分快照 + 三分支各≥1 + 末步有序=oracle，比硬编码步数更稳。
- **lineMap 逐语言核行号**：4 语言源码行数不同（ts 22/python 21/go 29/rust 26 行），greater/equal/push/done 各语言行号需逐一核对（prettier 不改字符串内容，但 done 必须落在真实「return/结尾」行内）。rust 无 return 语句，done 落 while 闭合 `}`；rust gt 用 usize 加 `if gt==0 {break}` 防下溢（本输入不触发，仅为展示正确性）。
- **全模板视图**：ThreeWayQuickSort.vue = Article 正文（普通快排软肋 / 荷兰国旗划分 / 复杂度 / Callout 对照）+ AlgorithmPlayer，player 置正文中段（「怎么做」后、「复杂度」前），同 C-040 桶排序。**坑**：初稿误写两个 AlgorithmPlayer（中段一个 + Article 后一个），删掉 Article 外的重复。新图标 three-way-quick.svg（三段升序柱剪影，区别快排闪电）。

## 自测报告

- 见 [test-cases.md](./test-cases.md) 自测报告：全门禁绿（单测 865 / 125 文件、e2e 35、format/lint/type-check exit 0）；覆盖率 93.39%/90.65%/94.12%/94.26%；真机 /docs/three-way-quick-sort 初始→中段三指针三段→末步 [3,3,3,5,5,5,8,8] 升序自检通过。零回归。

## 变更历史

- 2026-06-30：创建（draft）。
