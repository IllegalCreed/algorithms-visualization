# 测试用例：Manacher 最长回文子串（C-20260704-067，新建 ManacherView 回文轨）

> Status: verified
> Stable ID: C-20260704-067
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（manacher.module）/ L4（ManacherView + 播放器接线 + Manacher 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-MANACHERVIEW-*`、`TC-PLAYER-MANACHER-*`、`TC-MAN-MOD-*`、`TC-VIEW-MAN-*`、`TC-E2E-MAN-01`；**改** `TC-HOOK`（字符串 children）

## L4 —— `ManacherView` 回文轨（`src/components/ManacherView.spec.ts`，新增）

| 用例 ID                | 场景            | 期望                                                                  |
| ---------------------- | --------------- | --------------------------------------------------------------------- |
| TC-VIZ-MANACHERVIEW-01 | 两行渲染        | `s` 长 11 → 11 `.mn-s-cell` + 11 `.mn-p-cell`；`p` 含 null 的格显示空 |
| TC-VIZ-MANACHERVIEW-02 | 中心 + 镜像高亮 | `center=3` → 1 `.mn-center`；`mirror=1` → 1 `.mn-mirror`              |
| TC-VIZ-MANACHERVIEW-03 | 最右回文带      | `boxL=0,boxR=6` → 7 格 `.mn-box`                                      |
| TC-VIZ-MANACHERVIEW-04 | 最长回文绿      | `best=[0,6]` → 7 格 `.mn-best`                                        |

## L4 —— 播放器接线（`src/components/player/AlgorithmPlayer.spec.ts`，追加）

| 用例 ID               | 场景             | 期望                                            |
| --------------------- | ---------------- | ----------------------------------------------- |
| TC-PLAYER-MANACHER-01 | step 带 manacher | 当前步含 `manacher` → 渲染 `ManacherView`       |
| TC-PLAYER-MANACHER-02 | 零回归           | 排序 step 无 `manacher` → 不渲染 `ManacherView` |

## L3 —— `manacher.module`（`src/algorithms/manacher.module.spec.ts`）

固定 `"babad"`；oracle `manacherTransform()`=`#b#a#b#a#d#`、`manacherRadii()`=`[0,1,0,3,0,3,0,1,0,1,0]`、`longestPalindrome()`=`bab`。

| 用例 ID       | 场景                 | 期望                                                                    |
| ------------- | -------------------- | ----------------------------------------------------------------------- |
| TC-MAN-MOD-01 | 末步 done + 最长回文 | 末步 `done`；`best` 区间对应转换串上的 "bab"；vars/caption 含 `bab`     |
| TC-MAN-MOD-02 | 步合法 + 带回文轨    | 每步 `point ∈ {init,mirror,expand,done}` 且带 `manacher`、`array===[]`  |
| TC-MAN-MOD-03 | 转换串正确           | 每步 `manacher.s` === `manacherTransform()` === `#b#a#b#a#d#`           |
| TC-MAN-MOD-04 | 末步半径 = oracle    | 末步 `manacher.p` === `manacherRadii()` = `[0,1,0,3,0,3,0,1,0,1,0]`     |
| TC-MAN-MOD-05 | init 步 p 全空       | `init` 步 `manacher.p` 全为 `null`                                      |
| TC-MAN-MOD-06 | 中心逐一递增         | `mirror`/`expand` 步的 `center` 依次为 0,1,…,10（覆盖每个中心一次）     |
| TC-MAN-MOD-07 | mirror 步镜像合法    | 每个 `mirror` 步 `mirror` = 2·(当时 C) − center，且 `center < boxR`     |
| TC-MAN-MOD-08 | expand 步无镜像      | 每个 `expand` 步 `mirror` 为 `null`（超出最右回文，纯扩展）             |
| TC-MAN-MOD-09 | 半径逐格填充         | 每个中心步执行后 `p[center]` 由 null 变为非负整数，且等于 oracle 对应值 |
| TC-MAN-MOD-10 | 最长回文单调不减     | 相邻步 `best` 的长度（r−l）后 ≥ 前                                      |
| TC-MAN-MOD-11 | 四语言 + 行号        | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内           |
| TC-MAN-MOD-12 | module 元信息        | `title` 含「Manacher」或「回文」；`initialInput()` = `[]`               |

## L4 —— `Manacher` 视图（`src/views/Article/Algorithm/Manacher.spec.ts`，新增）

| 用例 ID        | 场景          | 期望                                                    |
| -------------- | ------------- | ------------------------------------------------------- |
| TC-VIEW-MAN-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                      |
| TC-VIEW-MAN-02 | 回文轨        | h1 含「Manacher」；渲染 `ManacherView`；无 `.bars-view` |
| TC-VIEW-MAN-03 | 全模板同屏    | 正文含「回文」+ ManacherView 同屏                       |

## L4 —— TC-HOOK（字符串第 4 项）

| 用例 ID | 改动                                                                                           |
| ------- | ---------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[5]`（字符串）children url = `['kmp','rabin-karp','boyer-moore','manacher']` |

## L5 —— Manacher 页 e2e（`e2e/manacher.e2e.ts`，新增）

| 用例 ID       | 场景          | 操作                                     | 期望                                                                                                                                                         |
| ------------- | ------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-E2E-MAN-01 | 全模板 + 互动 | 访问 `/docs/manacher`；`.scrub` 拖到末步 | 正文 `.article h1` 含「Manacher」；`.mn-view` 可见；11 `.mn-s-cell`；无 `.bars-view`；拖末步 7 `.mn-best`（"bab" 转换串）+ caption 含 `bab`；真机 Shiki 着色 |

## 回归

- 既有 12 轨 + 6 图算法 + 5 DP + 回溯 6 页 + 字符串 3 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **ManacherView 为新增独立轨**：其它算法不设 `Step.manacher` → 不渲染，`TC-PLAYER-*` 既有断言与所有算法零回归；AlgorithmPlayer 仅加一行 `v-if`。
- TC-HOOK 其余不变；仅字符串 children 追加 `manacher`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage`（Vitest 4，jsdom）→ **1283 用例全绿**；`pnpm exec playwright test manacher kmp` → **2/2 绿**。
- **本单新增 22 Case 全绿**：`TC-VIZ-MANACHERVIEW-01..04`（L4，回文轨）4 + `TC-PLAYER-MANACHER-01/02`（L4，播放器接线）2 + `TC-MAN-MOD-01..12`（L3，module）12 + `TC-VIEW-MAN-01..03`（L4，页）3 + `TC-E2E-MAN-01`（L5，e2e）1；**改** `TC-HOOK`（字符串 children `['kmp','rabin-karp','boyer-moore','manacher']`）menu+home 各 1。
- **关键断言实测**：末步 p = `manacherRadii()` = [0,1,0,3,0,3,0,1,0,1,0]（TC-MAN-MOD-04）；转换串 `#b#a#b#a#d#`（TC-03）；中心逐一 0..10（TC-06）；mirror 步 `mirror=2C−i` 且 `center<boxR`（TC-07）；expand 步 mirror 为 null（TC-08）；最长回文长度单调不减（TC-10）；末步 best 对应 "bab"（TC-01）。
- **真机自检**：i=5 镜像复用（蓝环镜像 + 琥珀环中心 + 字幕 min(R−i,p[mirror])）、末步 "bab" 7 绿格 + p 行 = oracle，与设计一致。
- **覆盖**：聚合 statements 95% / branches 94.51% / functions 94.7% / lines 95.57%，全部超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；22 Case + 改 2 HOOK 全绿。
