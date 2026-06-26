# 设计：字典树 Trie（固定词集 + 查找三结局 + 前缀自动补全，新页）

> Status: verified
> Stable ID: C-20260626-028
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
新页 src/views/Article/DataStructure/Trie.vue
   │  「什么是字典树」正文 + <Playground><TrieViz/></Playground> + 查找/前缀正文 + callout
   ▼
└─ 互动组件（src/components/structures/，新增）
     TrieViz.vue  ── 用 ── useTrie.ts（固定词集建 trie + 布局一次算定 + 纯 search/startsWith，可单测）

4 处接线（新页区别于加节）：
  router/index.ts            +/docs/trie  name 'trie'（懒加载 Trie.vue）
  Docs/Menu/hooks.ts         数据结构分类 + {title:'字典树', url:'trie'}（图之后）
  Home/Main/hooks.ts         数据结构分类 + {title:'字典树', desc, icon:TrieIcon, url:'trie'}
  assets/trie.svg            1024 viewBox 黑剪影图标
改 2 处 HOOK 计数：TC-HOOK-01-2 / TC-HOOK-02-4（数据结构 8→9）
```

## 2. 字典树逻辑 `useTrie.ts`（固定词集 + 布局一次算定 + 纯 search/startsWith）

```ts
export const TRIE_WORDS = ['cat', 'car', 'card', 'cup', 'do', 'dog'];

export interface TNode {
  id: string;
  char: string; // 入此节点的边字符；root 为 ''
  isEnd: boolean; // 一个单词在此结束
  depth: number;
  x: number;
  y: number;
  parent: number; // 父节点下标；root 为 -1
}
export interface TrieSearchResult {
  path: number[]; // 走过的节点下标（含 root）
  found: boolean; // 精确命中（走到底且 isEnd）
  reason: 'found' | 'prefix-only' | 'no-edge';
}
export interface PrefixResult {
  path: number[]; // 到前缀节点的路径
  prefixNode: number; // 前缀节点下标；无则 -1
  subtree: number[]; // 前缀节点子树全部下标（点亮）
  words: string[]; // 子树内全部完整词（排序）
}
export interface UseTrie {
  nodes: TNode[];
  edges: [number, number][]; // [父, 子]
  words: string[]; // 词集（排序）
  search: (word: string) => TrieSearchResult;
  startsWith: (prefix: string) => PrefixResult;
}
```

- **建树**：`TRIE_WORDS` 逐词逐字符插入，孩子按字符升序；DFS 前序扁平化为 11 节点（root + c,a,r,d,t,u,p,d,o,g）、10 边。
  - 节点（DFS 前序）：0 root / 1 c / 2 a / 3 r(end,car) / 4 d(end,card) / 5 t(end,cat) / 6 u / 7 p(end,cup) / 8 d / 9 o(end,do) / 10 g(end,dog)。
- **布局（leaf-packing，一次算定）**：叶子（4,5,7,10）按 DFS 顺序占 x 槽 0..3，内部节点 x = 孩子 x 均值；`xPx=50+x*105`、`yPx=30+depth*60`。静态、不反流。
- **`search(word)`**：从 root 沿字符找子节点——遇没有的边 → `{found:false, reason:'no-edge'}`；走到底且 `isEnd` → `{found:true, reason:'found'}`；走到底但非 `isEnd` → `{found:false, reason:'prefix-only'}`。`path` = 走过的节点。
  - `search('card')`→found；`search('ca')`→prefix-only；`search('cab')`→no-edge；`search('do')`→found（do 是词）。
- **`startsWith(prefix)`**：沿字符走到前缀节点（不看 isEnd）；遇没有的边 → `{prefixNode:-1, words:[]}`；否则 `prefixNode`=当前，`subtree`=其全部后代（含自身），`words`=子树内 `isEnd` 节点回溯父链拼出的词（排序）。
  - `startsWith('ca')`→words `['car','card','cat']`；`startsWith('do')`→`['do','dog']`、subtree 2 节点；`startsWith('xyz')`→prefixNode -1、words []。
- **关键不变量**：`ca` 段被 4 词共享、`car` 段被 2 词共享（共享前缀）；`search` 三结局区分「不存在 / 只是前缀 / 是一个词」；`startsWith` 子树 = 自动补全候选。

> 注：trie 固定（无 reactive），useTrie 返回静态数据 + 纯 search/startsWith；走位/子树点亮动画由 TrieViz 用 setTimeout 驱动。

## 3. 字典树互动组件 `TrieViz.vue`

### 3.1 结构与布局

```
.trie-viz (column, center)
 ├─ .toolbar   输入框 + 查找 / 前缀 / 重置（查找=精确、前缀=startsWith）
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽高
 │        <svg> <g.edges> <line.edge × 10>
 │              <g.verts> <g.tnode × 11>（circle + char；root 空心）
 │                  .tnode.path（走位黄）/ .tnode.hot（命中深绿）/ .tnode.lit（子树点亮）/ .tnode.end（单词结尾环）
 └─ .status   状态解说行
