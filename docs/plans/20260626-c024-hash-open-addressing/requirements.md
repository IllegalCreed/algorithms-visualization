# 需求：哈希·开放寻址（哈希页加一节「另一种解冲突：开放寻址」，M4 深度第二项 D2）

> Status: verified
> Stable ID: C-20260626-024
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Progress: 100%
> Blocked by: none
> Next action: 已完成（20 Case 全绿，全门禁通过，已落 main）；**M4 深度 D2 ✓**，下一项 D3 链表·双向
> Replaces: none
> Replaced by: none
> Related plans: C-20260625-021（哈希表/拉链法——本变更在其页**加一节**，补当年所砍的开放寻址）；M4 候选池 `docs/plans/backlog.md` D2；C-20260625-023（D1，同为「现有页加节」范式）
> Related tests: 计划新增 `TC-PROBE-LOGIC-*`（useProbe 纯逻辑）/ `TC-VIZ-PROBEVIZ-*`（HashProbeViz 互动）/ `TC-VIEW-HASH-03`（哈希页含 HashProbeViz）/ `TC-E2E-HASH-02`（哈希页开放寻址节 e2e）；不改写现有 TC-VIEW-HASH-01/02、修一处 TC-E2E-HASH-01（两 Playground 后 `.playground` 消歧）

## 背景

M4「数据结构深化与扩充」**深度第二项 D2**。哈希页（C-021）只讲了**拉链法**一种解冲突：每个桶挂一条链、冲突追加到链尾。但 requirements「不做什么」当年砍掉了**开放寻址 + rehash 扩容**（见 `docs/plans/backlog.md` D2）。本变更在哈希页**加一节**，补上第二种、思路完全不同的解冲突：**开放寻址 · 线性探测**——不挂链，所有键住同一张扁平表，冲突就在表内往后探一格。

落点已与 Owner 确认：**哈希页加一节**（不动菜单/路由/首页），区别于「单独做开放寻址新页」。互动深度选 **A**（线性探测插入/查找 + 装载因子读数，不做 rehash 扩容动画；完整 rehash 留作后续或广度）。

现状：哈希页 `Article/DataStructure/Hash.vue` 现有「什么是哈希表 / Playground(HashViz 拉链) / 拉链正文 / 哈希表在哪里用 / 引出图」。本节插在**拉链正文之后、「哈希表在哪里用」之前**。

## 两个地基决策（brainstorming + 交互原型已确认）

1. **同 4 个键、扁平表对照拉链**。和拉链那节同样的 `hash=key%7` 与同样的键 `[15,8,23,4]`，这次散进**7 格扁平数组**：`15`→格1、`8`→格1 撞了探到格2、`23`→格2 撞了探到格3、`4`→格4——冲突的键在表内**挤成一簇（聚集）**，与拉链那节的「链」形成鲜明对照。
2. **线性探测插入/查找 + 装载因子读数**。插入：`hash` 直达，撞了**逐格往后探**点亮、落到第一个空位；查找：从「家」探起，命中/探到空位即止；读数显**装载因子**（已用/总格）；表满（=1）提示「该扩容 rehash」。互动深度 **A**（不做 rehash 动画）。

## 与现有 HashViz 的关系（一句话）

`HashProbeViz` 是哈希页第二个互动件，与 `HashViz`（C-021，拉链法）**并列、互不依赖**；HashViz 讲「冲突挂表外的链」，HashProbeViz 讲「冲突在表内往后探」。两者共用 `hash=key%7` 与同一组初始键，对照「链 vs 簇」。

## 要做什么

1. **开放寻址逻辑**（`src/components/structures/useProbe.ts`）
   - 7 格扁平表 `slots: (number|null)[]`；`hash=key%7`；`insert` 线性探测找首个空位（环绕）返回探测路径 `path`；`search` 从家探到命中/空位返回 `path`+`steps`；`size`/`load`/`isFull`；`has`；`reset` 重建初始 `[15,8,23,4]`。可单测（不 mount）。
