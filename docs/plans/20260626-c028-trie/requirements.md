# 需求：字典树 Trie 前缀树（新页，M4 广度第一项 B1·首个广度新结构）

> Status: verified
> Stable ID: C-20260626-028
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Progress: 100%
> Blocked by: none
> Next action: 已完成（21 Case 全绿 + 改 2 HOOK，全门禁通过，已落 main）；**M4 广度 B1 ✓、首个广度新结构落地**，下一项 B2 并查集
> Replaces: none
> Replaced by: none
> Related plans: M4 候选池 `docs/plans/backlog.md` B1；深度 D1–D5 已收官（C-023..027）；范式承袭 C-022（图，固定结构 + 纯遍历可单测）
> Related tests: 计划新增 `TC-TRIE-LOGIC-*`（useTrie 纯逻辑）/ `TC-VIZ-TRIEVIZ-*`（TrieViz 互动）/ `TC-VIEW-TRIE-01/02`（字典树页）/ `TC-E2E-TRIE-01`（字典树页 e2e）；**修改** `TC-HOOK-01-2`、`TC-HOOK-02-4`（数据结构数 8→9，因新增结构）

## 背景

M4 深度 D1–D5 已收官（8 篇基础结构各加一节）。本变更是 M4**广度第一项 B1**、也是**首个广度新结构**：新增**字典树 Trie（前缀树）**独立页。它是 backlog 点名「自动补全、词典、前缀匹配；树家族延伸、视觉好」的兑现。

**定位（已与 Owner 确认）**：字典树结构上属于树家族，但既不是树页讲的 BST（值在节点、比较大小、O(log n)），也不是哈希表（整键散列、无前缀概念）——它是**字符在边上、路径拼出单词**的具名结构，查找 `O(L)`（L=词长，与词数无关），看家本领是**前缀查询/自动补全**（哈希表做不到）。因此**单独成页**，与 BST、哈希并列，而非作为其子类加节。

**新页 vs 加节**：这是广度首项，与深度「加节」不同，需新增 **4 处接线**——路由（`router/index.ts`）+ 侧边菜单（`Docs/Menu/hooks.ts`）+ 首页网格（`Home/Main/hooks.ts`）+ 图标（`assets/trie.svg`），外加 `Article/DataStructure/Trie.vue`。

## 三个地基决策

1. **固定字典树**（仿图页 C-022 固定图的稳妥做法）：用一组**共享前缀**的词集 `[cat, car, card, cup, do, dog]` 建一棵**布局一次算定**的 trie（不做任意词动态插入 → 布局静态、可单测、不反流）。`ca` 段被 cat/car/card/cup 共享、`car` 段被 car/card 共享——共享前缀一眼可见。
2. **查找（精确匹配）三种结局**：走字符路径——走到**没有这条边** → 不存在；走到了但该节点**不是单词结尾** → 「只是前缀、不算一个词」；走到且是结尾 → 「是一个词」。把「前缀 ≠ 单词」这个 trie 关键点演出来。
3. **前缀查询 startsWith（看家本领）**：走到前缀节点 → **点亮整棵子树** = 所有以该前缀开头的词（自动补全）。这是哈希表做不到、字典树独有的能力，是本页核心卖点。

## 与现有结构页的关系（一句话）

`TrieViz` 复用「SVG 圆节点 + 边 + 走位点亮」画法（承袭 TreeViz/GraphViz），但**字符在节点上、单词靠路径编码、支持前缀子树点亮**——讲 BST/哈希都没讲的「前缀共享 + 自动补全」。

## 要做什么

1. **字典树逻辑**（`src/components/structures/useTrie.ts`）
   - 固定词集建 trie，扁平化为 `nodes:{id,char,isEnd,depth,x,y,parent}[]` + `edges:[parent,child][]` + `words`；`search(word)` 返回 `{path, found, reason: 'found'|'prefix-only'|'no-edge'}`；`startsWith(prefix)` 返回 `{path, prefixNode, subtree, words}`。布局一次算定（leaf-packing）。可单测（不 mount）。
