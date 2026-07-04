# 实现记录：欧几里得算法 GCD（C-20260704-079，新建 GcdView 矩形铺砖轨）

> Status: verified
> Stable ID: C-20260704-079
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新建 GcdView + 播放器接线**（L4）：types.ts +`GcdSquare`/`GcdExecPoint`/`GcdTrack`/`Step.gcd?`；先 GcdView.spec（TC-VIZ-GCDVIEW-01..03）+ AlgorithmPlayer.spec（TC-PLAYER-GCD-01/02）跑红 → 新建 GcdView.vue（矩形 + 方块 + 剩余框）+ AlgorithmPlayer 加一行 v-if 跑绿。既有轨用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 gcd.module.spec（TC-GCD-MOD-01..12）跑红 → gcd.{ts,sources.ts,module.ts}（辗转相除 + 铺砖）跑绿。
3. **T2 新页 + 接线**：Gcd.vue；路由 /docs/gcd；菜单 + 首页「数学与数论」第 3 项（新 gcd.svg）；改 TC-HOOK（数论 children +gcd）；Gcd.spec + gcd.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 数论第 3 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **新建第 17 条 GcdView 矩形铺砖轨**：viewBox 460×300，把 a×b 按 `scale=min((460-2M)/a,(300-2M)/b)` 等比缩放居中；渲染原矩形外框 + 每个方块（按 step 取调色板色、中心标边长）+ current 下标方块琥珀描边（`.gcd-current`）+ remaining 虚线框（`.gcd-remaining`）。新 `Step.gcd?` additive，AlgorithmPlayer 加一行 v-if。
- **oracle `gcd.ts`**：`gcd()` 辗转相除；`gcdSteps()` 除法步；`gcdTiling()` 几何铺砖——反复从长边（w≥h 横切 / 否则纵切）切 ⌊a/b⌋ 个正方形、记 (x,y,size,step)，并存每步剩余子矩形（degenerate 记 null）。gcd(30,18) → 方块 18/12/6/6 恰好铺满 540=30×18、最小 6=gcd。
- **module 5 步**：init（原矩形 + remaining 全框）→ cut×3（逐除法步：累加该步方块、current=本步下标、remaining=该步后子矩形；caption 给 a÷b=q 余 r + 剩余尺寸）→ done（remaining=null、caption gcd=6）。vars 显递推链 gcd(30,18)=gcd(18,12)=gcd(12,6)=gcd(6,0)=6。
- **四语言 sources**：TS/Python/Go/Rust 辗转相除，lineMap 逐行核对（ts 8/py 4/go 6/rust 8 行）对齐 init/cut/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1497/1497 全绿**、聚合 statements 95.65% · branches 95.27%。
- **e2e（真机 Playwright/Chromium）**：`gcd` + 回归 `sieve`/`linear-sieve`/`bubble-sort` **4/4 通过**——铺砖轨、无柱数组、Shiki、拖末步 4 方块 + 字幕含 6。
- **真机视觉自检（2 图眼验）**：第 3/5 步（cut1）——18 蓝 + 12 绿方块、12 方块琥珀描边、剩余 12×6 虚线框、字幕「18÷12=1 余 6」；末步 5/5——4 方块 [18,12,6,6] 恰好铺满、无剩余框、字幕「最小正方形边长=6·gcd(30,18)=6」。
- **回归**：新 Step.gcd? additive；既有算法不设 gcd → GcdView 不渲染（TC-PLAYER-\* 全绿）；仅 TC-HOOK（数论 children）追加 gcd。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；21 Case + 改 2 HOOK 全绿、双轨部署。
