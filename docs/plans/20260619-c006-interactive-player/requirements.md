# 需求：交互式算法播放器（重做冒泡排序体验）

> Status: verified
> Stable ID: C-20260619-006
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-19
> Last reviewed: 2026-06-19
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-003（提供 bubble-sort 步骤抽离与 L3/L4/L5 测试基线）
> Related tests: 改写 TC-VIEW-BUBBLE-01/02、TC-E2E-BUBBLE-01；新增 player / code-panel / variable-panel / bars 系列 Case

## 背景

当前唯一实现的冒泡排序（`src/views/Article/SortAlgorithm/BubbleSort.vue`）一进页面就自动播放、不可控；可视化是绿色圆圈 + 红蓝箭头 + `10>9=true` 表达式，观感差。用户提出明确的下一步：把冒泡排序做成一个**可交互的算法播放器**，并作为后续所有算法复用的框架——而不是急着扩展其他算法。

C-003 已把排序纯逻辑抽到 `src/algorithms/bubble-sort.ts`（`bubbleSortSteps` 返回步骤序列），本变更在此基础上构建播放器。

## 要做什么

1. **通用「算法播放器」框架**：外壳（播放控制 / 代码面板 / 变量面板 / 可视化插槽）与算法专属部分（步骤模型 + 多语言源码与行映射 + 渲染）解耦。新增算法只需实现一个 `AlgorithmModule`，外壳零改动。
2. **只读多语言代码视图 + 当前行高亮**：语法高亮 + 行号 + 跟随动画高亮"当前执行到哪行"。语言 Tab：**TypeScript / Python / Go / Rust**。多语言仅作展示，动画始终由内置 TS 步骤流驱动。
3. **传输控制**：播放 · 暂停 · 上一步 · 下一步 · 重置 · 速度（0.5× / 1× / 2×）· 进度条（step i/N）。**进入页面默认暂停在第 0 步**，由用户主动播放或单步。
4. **变量面板**：实时显示当前步的变量值（轮次 pass、i、j、a[j]、a[j+1]、比较结果、是否交换、交换计数、已排序边界），值变化时高亮。
5. **可视化重做**：柱状条（高度 = 数值）+ 顶部数值标签 + 下方指针箭头 + 比较 / 交换 / 已排序的视觉区分，新拟物（neumorphism）风；交换走平滑 FLIP 动画。
6. **冒泡排序接入框架**：作为首个、也是本变更唯一接入的算法，验证框架可复用性。
7. **测试与文档**：L3/L4/L5 覆盖；回写 `docs/plans/index.md`、`docs/test-cases/` 索引、`docs/roadmap.md` 里程碑。

## 不做什么（边界）

- **不做可编辑 / 可运行的代码编辑器**：代码视图只读；但"步骤生成"与"回放"在架构上解耦，为将来接入"可编辑运行"预留扩展点。
- **不补其他算法 / 数据结构**：归后续「算法补全」里程碑。
- **不引入重型编辑器**（Monaco / CodeMirror）：只读展示用 Shiki 足矣。
- **不改路由 / 部署结构**：仍是懒加载文章页 + 现有 base / Pages 方案。
- **不删除现有 `List.vue` / `Block.vue`**：保留为通用可视化原语（未来数据结构页可能复用），仅 BubbleSort 不再使用它们。

## 业务规则 / 约束

- 多语言仅展示；动画的唯一真相源是内置 TS 步骤流。
- 单步 / 暂停 / 后退 / 拖动进度，全部通过"**预计算步骤数组 + 当前下标**"实现，不依赖异步 `delay`，无竞态。
- 语法高亮用 **Shiki 主包 `createHighlighter`** + `createJavaScriptRegexEngine`（免 Oniguruma WASM）；只声明四门语言（`typescript/python/go/rust`）与两套主题（`github-light/github-dark`）；语法包随 `shiki` 主包引入，随算法页懒加载，首页不受影响。静态源码在模块初始化时各高亮一次并缓存；主题随 `useSystemStore().isDarkMode` 明暗切换。注：迁移到 `createHighlighterCore` + `@shikijs/langs/*` 细粒度引入（可去掉主包随附的约 295 条 registry-index 元数据）是后续可选的 bundle 优化，当前不阻塞任何功能。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；遵循覆盖率门槛（业务核心 ≥85%/75%，一般 ≥70%/60%）。
- Shiki + 语法包随算法页懒加载，不影响首页体积。

## 验收口径

- [ ] 进冒泡页默认暂停在第 0 步；播放 / 暂停 / 单步前进 / 单步后退 / 重置 / 调速 / 进度条均可用，且边界正确（首步不能再后退、末步不能再前进、播放到末步自动暂停）。
- [ ] 代码视图四语言 Tab 可切换；当前执行行随步高亮，且与动画、变量面板同步。
- [ ] 变量面板随步显示正确变量值，变化时有高亮。
- [ ] 可视化为柱状条 + 数值 + 指针；交换有平滑动画；比较 / 已排序有视觉区分。
- [ ] **框架可复用**：以"加一个新算法只需实现 `AlgorithmModule`、不改外壳"为硬验收（设计期以接口与 BubbleSort 接入方式证明，不要求真的再写第二个算法）。
- [ ] L3/L4/L5 全绿、覆盖率达门槛；`docs/plans/index.md`、`docs/test-cases/` 索引、`roadmap.md` 均回写。

## 开放问题

- 速度档位具体值（0.5× / 1× / 2× 暂定）与 1× 基准间隔（暂定 800ms），实现期可微调。
- 暗色主题下柱状条 / 高亮 / 指针的配色细节，留实现期视觉打磨。

## 变更历史

- 2026-06-19：创建。brainstorming 确认：只读调试器视图、可复用播放器框架（仅冒泡验证）、"可视化上 / 代码 + 变量下"布局、柱状条 + 数值标签动画、Shiki 高亮、语言 TS/Python/Go/Rust、默认暂停第 0 步。
