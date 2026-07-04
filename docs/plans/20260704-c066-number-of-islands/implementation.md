# 实现记录：岛屿数量（C-20260704-066，Flood Fill · 扩展 MazeView）

> Status: verified
> Stable ID: C-20260704-066
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 MazeView 扩展**（L4）：types.ts `MazeTrack` +`filled?`/`mark?`、`start?`/`goal?` 转可选、+`IslandsExecPoint`；先 MazeView.spec 追加 TC-VIZ-MAZEVIEW-05 跑红 → MazeView.vue（start/goal 空值保护 + filled 并入 solution + mark 覆盖 🐭）跑绿。迷宫 TC-VIZ-MAZEVIEW-01..04 保持绿。
2. **T1 module + oracle + sources**（L3）：先 islands.module.spec（TC-ISL-MOD-01..12）跑红 → islands.{ts,sources.ts,module.ts}（扫描 + DFS Flood Fill）跑绿。
3. **T2 新页 + 接线**：Islands.vue（Article + AlgorithmPlayer）；路由 /docs/number-of-islands；菜单 + 首页「回溯与搜索」第 6 项（新 islands.svg）；改 TC-HOOK（回溯 children +number-of-islands）；Islands.spec + number-of-islands.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 回溯网格搜索第 2 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **MazeView 扩成通用网格搜索轨（第 2 消费者，全 additive）**：`filled?` 复用既有 `.mz-solution` 绿样式（`solution = (onPath && solved) || filledSet.has`），无新 CSS；`mark?` 让当前格图标从硬编码 `🐭` 变 `{{ maze.mark ?? '🐭' }}`；`start?`/`goal?` 转可选并在 cells computed 加空值保护（`!!m.start && …`）。迷宫始终传 start/goal、不传 filled/mark → 行为不变，`TC-VIZ-MAZEVIEW-01..04` + 迷宫 module/页/e2e 零回归。
- **复用 Step.maze，无新 Step 字段**：islands.module 产出 `Step<IslandsExecPoint>`、`maze` 用同一 MazeTrack；AlgorithmPlayer 已按 `current.maze` 渲染 MazeView，零改动。
- **水 = 墙**：`walls[r][c] = grid==0`，水直接复用迷宫的深色墙样式；陆地未访问 = 默认浅色、已数 = `filled` 绿。
- **扫描 + DFS Flood Fill 逐格重走**：外层行列扫描每格 emit `scan`（水/已属岛跳过）；遇未访问陆地 → count++ + `found`（入 filled）+ 递归 `flood` 四连通邻居（各入 filled、emit）。固定 4×4 网格 3 岛 6 陆地 → 20 步（found 3 + flood 3 + scan 13 + done 1），末步 filled=6、count=3。oracle `islandCount()` 独立 DFS 对拍。
- **四语言 sources**：TS/Python/Go/Rust 标准 `numIslands`（沉岛法 grid[r][c]=0），lineMap 对齐 scan/found/flood/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓（0 warning）/ `type-check`（vue-tsc）✓ / `test:unit run --coverage` **1262/1262 全绿**、聚合 statements 94.97% · branches 94.37% · functions 94.66% · lines 95.56%（远超门槛）；`islands.*` 满覆盖（v8 text 隐藏）。
- **e2e（真机 Playwright/Chromium）**：`number-of-islands` + 回归 `maze` **2/2 通过**——4×4=16 格、无柱数组、Shiki 着色、拖末步 6 `.mz-solution` 绿陆地 + 字幕含 3。
- **真机视觉自检（2 图眼验）**：末步 20/20——3 片**互不相连**的绿色岛屿（左上 L 形 3 格 + 右侧竖条 2 格 + 左下单格）、水深色、无 🐭/🚩/S、字幕「共 3 个岛屿」；第 6/20 步——当前格图标 `🔎`（非 🐭，mark 覆盖生效）、岛 1 已铺 3 绿格、字幕「扫描 (0,3)：是水，跳过」。
- **回归**：MazeView 仅 additive（迷宫零回归）；N 皇后/子集/排列/组合总和/迷宫现有 Case 不变全绿；仅 `TC-HOOK`（回溯 children）追加 `number-of-islands`。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；17 Case + 改 2 HOOK 全绿、双轨部署。