2. **开放寻址互动组件**（`src/components/structures/HashProbeViz.vue`）
   - 复用 `useProbe`，渲染 输入框 + 插入/查找/重置 + 7 格扁平表（格 + 下标）+ 装载因子读数（已用/7 + 进度条）+ 状态解说。探测走位点亮（home 虚框 / probe 黄 / land 绿 / hit 深绿）。对标 `HashViz`（async + busy）。
3. **哈希页加节**（`src/views/Article/DataStructure/Hash.vue`，拉链正文后插入）
   - `<h2>另一种解冲突：开放寻址</h2>` + 正文（扁平表 + 线性探测 + 同键成簇 + 装载因子/扩容 + 两法对照）+ `<Playground><HashProbeViz/></Playground>`。正文以原型文案为基础。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（D2 出池/完成）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M4 进度）。

## 不做什么（边界）

- **不做 rehash 扩容动画 / 二次探测 / 双重散列 / 删除墓碑（tombstone）**：本节只演线性探测的插入/查找 + 装载因子；表满仅**文字提示**该扩容，**不演**重新散列。完整 rehash 留后续或广度。
- **不改 HashViz / useHash / 骨架 / 菜单 / 路由 / 首页**：仅新增 useProbe/HashProbeViz + 哈希页加节。
- **不做其余深度项**（D3–D5）/ 广度项：各自后续。

## 业务规则 / 约束

- **互动模型**：读者驱动；探测走位点亮为延时动画（setTimeout、卸载清理、busy 防重入）；`insert`/`search` 同步改 `slots` 并同步返回结果（探测次数、命中槽），L4 可断言不依赖计时器。
- **数据**：固定 7 格扁平表；`hash=key%7`；初始 `[15,8,23,4]` 探测后落 `[_,15,8,23,4,_,_]`（格 1-2-3 成一簇）；线性探测环绕；装载因子 = 已用/7；满（7/7=1）禁止插入、提示扩容；输入范围 1–99。
- **可视化**：扁平表 7 格（空=凹陷 / 满=浅绿凸起 / home 虚框 / probe 黄 / land 绿 / hit 深绿）；装载因子进度条（近满橙）；容器**定宽定高、空表与满表同尺寸**（不跳版）；指针/高亮**贴格跟随**（非固定容器手算偏移）。
- **向后兼容硬约束**：仅新增 `useProbe`/`HashProbeViz` + 哈希页加节；HashViz/useHash 及 8 排序 + 其余 7 结构 + 播放器 全部现有 Case 零改动通过（哈希页现有 TC-VIEW-HASH-01/02 仍绿；TC-E2E-HASH-01 仅因第二个 `.playground` 出现需 `.first()` 消歧、断言意图不变）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 哈希页拉链段后多一节「另一种解冲突：开放寻址」：正文 + 内嵌 HashProbeViz。
- [ ] **互动**：默认见 7 格扁平表，初始 `[_,15,8,23,4,_,_]`（格 1-2-3 成一簇）；插入撞了逐格往后探点亮、落空位；查找探到命中/空位；装载因子读数随插入更新；表满提示「该扩容」。
- [ ] **正文质量**：讲清「开放寻址不挂链、表内往后探」「同键成簇=聚集的代价」「装载因子是命脉、满了要 rehash 扩容」「拉链 vs 开放寻址各自取舍 + 真实语言选型」。
- [ ] **零回归**：HashViz 及全部现有 Case 仍绿；哈希页两个 Playground（HashViz + HashProbeViz）共存。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog D2 出池标完成。

## 开放问题

- 加节后哈希页变长（两个互动件）：可接受；若日后过长再考虑拆姊妹页。
- 表满（装载因子=1）仅文字提示扩容、不演 rehash：A 范围明确取舍；若日后想演 rehash 可作 D2+ 或广度单列。

## 变更历史

- 2026-06-26：创建。M4 深度 D2 出池。brainstorming + 交互原型（`scratchpad/probe-proto.html`，浏览器实点插入/查找验证线性探测走位 + 同键 `[15,8,23,4]` 成簇 + 装载因子读数）确认两条决策——① 同键扁平表对照拉链；② 线性探测插入/查找 + 装载因子读数（范围 A，不做 rehash 动画）。落点=哈希页加节；rehash 留后续。
