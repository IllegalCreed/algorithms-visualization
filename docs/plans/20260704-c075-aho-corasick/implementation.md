# 实现记录：AC 自动机 Aho-Corasick（C-20260704-075，Trie + fail · 复用 GraphView）

> Status: verified
> Stable ID: C-20260704-075
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 GraphView .fail 边样式**（L4）：types.ts +`AcExecPoint`；先 GraphView.spec 追加 TC-VIZ-GRAPHVIEW-FAIL-01/02 跑红 → GraphView.vue（加 `.graph-edge.fail` 虚线紫 CSS）跑绿。8 图算法用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 ahocorasick.module.spec（TC-AC-MOD-01..12）跑红 → ahocorasick.{ts,sources.ts,module.ts}（Trie + BFS fail + 匹配）跑绿。
3. **T2 新页 + 接线**：AhoCorasick.vue；路由 /docs/aho-corasick；菜单 + 首页「字符串」第 7 项（新 aho-corasick.svg）；改 TC-HOOK（字符串 children +aho-corasick）；KMP 页尾双向链接；AhoCorasick.spec + aho-corasick.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 字符串第 7 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **GraphView additive 仅加 `.fail` 边样式（零回归）**：`.graph-edge.fail { stroke:#9c6ade; stroke-dasharray:6 4 }`（虚线紫）。`edgeClass` 本就是 `Record<string,string>` 通用字典、类绑定已生效，故**无组件逻辑/类型改动**（单测层无 RED，纯视觉由真机验）；trie 边默认灰实线、当前边 `current` 琥珀、fail 边 `fail` 虚线紫。GraphTrack/AlgorithmPlayer 零改动。
- **oracle `ahocorasick.ts`**：真实构 Trie（逐模式插入）+ BFS 建 fail（父 fail 先算，`fail[v]=goto(fail[u],c)` 沿 fail 链回退，输出链 `out[v]+=out[fail[v]]`）+ `acMatch()` 跑文本。8 状态、fail=[0,0,0,0,1,2,0,3]、非平凡 fail {sh→h,she→he,hers→s}、命中 she[1,3]/he[2,3]/hers[2,5]。
- **module 17 步**：insert×3（revealed 集合渐显节点 + trieEdges 累加，终态 nodeBadge 模式名）→ fail×7（BFS 序；非平凡加 failEdges 虚线边 + activeNode，→root 仅字幕）→ match/hit×6（当前状态 activeNode，fail 跳时 fail 边 current 琥珀点亮，命中步 hit 点报告含输出链重叠）→ done（汇总）。edgeClassOf 把 failEdges 标 'fail'、当前边覆盖 'current'。
- **匹配 fail 跳可视化**：读 'r'（i=4）时 she 无转移 → 沿 fail 跳 she→he（fail 边点亮 current）→ he→r=her（activeNode）。curKey 优先取跳跃的 fail 边、否则取 trie 转移边。
- **四语言 sources**：TS/Python/Go/Rust 完整 AC（建 Trie + BFS fail + 匹配），lineMap 逐行核对（ts 31/py 25/go 35/rust 34 行）对齐 insert/fail/match/hit/done。
- **双向链接**：KMP 页尾「AC 自动机」改 router-link 指向本页；本页回指 KMP/RK/BM/Trie。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1423/1423 全绿**、聚合 statements 95.48% · branches 95.15%。
- **e2e（真机 Playwright/Chromium）**：`aho-corasick` + 回归 `two-sat`/`scc` **3/3 通过**——图轨 8 节点、无柱数组、Shiki、拖末步字幕含 hers。
- **真机视觉自检（2 图眼验）**：第 10/17 步（末 fail）——8 状态两分支、终态 badge he/she/hers、2 条 fail 虚线 + 当前 hers→s 琥珀；第 15/17 步（i=4 fail 跳）——she→he fail 边琥珀点亮、activeNode=her、字幕「she 无 r 转移 → 沿 fail 跳到 he → 到达 her」；末步命中 she[1,3]/he[2,3]/hers[2,5]。
- **回归**：GraphView 仅加 CSS；8 图算法不设 fail 类 → 渲染不变（TC-VIZ-GRAPHVIEW-\*/各图算法 e2e 全绿）；仅 TC-HOOK（字符串 children）追加 aho-corasick。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；18 Case + 改 2 HOOK 全绿、双轨部署。
