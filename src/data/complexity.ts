// src/data/complexity.ts —— 复杂度速查数据资产（C-114，M11-S2）
// 键 = 九大类网格的 url slug（名称/大类从 useCategoryData 联查，单一来源）；一致性由 complexity.spec 锁死。
export interface ComplexityEntry {
  time: string; // 时间复杂度（主写常用/最坏，特殊口径写进 note）
  space: string; // 空间复杂度（辅助空间口径）
  note?: string; // 一句话补充
}

export const COMPLEXITY: Record<string, ComplexityEntry> = {
  // ===== 数据结构（16） =====
  array: { time: 'O(1)', space: 'O(n)', note: '随机访问 O(1)；中部插删 O(n)' },
  link: { time: 'O(n)', space: 'O(n)', note: '定位 O(n)；已定位处插删 O(1)' },
  stack: { time: 'O(1)', space: 'O(n)', note: '压栈/弹栈均摊 O(1)' },
  queue: { time: 'O(1)', space: 'O(n)', note: '入队/出队 O(1)' },
  tree: { time: 'O(log n)', space: 'O(n)', note: 'BST 平均查改 O(log n)，退化 O(n)' },
  heap: { time: 'O(log n)', space: 'O(n)', note: '插入/弹顶 O(log n)，取顶 O(1)' },
  hash: { time: '期望 O(1)', space: 'O(n)', note: '冲突最坏 O(n)' },
  graph: { time: 'O(V+E)', space: 'O(V+E)', note: '邻接表遍历（BFS/DFS）' },
  trie: { time: 'O(L)', space: 'O(ΣL·Σ)', note: 'L=词长；空间随字符集放大' },
  'union-find': { time: '摊还 O(α(n))', space: 'O(n)', note: '路径压缩 + 按秩合并，近似常数' },
  lru: { time: 'O(1)', space: 'O(cap)', note: '哈希 + 双向链表' },
  'skip-list': { time: '期望 O(log n)', space: 'O(n)', note: '多层索引，概率平衡' },
  'segment-tree': { time: 'O(log n)', space: 'O(n)', note: '区间查改；建树 O(n)' },
  'b-tree': { time: 'O(log n)', space: 'O(n)', note: '高扇出、层数低——磁盘友好' },
  'bloom-filter': { time: 'O(k)', space: 'O(m)', note: 'k 个哈希；有误报无漏报' },
  fenwick: { time: 'O(log n)', space: 'O(n)', note: '前缀和查改双 log' },

  // ===== 排序（16） =====
  'bubble-sort': { time: 'O(n²)', space: 'O(1)', note: '有序提前退出最好 O(n)' },
  'cocktail-sort': { time: 'O(n²)', space: 'O(1)', note: '双向冒泡，乌龟提速' },
  'bitonic-sort': { time: 'O(n log²n)', space: 'O(1)', note: '排序网络，深度 O(log²n) 可并行' },
  'selection-sort': { time: 'O(n²)', space: 'O(1)', note: '交换次数最少 O(n)' },
  'insertion-sort': { time: 'O(n²)', space: 'O(1)', note: '近乎有序时接近 O(n)' },
  'binary-insertion-sort': { time: 'O(n²)', space: 'O(1)', note: '比较 O(n log n)，移动仍 O(n²)' },
  'shell-sort': { time: 'O(n^1.3)', space: 'O(1)', note: '取决于步长序列' },
  'merge-sort': { time: 'O(n log n)', space: 'O(n)', note: '稳定；自底向上迭代版' },
  'top-down-merge-sort': { time: 'O(n log n)', space: 'O(n)', note: '稳定；递归分治版' },
  'quick-sort': { time: '平均 O(n log n)', space: 'O(log n)', note: '最坏 O(n²)；原地' },
  'three-way-quick-sort': {
    time: '平均 O(n log n)',
    space: 'O(log n)',
    note: '大量重复键退化为 O(n)',
  },
  'dual-pivot-quick-sort': {
    time: '平均 O(n log n)',
    space: 'O(log n)',
    note: 'JDK Arrays.sort 同款',
  },
  'heap-sort': { time: 'O(n log n)', space: 'O(1)', note: '原地不稳定；建堆 O(n)' },
  'counting-sort': { time: 'O(n+k)', space: 'O(k)', note: 'k=值域；非比较' },
  'radix-sort': { time: 'O(d·(n+k))', space: 'O(n+k)', note: 'd=位数；逐位计数排序' },
  'bucket-sort': { time: '平均 O(n)', space: 'O(n)', note: '均匀分布假设；桶内插排' },

  // ===== 图算法（12） =====
  dijkstra: { time: 'O((V+E) log V)', space: 'O(V)', note: '堆优化；非负权' },
  kruskal: { time: 'O(E log E)', space: 'O(V)', note: '排序 + 并查集' },
  prim: { time: 'O((V+E) log V)', space: 'O(V)', note: '堆优化；稠密图可 O(V²)' },
  'bellman-ford': { time: 'O(V·E)', space: 'O(V)', note: '容负权；可检负环' },
  'topological-sort': { time: 'O(V+E)', space: 'O(V)', note: 'Kahn 入度队列' },
  'floyd-warshall': { time: 'O(V³)', space: 'O(V²)', note: '全源最短路' },
  scc: { time: 'O(V+E)', space: 'O(V)', note: 'Tarjan 一趟 DFS' },
  'two-sat': { time: 'O(V+E)', space: 'O(V+E)', note: '蕴含图 + SCC' },
  'max-flow': { time: 'O(V·E²)', space: 'O(V+E)', note: 'Edmonds-Karp（BFS 增广）' },
  hungarian: { time: 'O(V·E)', space: 'O(V)', note: '二分图最大匹配' },
  lca: { time: 'O(log n)', space: 'O(n log n)', note: '倍增：建表 O(n log n)/查询 O(log n)' },
  'euler-path': { time: 'O(E)', space: 'O(E)', note: 'Hierholzer 栈法' },

  // ===== 动态规划（11） =====
  'edit-distance': { time: 'O(n·m)', space: 'O(n·m)', note: '可滚动数组降 O(min(n,m))' },
  knapsack: { time: 'O(n·W)', space: 'O(n·W)', note: '可滚动至 O(W)；伪多项式' },
  'complete-knapsack': { time: 'O(n·W)', space: 'O(W)', note: '同行来源即可重复取' },
  lcs: { time: 'O(n·m)', space: 'O(n·m)', note: '回溯恢复解需全表' },
  lis: { time: 'O(n²)', space: 'O(n)', note: '贪心+二分可 O(n log n)' },
  'coin-change': { time: 'O(n·A)', space: 'O(A)', note: '方案数计数 DP' },
  'stone-merge': { time: 'O(n³)', space: 'O(n²)', note: '区间 DP；四边形不等式可 O(n²)' },
  tsp: { time: 'O(2ⁿ·n²)', space: 'O(2ⁿ·n)', note: '状压；n≈20 上限' },
  'tree-dp': { time: 'O(n)', space: 'O(n)', note: '后序一趟' },
  'digit-dp': { time: 'O(d·10)', space: 'O(d)', note: 'd=位数；含 tight 状态' },
  'reroot-dp': { time: 'O(n)', space: 'O(n)', note: '二次扫描（后序+前序）' },

  // ===== 回溯与搜索（9） =====
  'n-queens': { time: 'O(n!)', space: 'O(n)', note: '剪枝后远小于 n!' },
  subsets: { time: 'O(2ⁿ·n)', space: 'O(n)', note: '枚举全部子集' },
  permutations: { time: 'O(n!·n)', space: 'O(n)', note: '枚举全排列' },
  'combination-sum': { time: 'O(2ⁿ)', space: 'O(n)', note: '和剪枝显著加速' },
  maze: { time: 'O(m·n)', space: 'O(m·n)', note: 'DFS 回溯找一条路' },
  'number-of-islands': { time: 'O(m·n)', space: 'O(m·n)', note: 'Flood Fill 数连通块' },
  'word-search': { time: 'O(m·n·4^L)', space: 'O(L)', note: 'L=词长；失配回溯' },
  sudoku: { time: 'O(9^k)', space: 'O(k)', note: 'k=空格数；约束剪枝' },
  astar: { time: 'O(E log V)', space: 'O(V)', note: '可采纳启发式下最优' },

  // ===== 字符串（8） =====
  kmp: { time: 'O(n+m)', space: 'O(m)', note: '文本指针不回退' },
  'rabin-karp': { time: '期望 O(n+m)', space: 'O(1)', note: '滚动哈希；碰撞需验证' },
  'boyer-moore': { time: '平均 O(n/m)', space: 'O(Σ)', note: '亚线性；最坏 O(n·m)' },
  manacher: { time: 'O(n)', space: 'O(n)', note: '最右回文带复用镜像' },
  'suffix-array': { time: 'O(n log²n)', space: 'O(n)', note: '倍增法；DC3 可 O(n)' },
  'lcp-array': { time: 'O(n)', space: 'O(n)', note: 'Kasai 递推' },
  'aho-corasick': { time: 'O(n+m+z)', space: 'O(m·Σ)', note: 'z=命中数；多模式' },
  'z-function': { time: 'O(n)', space: 'O(n)', note: 'Z-box 抄镜像' },

  // ===== 数学与数论（10） =====
  'sieve-of-eratosthenes': { time: 'O(N log log N)', space: 'O(N)', note: '划倍数' },
  'linear-sieve': { time: 'O(N)', space: 'O(N)', note: '每合数只被最小质因子划一次' },
  gcd: { time: 'O(log min(a,b))', space: 'O(1)', note: '辗转相除' },
  'fast-power': { time: 'O(log n)', space: 'O(1)', note: '二进制取幂' },
  'ext-gcd': { time: 'O(log min(a,b))', space: 'O(log n)', note: '回代求 Bézout 系数' },
  crt: { time: 'O(k log M)', space: 'O(k)', note: 'k 条同余；M=模数积' },
  'euler-phi': { time: 'O(√n)', space: 'O(1)', note: '按质因子打折；筛法可批量 O(N)' },
  'miller-rabin': { time: 'O(k log³n)', space: 'O(1)', note: 'k 轮；单轮误报 ≤1/4' },
  fft: { time: 'O(n log n)', space: 'O(n)', note: '蝶形网络；多项式乘法' },
  'pollard-rho': { time: '期望 O(n^¼)', space: 'O(1)', note: '生日悖论 + gcd 显影' },

  // ===== 计算几何（5） =====
  'convex-hull': { time: 'O(n log n)', space: 'O(n)', note: 'Andrew 单调链（排序主导）' },
  'rotating-calipers': { time: 'O(n)', space: 'O(1)', note: '凸包直径（对踵点）' },
  'closest-pair': { time: 'O(n log n)', space: 'O(n)', note: '分治 + δ 带' },
  'segment-intersection': { time: 'O(1)', space: 'O(1)', note: '跨立试验（单对判定）' },
  'bentley-ottmann': { time: 'O((n+k) log n)', space: 'O(n)', note: 'k=交点数；扫描线' },

  // ===== 查找（5） =====
  'binary-search': { time: 'O(log n)', space: 'O(1)', note: '前提有序' },
  'binary-bounds': { time: 'O(log n)', space: 'O(1)', note: 'lower/upper bound 半开区间' },
  'rotated-search': { time: 'O(log n)', space: 'O(1)', note: '重复元素退化 O(n)' },
  'binary-answer': { time: 'O(log R · C)', space: 'O(1)', note: 'R=答案域；C=单次验证' },
  'ternary-search': { time: 'O(log n)', space: 'O(1)', note: '单峰函数求极值' },
};