```

### 3.2 交互与动画

- **查找（精确）**：`r = search(input)`（同步）→ **同步**置 status（三结局之一，可测）→ 逐节点点亮 `r.path`（`.path` 黄），命中则末位 `.hot` 深绿。busy 防重入、卸载清理。
- **前缀**：`r = startsWith(input)`（同步）→ **同步**置 status（补全词列表，可测）+ **同步**置 `subtreeLit = r.subtree`（`.tnode.lit`，可测）→ 逐节点点亮路径（cosmetic）。
- **重置**：清 path/hot/subtreeLit、busy=false、status 复位。
- `search`/`startsWith` 同步返回（L4 同步断言 status / subtreeLit）；点亮延时。

### 3.3 视觉映射

| 元素     | 态   | 颜色 / 处理                    |
| -------- | ---- | ------------------------------ |
| 节点     | idle | 圆形浅绿 `#8bd3a0` + 深绿字    |
| 单词结尾 | end  | 深绿描边环（标「这是一个词」） |
| 走位中   | path | 黄 `#ffcf5c`                   |
| 命中     | hot  | 深绿 `#4caf50` + 白字          |
| 前缀子树 | lit  | 浅绿描边高亮（自动补全候选）   |
| 边       | edge | 半透明灰线（SVG）              |

## 4. 字典树页 `Trie.vue` 正文大纲

```
<h1>字典树 Trie</h1><p class="sub">数据结构 · 把字符摊在边上的前缀树</p>
<h2>什么是字典树</h2>
<p>前面的树（BST）每个节点存一个值、靠比较找路；哈希表把整个键散列成桶号。字典树换了个思路——字符在边上，从根到某节点的一条路径，正好拼出一个字符串。一个词不是存在某个节点里，而是摊成一条路径。</p>
<p>这里固定放了 6 个词 [cat,car,card,cup,do,dog]。注意 cat/car/card/cup 共用开头的 c→a…（共享前缀），省地方也快。查找一个词只看它有多长（O(L)），跟一共存了多少词无关。点查找/前缀试试。</p>
<Playground><TrieViz/></Playground>
<p>查找有三种结局：走到没有往下的边=不存在；走到了但这节点不是单词结尾=「只是前缀、不算一个词」（比如 ca）；走到底且是结尾=这是一个词。「前缀≠单词」是 trie 的关键。</p>
<p>它真正的看家本领是前缀查询：走到前缀节点，把下面整棵子树点亮，就是所有以它开头的词——这就是自动补全。哈希表把键打散、根本没有「前缀」概念，做不到这件事。</p>
<h2>字典树在哪里用</h2>
<Callout>自动补全 / 搜索建议；拼写检查 / 词典；IP 路由最长前缀匹配；敏感词过滤。</Callout>
<p>（与 BST 比：值在节点 vs 字符在边；与哈希比：整键散列 vs 前缀共享。）</p>
```

## 5. 组件清单与改动面

| 文件                                       | 类型       | 改动                                           |
| ------------------------------------------ | ---------- | ---------------------------------------------- |
| `src/components/structures/useTrie.ts`     | **新增**   | 固定词集建 trie + 布局 + 纯 search/startsWith  |
| `src/components/structures/TrieViz.vue`    | **新增**   | SVG 字符树 + 查找三结局 + 前缀子树点亮互动     |
| `src/views/Article/DataStructure/Trie.vue` | **新增**   | 字典树知识页                                   |
| `src/router/index.ts`                      | 改（接线） | +`/docs/trie` name `trie`（懒加载）            |
| `src/views/Docs/Menu/hooks.ts`             | 改（接线） | 数据结构分类 +「字典树」`url:'trie'`（图之后） |
| `src/views/Home/Main/hooks.ts`             | 改（接线） | 数据结构分类 +「字典树」+ TrieIcon             |
| `src/assets/trie.svg`                      | **新增**   | 1024 viewBox 黑剪影图标                        |
| `src/views/Home/Main/hooks.spec.ts`        | 改（计数） | TC-HOOK-01-2 数据结构 8→9                      |
| `src/views/Docs/Menu/hooks.spec.ts`        | 改（计数） | TC-HOOK-02-4 数据结构 8→9                      |

**零改动**：既有 8 结构页 / 8 排序 / `article/` 骨架 / 其余 `structures/*` / 播放器 / store。

## 6. 向后兼容论证

- `useTrie`/`TrieViz`/`Trie.vue`/`trie.svg` 全新；4 处接线为**追加**条目/路由（既有条目顺序不变，url 唯一）。
- 改动仅 2 处 HOOK 计数断言（数据结构 8→9）——这是新增结构的**合理行为变化**，非回归；其余既有 Case（8 结构 + 8 排序 + 播放器 + 骨架）零改动通过。
- 新页路由 name `trie` = 菜单 url，`useMenuSelect` 据此高亮；SPA 404 query 编码通用、无需改 404.html。
- 新增 `TC-TRIE-LOGIC-*` / `TC-VIZ-TRIEVIZ-*` / `TC-VIEW-TRIE-01/02` / `TC-E2E-TRIE-01`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useTrie`（`TC-TRIE-LOGIC-*`）：nodes 11/edges 10/words 6；root char ''；坐标+id 唯一；共享前缀（car/cat 前 3 节点同）；search found/prefix-only/no-edge；startsWith ca→[car,card,cat]、do→[do,dog]、xyz→空。
- **L4 互动** `TC-VIZ-TRIEVIZ-*`：11 tnode+10 edge+输入框+3 按钮；节点字符；查找 card「是一个词」/ ca「前缀」/ cab「不存在」；前缀 ca status 含 car/card/cat + 子树点亮（.tnode.lit）；重置清高亮。
- **L4 视图** `TC-VIEW-TRIE-01/02`：含 Article+TrieViz；「字典树」标题 + Playground。
- **L5 e2e** `TC-E2E-TRIE-01`：`/docs/trie` 限定 `.trie-viz`：11 节点、查找 card status 含「词」、前缀 ca status 含 car、重置。
- **改** `TC-HOOK-01-2`/`TC-HOOK-02-4`：数据结构 9 项。
