# 测试用例：欧几里得算法 GCD（C-20260704-079，新建 GcdView 矩形铺砖轨）

> Status: verified
> Stable ID: C-20260704-079
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（gcd.module）/ L4（GcdView + 播放器接线 + Gcd 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-GCDVIEW-*`、`TC-PLAYER-GCD-*`、`TC-GCD-MOD-*`、`TC-VIEW-GCD-*`、`TC-E2E-GCD-01`；**改** `TC-HOOK`（数论 children）

## L4 —— GcdView 组件（`src/components/GcdView.spec.ts`，新增）

| 用例 ID           | 场景        | 期望                                                                          |
| ----------------- | ----------- | ----------------------------------------------------------------------------- |
| TC-VIZ-GCDVIEW-01 | 矩形 + 方块 | squares 4 个 → 4 个 `.gcd-square`；每方块标注其边长（含 18/12/6）             |
| TC-VIZ-GCDVIEW-02 | 当前 + 剩余 | `current=[0]` → 1 个 `.gcd-current`；`remaining` 存在 → 渲染 `.gcd-remaining` |
| TC-VIZ-GCDVIEW-03 | 无剩余      | `remaining=null` → 无 `.gcd-remaining`（铺满）                                |

## L4 —— 播放器接线（`src/components/player/AlgorithmPlayer.spec.ts`，追加）

| 用例 ID          | 场景          | 期望                                  |
| ---------------- | ------------- | ------------------------------------- |
| TC-PLAYER-GCD-01 | step 带 gcd   | step 含 `gcd` → 渲染 `GcdView`        |
| TC-PLAYER-GCD-02 | 无 gcd 零回归 | 排序 step 无 `gcd` → 不渲染 `GcdView` |

## L3 —— `gcd.module`（`src/algorithms/gcd.module.spec.ts`）

固定 `gcd(30,18)`；oracle `gcd()`=6，除法步 `30=1·18+12 / 18=1·12+6 / 12=2·6+0`。

| 用例 ID       | 场景               | 期望                                                                           |
| ------------- | ------------------ | ------------------------------------------------------------------------------ |
| TC-GCD-MOD-01 | 末步 done + gcd    | 末步 `done`；`gcd(30,18)` = 6                                                  |
| TC-GCD-MOD-02 | 步合法 + 带 gcd 轨 | 每步 `point ∈ {init,cut,done}` 且带 `gcd`、`array===[]`                        |
| TC-GCD-MOD-03 | 除法步对拍         | `gcdSteps()` = `[{a:30,b:18,q:1,r:12},{a:18,b:12,q:1,r:6},{a:12,b:6,q:2,r:0}]` |
| TC-GCD-MOD-04 | cut 步逐除法       | `cut` 步恰 3 个（3 个除法步）                                                  |
| TC-GCD-MOD-05 | 方块恰好铺满       | 末步 squares 总面积 = Σsize² = 30×18 = 540                                     |
| TC-GCD-MOD-06 | 最小方块 = gcd     | 末步 squares 最小 size = 6 = gcd                                               |
| TC-GCD-MOD-07 | 方块数 + 尺寸      | 末步 4 个方块，尺寸集合 {18,12,6}；step2 两个 6×6                              |
| TC-GCD-MOD-08 | 方块在矩形内       | 每方块 `0≤x, 0≤y, x+size≤30, y+size≤18`                                        |
| TC-GCD-MOD-09 | 剩余递减 + 末步空  | `remaining` 面积随 cut 步递减；末步 done `remaining` 为 null                   |
| TC-GCD-MOD-10 | 递推 caption       | done 步 caption 含 `6`；含「6」与除法/铺满语义                                 |
| TC-GCD-MOD-11 | 四语言 + 行号      | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                  |
| TC-GCD-MOD-12 | module 元信息      | `title` 含「欧几里得」或「公约数」；`initialInput()` = `[]`                    |

## L4 —— `Gcd` 视图（`src/views/Article/Algorithm/Gcd.spec.ts`，新增）

| 用例 ID        | 场景          | 期望                                                           |
| -------------- | ------------- | -------------------------------------------------------------- |
| TC-VIEW-GCD-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                             |
| TC-VIEW-GCD-02 | 铺砖轨        | h1 含「欧几里得」或「公约数」；渲染 `GcdView`；无 `.bars-view` |
| TC-VIEW-GCD-03 | 全模板同屏    | 正文含「辗转相除」+ GcdView 同屏                               |

## L4 —— TC-HOOK（数学与数论第 3 项）

| 用例 ID | 改动                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[6]`（数学与数论）children url = `['sieve-of-eratosthenes','linear-sieve','gcd']` |

## L5 —— GCD 页 e2e（`e2e/gcd.e2e.ts`，新增）

| 用例 ID       | 场景          | 操作                                | 期望                                                                                                                                          |
| ------------- | ------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-GCD-01 | 全模板 + 互动 | 访问 `/docs/gcd`；`.scrub` 拖到末步 | 正文 `.article h1` 含「欧几里得」或「公约数」；`.gcd-view` 可见；无 `.bars-view`；拖末步 4 个 `.gcd-square` + caption 含 `6`；真机 Shiki 着色 |

## 回归

- 既有 16 轨 + 7 大类现有 Case **零改动**全绿。
- **新 `Step.gcd?` additive**：既有算法不设 `gcd` → GcdView 不渲染，`TC-PLAYER-*` 全绿；AlgorithmPlayer 仅加一行 v-if。
- TC-HOOK：数学与数论 children 追加 `gcd`；其余不变。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1497 用例全绿**；`pnpm exec playwright test gcd sieve bubble-sort` → **4/4 绿**。
- **本单新增 21 Case 全绿**：`TC-VIZ-GCDVIEW-01..03`（L4）3 + `TC-PLAYER-GCD-01/02`（L4）2 + `TC-GCD-MOD-01..12`（L3）12 + `TC-VIEW-GCD-01..03`（L4）3 + `TC-E2E-GCD-01`（L5）1；**改** `TC-HOOK`（数论 children +gcd）menu+home 各 1。
- **关键断言实测**：gcd(30,18)=6（TC-01）；除法步 30=1·18+12/18=1·12+6/12=2·6+0（TC-03）；方块恰好铺满 Σsize²=540=30×18（TC-05）；最小方块=6=gcd（TC-06）；4 方块尺寸 {18,12,6}、step2 两个 6（TC-07）；方块在矩形内（TC-08）；剩余面积递减 216>72、末步 null（TC-09）。
- **真机自检**：矩形铺砖、cut1 步 18+12 方块 + 琥珀描边 + 剩余虚线框、末步 4 方块恰好铺满 gcd=6，与设计一致。
- **覆盖**：statements 95.65% / branches 95.27%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；21 Case + 改 2 HOOK 全绿。
