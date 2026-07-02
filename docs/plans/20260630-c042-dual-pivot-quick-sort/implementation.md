# 实现记录：双轴快排 Dual-Pivot Quicksort（C-20260630-042）

> Status: verified
> Stable ID: C-20260630-042
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 框架扩展**：types.ts 加 `DualPivotExecPoint` + `StepEmphasis.pivotIndices?`；先 BarsView.spec 加 TC-VIZ-BARSVIEW-23 跑红 → BarsView.stateOf 一行扩展跑绿。
2. **图标**：`src/assets/dual-pivot-quick.svg`（双高柱夹短柱）。
3. **T1 module + oracle + sources**（L3）：先 `dual-pivot-quick.module.spec.ts`（TC-DUALPIVOT-MOD-01..14）跑红 → 实现三文件跑绿。
4. **T2 DualPivotQuickSort.vue**（L4 全模板）：先 spec（TC-VIEW-DUALPIVOT-01/02）跑红 → Article 正文 + AlgorithmPlayer 跑绿。
5. **T3 接线**：路由 + 菜单/首页「三路快排」后插「双轴快排」+ import 图标 + 改 TC-HOOK-02-4（11→12）。
6. **T4 e2e**（L5）：`e2e/dual-pivot-quick-sort.e2e.ts`（TC-E2E-DUALPIVOT-01）。
7. 全门禁 → 回写四文档/三索引/roadmap/sorting-backlog(S4 出池) → 两提交 → 双轨部署。

## 关键实现笔记

- **pivotIndices additive 扩展**：`StepEmphasis.pivotIndices?: number[]`，BarsView.stateOf 首行由 `e.pivotIndex === index` 扩为 `e.pivotIndex === index || e.pivotIndices?.includes(index)`——一行改动，既有算法不设 → 短路走原逻辑，BarsView 既有 22 Case 零回归。双基准是「双轴」的视觉锚点，pivotSelect + 扫描步（compare/less/between/greater）设 `[lo,hi]` 双紫；pivotPlace 归位后清除（转 sortedIndices 绿）。
- **模块结构同构三路快排**（C-041）：显式区间栈 + stackSnap + emit(compare 决策 + 分支动作) + placed 累积。差异三点：① 双基准 `p=a[lo], q=a[hi]`，`a[lo]>a[hi]` 先换端（swapped 标志进 caption，MOD-10 断言存在「交换」步）；② 扫描界 `lt=i=lo+1, gt=hi-1`（两端基准不参与扫描）；③ **pivotPlace 独立执行点**：`lt--, gt++` 后 swap(lo,lt)+swap(hi,gt) 双基准归位钉死——比三路多出的第 9 个执行点。
- **压栈三段**：右 [gt+1,hi] → 中 [lt+1,gt-1] → 左 [lo,lt-1]（pop 先取左）；单元素段直接 placed；空段忽略。固定输入 27 步：趟1 [0,7]（p=3/q=7 不换端，6 比较）16 步 + 趟2 [0,1]（换端，零扫描）4 步 + 趟3 [3,5]（换端，1 比较）6 步 + done。
- **rust usize 防下溢**：中/左段压栈条件写 `gt > lt + 2`、`lt > lo + 1`（避免 usize 减法）；gt-=1 仅在 i≤gt 循环内（gt≥1）安全。
- **【Owner 反馈缺陷修复】CodePanel 长行截断无法横滚**：真机自检时 Owner 指出「代码显示不全，宽度不够，还不能横向移动」。根因 `.code-panel{overflow:hidden}`（裁圆角用）+ `.code` 无滚动 + `.code-line{white-space:pre}` → 超宽行被裁。铁律流程：先写 `e2e/code-panel-hscroll.e2e.ts`（TC-E2E-CODEPANEL-01：computed overflow-x / 压窄 320px 断言 scrollWidth>clientWidth / scrollLeft 可置）→ **stash 还原旧 CSS 复现 RED、pop 恢复 GREEN 双向验证** → 修复 `.code{overflow-x:auto}` + `.code-line{width:max-content;min-width:100%}`（高亮行背景随滚动铺满、短行不缺口；全局 border-box 下 min-width:100%+padding 不溢出）。踩坑：e2e 初版用 900px 视口制造溢出不稳定（544px 面板恰好装下最长行）→ 改为脚本压窄面板，行为断言与视口解耦。
- **图标**：dual-pivot-quick.svg 双高柱夹短柱（两根「轴」），区别三路快排的三段升序柱。

## 自测报告

- 见 [test-cases.md](./test-cases.md) 自测报告：全门禁绿（单测 882 / 127 文件、e2e 37、format/lint/type-check exit 0）；覆盖率 93.41%/90.64%/94.12%/94.32%；真机初始→双紫基准→末步升序 + 横滚缺陷复验通过。零回归。

## 变更历史

- 2026-06-30：创建（draft）。
- 2026-07-02：会话接管后按本会话设计重建四文档（见 requirements 变更历史）。
