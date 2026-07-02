# 实现记录：自顶向下归并 Top-Down Merge Sort（C-20260702-043）

> Status: verified
> Stable ID: C-20260702-043
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0**：types.ts 加 `TopDownMergeExecPoint`；AlgorithmPlayer.spec 加 TC-PLAYER-STACK-04（双轨并存，内联最小 module 同时带 aux+stack）——播放器结构已支持，预期直接绿（验证性 Case）；图标 top-down-merge.svg。
2. **T1 module + oracle + sources**（L3）：先 `top-down-merge.module.spec.ts`（TC-TDMERGE-MOD-01..14）跑红 → 实现三文件跑绿（真递归 + callStack 快照 + 镜像 C-011 merge 粒度）。
3. **T2 TopDownMergeSort.vue**（L4 全模板）：先 spec 跑红 → 实现跑绿。
4. **T3 接线**：路由 + 菜单/首页「归并排序」后插入 + import 图标 + 改 TC-HOOK-02-4（12→13）。
5. **T4 e2e**（L5）。
6. 全门禁 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **真递归生成步骤**：`sortRange(lo,hi)`（闭区间）真递归（n=8 深度 3，无栈深风险），`callStack` 数组手动镜像调用链——push 后发 `split`、merge 完 `writeBack` 后 pop（无单独 pop 步，栈快照在后续步自然收缩）。stackSnap 深拷贝 frames，栈顶=当前活动区间（StackView 既有 `.top` 高亮直接复用，语义从「待处理区间」自然延伸为「递归调用链」）。
- **首个 aux+stack 双辅助轨并存模块**：AlgorithmPlayer 各轨独立 `v-if` 天然支持，零改动；补验证性 Case TC-PLAYER-STACK-04（内联最小 module 同时带 aux+stack → 两轨都渲染，直接绿）。
- **merge 粒度完全镜像 C-011**（mergeStart → compare → takeLeft/takeRight → drainLeft/drainRight → writeBack；i 红 id'0'/j 蓝 id'1'；auxSnap(filled, activeRange 半开 [lo,hi+1), k)；writeCount 累计；拷回带原 id → FLIP）。差异仅：闭区间语义（vars 的 mid 是左段末）、width 换成 深度（callStack.length）、widthChange 换成 split。
- **执行点复用命名**：merge 七件套与 MergeExecPoint 同名（split 替代 widthChange）——两页 lineMap 语义对齐，正文互链对照时读者无认知切换成本。
- **e2e 计数**：AuxView 也用 `.bar-cell`（C-011 e2e 先例：主 10+aux 10=20）→ 本页断言 16（主 8 + temp 8）；主轨值单独取 `.bars-view .bar-cell .val`。
- **S5 事实修正**：backlog 创建时把归并已有/缺失写反（C-011 实为自底向上迭代版），S5 更名「自顶向下归并」，backlog 表格 + 细节段 + 变更历史三处留痕；Case 命名空间 TC-TDMERGE-_（原拟 TC-BUMERGE-_ 弃用）。
- 图标 top-down-merge.svg：上宽条 → 两短条 → 下宽条（分→合剪影）。

## 自测报告

- 见 [test-cases.md](./test-cases.md)：全门禁绿（单测 899、e2e 38、format/lint/type-check exit 0）；覆盖率 93.51%/90.8%/94.13%/94.38%；真机递归栈三层 + 末步升序自检通过。零回归。

## 变更历史

- 2026-07-02：创建（draft）。S5 由「自底向上」事实修正更名「自顶向下归并」（C-011 实为迭代版）。
