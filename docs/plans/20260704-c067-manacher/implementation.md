# 实现记录：Manacher 最长回文子串（C-20260704-067，新建 ManacherView 回文轨）

> Status: verified
> Stable ID: C-20260704-067
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新轨 + 类型 + 接线**（L4）：types.ts +`ManacherTrack`/`ManacherExecPoint`/`Step.manacher?`；先 ManacherView.spec（TC-VIZ-MANACHERVIEW-01..04）+ AlgorithmPlayer.spec 追加（TC-PLAYER-MANACHER-01/02）跑红 → 新建 ManacherView.vue（两行 + 高亮）+ AlgorithmPlayer 加 import + `<ManacherView v-if>` 跑绿。
2. **T1 module + oracle + sources**（L3）：先 manacher.module.spec（TC-MAN-MOD-01..12）跑红 → manacher.{ts,sources.ts,module.ts}（预处理 + 镜像复用 + 中心扩展）跑绿。
3. **T2 新页 + 接线**：Manacher.vue（Article + AlgorithmPlayer）；路由 /docs/manacher；菜单 + 首页「字符串」第 4 项（新 manacher.svg）；改 TC-HOOK（字符串 children +manacher）；Manacher.spec + manacher.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 字符串第 4 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **新建第 13 条 ManacherView 回文轨（additive 可插拔）**：两行——转换串行（`mn-s-cell`）+ 半径数组行（`mn-p-cell`，null 显示空）；高亮 `mn-center`（当前中心 i，琥珀环）/`mn-mirror`（镜像点 2C−i，蓝环）/`mn-box`（最右回文带 [L,R]，浅蓝底）/`mn-best`（最长回文，绿底，覆盖 box）。AlgorithmPlayer 仅 +import + 一行 `<ManacherView v-if="current.manacher">`，其它算法不设 `Step.manacher` → 不渲染，零回归。
- **module 维护 C/R + 镜像推导**：对每个中心 i，用「进入本轮前的」`cBefore/rBefore` 决策：`i < rBefore` → `mirror` 步，`p[i]=min(rBefore−i, p[2·cBefore−i])` 后继续扩展；否则 `expand` 步从 0 纯扩展。每步 `boxL=2·cBefore−rBefore`、`boxR=rBefore`（即决策时的最右回文 [C−p[C], C+p[C]]），使 ManacherView 能画带、且 spec 可由 (boxL+boxR)/2 反推 C 验证 `mirror=2C−i`。`best` 为运行最大半径中心对应的转换串区间。
- **demo "babad" 覆盖两种关键情形**：i=5 复用镜像半径 1（`min(R−i=1, p[1]=1)`）后再扩展到 3；i=7 被 `R−i` 截断（`min(1, p[3]=3)=1`）。转换串 `#b#a#b#a#d#`、p=[0,1,0,3,0,3,0,1,0,1,0]、最长回文 "bab"。约 13 步（init 1 + 11 中心 + done 1）。
- **oracle 分离**：`manacher.ts` 提供 `manacherTransform()`/`manacherRadii()`/`longestPalindrome()`，module spec 末步与 oracle 对拍。四语言 sources（TS/Python/Go/Rust）lineMap 对齐 init/mirror/expand/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓（0 warning）/ `type-check`（vue-tsc）✓ / `test:unit run --coverage` **1283/1283 全绿**、聚合 statements 95% · branches 94.51% · functions 94.7% · lines 95.57%（远超门槛）；`manacher.*`/`ManacherView.vue` 覆盖良好。
- **e2e（真机 Playwright/Chromium）**：`manacher` + 回归 `kmp` **2/2 通过**——转换串 11 格、无柱数组、Shiki 着色、拖末步 7 `.mn-best`（"bab" 转换串 #b#a#b#）+ 字幕含 bab。
- **真机视觉自检（2 图眼验）**：第 7/13 步（中心 i=5）——琥珀环 idx5 + 蓝环镜像 idx1 + p[5] 琥珀格显 3 + 状态「🪞 镜像复用」+ 字幕「先用镜像点 1 复用 p[5]=min(R−i=1, p[1]=1)=1，再向外扩展 → 半径 3」；末步 13/13——p 行 `0 1 0 3 0 3 0 1 0 1 0`（= oracle）+ 7 绿格 + 字幕「max(p)=3 在中心 3，最长回文 = "bab"（长 3）」。
- **回归**：ManacherView 为新增独立轨，`Step.manacher` 未设即不渲染；KMP/RK/BM 及所有既有算法零回归；仅 `TC-HOOK`（字符串 children）追加 `manacher`；播放器可插拔轨 12→13。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；22 Case + 改 2 HOOK 全绿、双轨部署。
