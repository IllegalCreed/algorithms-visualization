# 设计：换根 DP 树中距离之和（C-20260705-103，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-103
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

5 节点完全二叉树（0 根；1,2 孩子；3,4 为 1 的孩子）。**后序 3,4,1,2,0**：size=[5,3,1,1,1]、down（到子树内所有点的距离和）=[6,2,0,0,0]（down[1]=(0+1)+(0+1)=2、down[0]=(2+3)+(0+1)=6）。**root**：ans[0]=down[0]=6。**前序换根 DFS 序 1→3→4→2**：ans[1]=6−3+2=5、ans[3]=5−1+4=8、ans[4]=5−1+4=8、ans[2]=6−1+4=9。**ans=[6,5,9,8,8] = 暴力 BFS**。

## 复用（无 T0）

MatrixView 第 15 消费者零改动：5 行 `rowLabels=['0·根','1·L','2·R','3·LL','4·LR']` × 3 列 `colLabels=['size','down','ans']`；down 步填 size+down 双格（updatedCell=down 格、内部节点 sources=孩子 size/down 四格）；root 步 sources=[[0,1]]；reroot 步 sources=[[父,2],[自,0]]。`RerootExecPoint = 'init'|'down'|'root'|'reroot'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`reroot.ts`：`RR_N=5`、邻接（完全二叉树）；`rerootTrace()` 返回 `{postOrder, downFills:[{u,kids,size,down}], reroots:[{v,parent,sizeV,ansP,ansV}], ans}`；`bruteDist()` 逐点 BFS（独立真值）。
`reroot.module.ts`：init（O(n²) 之痛 + 二次扫描蓝图 + 树 ASCII caption）→ down×5（叶子平凡/内部公式 caption）→ root（第一趟收官 ans[0]=6）→ reroot×4（公式「近 size[v] 步、远 n−size[v] 步」逐项代入）→ done（ans 全表 + O(n) + 换根三件套 + 应用）。**12 步**。vars：阶段、当前节点、公式代入。
`reroot.sources.ts`：四语言 dfs1（后序 size/down）+ dfs2（前序换根），lineMap init/down/root/reroot/done。

## T2：页面 + 接线

`RerootDp.vue`（Algorithm 目录，正文树 ASCII）；路由 `/docs/reroot-dp`；菜单/首页「动态规划」第 11 项（digit-dp 后）；新 svg（双箭头两趟扫描）；改 TC-HOOK（DP 10→11 两 spec）；TreeDp 页「换根 DP」改实链。

## 复用与零回归

MatrixView 零改动（14 既有消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：三列表两趟填法、reroot 步 sources=[父 ans, 自 size]；oracle rerootTrace 与 bruteDist 逐点 BFS 对拍；module 12 步。