2. **字典树互动组件**（`src/components/structures/TrieViz.vue`）
   - 复用 `useTrie`，渲染 输入框 + 查找/前缀/重置 工具栏 + SVG（边 + 圆形字符节点 + 单词结尾标记）+ 走位点亮（查找路径 / 前缀子树）+ 状态解说。对标 GraphViz（async + busy + 卸载清理）。
3. **字典树页**（`src/views/Article/DataStructure/Trie.vue`）
   - 「什么是字典树（字符在边、路径拼词、O(L)）/ Playground(TrieViz) / 查找三结局 + 前缀自动补全正文 / 字典树在哪里用（自动补全、拼写检查、IP 路由、词典）」+ **与 BST/哈希的区别**点题。
4. **新页 4 处接线**：路由 `/docs/trie` name `trie`；菜单 + 首页网格各加「字典树」条目（数据结构分类，置于「图」之后）；`assets/trie.svg` 图标。
5. **测试与文档**：补 L3/L4/L5；**改** TC-HOOK-01-2 / TC-HOOK-02-4（8→9）；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（B1 出池/完成）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M4 转广度、B1 完成）。

## 不做什么（边界）

- **不做任意词动态插入 / 删除 / 压缩 trie（Radix/Patricia）/ 真实大词典**：本页用固定词集演「前缀共享 + 查找三结局 + 前缀补全」；动态插入与压缩留后续。
- **不改既有 8 结构页 / 排序 / 骨架 / 播放器**：仅新增 useTrie/TrieViz/Trie.vue + 4 处接线（菜单/路由/首页/图标）+ 改 2 处 HOOK 计数。
- **不做其余广度项**（B2 并查集…）：各自后续。

## 业务规则 / 约束

- **互动模型**：读者驱动；查找/前缀的点亮为延时动画（setTimeout、卸载清理、busy 防重入）；`search`/`startsWith` 纯函数同步返回结果（L4 可断言）。
- **数据**：固定词集 `[cat,car,card,cup,do,dog]`；trie 节点字符在节点上（边入此节点的字符）、root char 空；`isEnd` 标单词结尾；`startsWith.words` 排序后返回（确定性）。
- **可视化**：圆形字符节点（idle 浅绿 / 路径黄 / 命中深绿 / 子树点亮浅绿描边）；单词结尾节点加环/点；SVG 边；容器定宽定高。
- **新页接线**：路由 name = slug `trie`（与菜单 url 一致，`useMenuSelect` 靠它高亮）；菜单/首页「字典树」置数据结构分类末（图之后）；图标 1024 viewBox 黑剪影、`<img :src>` 引入。
- **向后兼容硬约束**：仅新增 + 4 处接线 + 2 处 HOOK 计数改（8→9，合理变更）；既有 8 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case 零改动通过（除 HOOK 两条计数）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 新增「字典树」页（`/docs/trie`）：菜单/首页可进入、不 404；正文 + 内嵌 TrieViz。
- [ ] **互动**：见固定 trie（共享前缀 ca/car 可见、单词结尾有标记）；查找 `card`=是一个词、`ca`=只是前缀、`cab`=不存在；前缀 `ca`→点亮 [car,card,cat]、`do`→[do,dog]。
- [ ] **正文质量**：讲清「字符在边、路径拼词、O(L)」「前缀 ≠ 单词」「前缀查询/自动补全是看家本领」「与 BST（值/比较）、哈希（整键散列、无前缀）的区别」「自动补全/拼写检查/IP 路由等用途」。
- [ ] **零回归**：既有 8 结构 + 8 排序 + 播放器 全绿；仅 TC-HOOK-01-2/02-4 计数 8→9（合理）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog B1 出池标完成、**M4 转广度首项落地**。

## 开放问题

- trie 布局用 leaf-packing 一次算定：固定词集下足够；若日后做动态插入需换增量布局。
- 词集规模（6 词 11 节点）：够展示共享前缀又不过密；画布定宽容纳。

## 变更历史

- 2026-06-26：创建。M4 广度 B1（首个广度新结构）出池。定位＝树家族具名结构、与 BST/哈希并列（非子类），故单独成页。固定词集 + 查找三结局 + 前缀自动补全。新页 4 处接线 + 改 2 处 HOOK 计数。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
