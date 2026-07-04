# 需求：2-SAT（C-20260704-074，图算法第 8 页 · 有向图连通性 · Tarjan 应用）

> Status: verified
> Stable ID: C-20260704-074
> Owner: IllegalCreed
> Created: 2026-07-04
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

C-069（强连通分量 Tarjan）在页尾把 SCC 立为「有向图连通性」的通用工具，并预告了它的经典应用。**2-SAT** 就是那个杀手级应用，回答「强连通分量到底有什么用」。

**2-SAT 问题**：给一堆布尔变量与形如 `(a ∨ b)` 的二元子句（每个子句至多两个文字），问是否存在一组真值赋值让所有子句为真。**蕴含图法** O(V+E)：

- 每个变量 `x` 拆成两个文字节点 `x`（真）与 `¬x`（假），共 `2n` 个点。
- 子句 `(a ∨ b)` 等价于两条蕴含：`¬a → b`（a 假则 b 必真）与 `¬b → a`。据此建**蕴含图**。
- 跑 **Tarjan 求强连通分量**：`x` 与 `¬x` 落在**同一个 SCC** ⟺ 「x 真」与「x 假」相互蕴含、矛盾 ⟺ **无解**。
- 否则**可满足**，按 SCC 的**逆拓扑序**赋值：`x = 真` 当且仅当 `comp[x] < comp[¬x]`（Tarjan 的 comp 编号本身即逆拓扑序，取「更靠拓扑序后面」的那个文字为真）。

## 目标

在图算法大类新增第 8 页「2-SAT」，接入算法播放器（`AlgorithmPlayer`），**复用 GraphView（承接 C-069 的 SCC 着色 + 栈环 + 有向边），不新建轨**：

1. **建蕴含图**：列出子句，把每条 `(a∨b)` 翻成两条蕴含边 `¬a→b`、`¬b→a`，逐条加入并高亮。
2. **Tarjan 求 SCC**（复用第 7 页）：逐个弹出 SCC 并着色（`nodeGroup`）。
3. **判定**：逐变量高亮 `x` 与 `¬x`（additive `checkPair`），确认二者**不同组** → 可满足（任一同组即无解）。
4. **赋值**：逐变量按 `comp[x] < comp[¬x]` 赋 真/假，节点 badge 显示结果。
5. 固定实例 3 变量 4 子句 `(A∨B)∧(A∨¬B)∧(A∨C)∧(¬A∨¬B)` → 4 个 SCC `{¬B,A}/{C}/{B,¬A}/{¬C}`、可满足、解 **A=真 / B=假 / C=真**。

## 验收标准

- `/docs/two-sat` 新页：介绍正文（讲清子句→蕴含、SCC 判定、逆拓扑序赋值）+ 播放器同屏，右侧四语言代码随步高亮。
- 动画：蕴含图逐子句成形 → Tarjan 逐个 SCC 着色 → 判定逐对高亮确认不同组 → 逐变量赋值 badge；走到 `done` 输出可满足解 A=真/B=假/C=真。
- 菜单 + 首页「图算法」新增第 8 项，新图标 `two-sat.svg`。
- 全门禁绿（format/lint/type-check/单测覆盖率/e2e）；真机自检确认蕴含图、SCC 着色、判定对高亮、赋值 badge、可满足解；既有算法零回归（尤其 C-069 SCC 及其它 6 图算法的 GraphView 消费者）。

## 非目标

- 不做无解（UNSAT）实例的完整演示——固定实例可满足，正文点明「若某对 x/¬x 同组即无解」，判定阶段可视化确认「无同组」即可。
- 不做一般 SAT / 3-SAT（NP 完全）——本页只讲二元子句的多项式 2-SAT。
- 不改 AlgorithmPlayer；GraphView 仅 additive 扩展 `checkPair`（其它图算法零回归）。
- 不重讲 Tarjan 的 dfn/low 细节（第 7 页已详解）——本页 Tarjan 阶段压缩为「逐个弹出 SCC 着色」，聚焦 2-SAT 的归约与判定。

## 变更历史

- 2026-07-04：创建（draft → approved）。图算法第 8 页，2-SAT 蕴含图 + Tarjan SCC 判定，复用 GraphView（additive checkPair），承接 C-069 强连通分量、回答「SCC 有什么用」。
- 2026-07-04：交付验收（approved → verified）。18 Case 全绿（GraphView checkPair 2 + module 12 + 视图 3 + e2e 1）+ 改 TC-HOOK 2；真机自检确认蕴含图 8 边逐子句成形、4 SCC 着色 {A,¬B}/{B,¬A} 合并对、checkPair 蓝环判定、解 A=真/B=假/C=真；C-069 及其它 6 图算法零回归；AlgorithmPlayer 零改动。
