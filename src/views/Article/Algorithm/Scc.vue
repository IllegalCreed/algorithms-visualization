<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { sccModule } from '@/algorithms/scc.module';
</script>

<template>
  <Article>
    <h1>强连通分量（Tarjan）</h1>
    <p class="sub">图算法 · 有向图连通性 · O(V+E)</p>

    <h2>能互相到达的极大集合</h2>
    <p>
      在<strong>有向图</strong>里，如果一组节点两两都能<strong>互相到达</strong>（你能到我、我也能到你），且再加任何一个节点都做不到，这组节点就构成一个<strong>强连通分量（SCC）</strong>。把每个
      SCC
      缩成一个点，有向图就变成一张<strong>无环图（DAG）</strong>——这是很多高级图算法的第一步。朴素做法对每个点各跑一次
      DFS 判断可达性太慢；<strong>Tarjan</strong> 用一趟 DFS 就求出所有 SCC。
    </p>

    <h2>dfn、low 和一个栈</h2>
    <p>
      DFS 给每个节点记两个数：<strong><code>dfn[u]</code></strong
      >——它被<strong>发现的次序</strong>（时间戳）；<strong><code>low[u]</code></strong
      >——从 u 的子树出发、<strong>至多经过一条回边</strong>能回溯到的<strong>最小 dfn</strong>。DFS
      时把访问到的节点<strong>压入一个栈</strong>。<code>low</code> 在两处更新：子节点递归返回时
      <code>low[u]=min(low[u], low[子])</code>；遇到一条指向<strong>还在栈里</strong>的节点 v
      的<strong>回边</strong>时 <code>low[u]=min(low[u], dfn[v])</code>。
    </p>
    <p>
      关键判据：当 <strong><code>low[u] == dfn[u]</code></strong> 时，说明 u
      <strong>回不到任何更早的祖先</strong>，它就是一个 SCC 的<strong>根</strong>——此时把栈里
      <strong>u 之上（含 u）</strong
      >的节点全部弹出，它们正好构成一个强连通分量。因为每个节点、每条边只处理一次，总复杂度
      <code>O(V+E)</code>。
    </p>
    <p>
      下面是一张 6 节点有向图。点<strong>「下一步」</strong>逐步看：节点右上角是
      <strong>dfn/low</strong
      >、<strong>虚线环</strong>是当前在栈里的节点、<strong>琥珀环</strong>是当前节点、<strong>绿边</strong>是
      DFS 树边、<strong>黄边</strong>是当前回边；每弹出一个
      SCC，它的节点就<strong>着上同一种颜色</strong>。走到底，三个 SCC
      <strong>{0,1,2}、{3,4}、{5}</strong> 三色分明。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="sccModule" />

    <h2>强连通分量在哪里用</h2>
    <Callout>
      <b>缩点</b>：把每个 SCC 缩成一点得到 DAG，再在 DAG 上跑
      <router-link to="/docs/topological-sort">拓扑排序</router-link> / DP。<br />
      <b><router-link to="/docs/two-sat">2-SAT</router-link></b
      >：布尔约束可满足性判定，靠 SCC 判断 x 与 ¬x 是否同组。<br />
      <b>依赖 / 死锁检测</b>：有向环 = 循环依赖，SCC 一次找出所有环。
    </Callout>
    <p>
      和
      <router-link to="/docs/topological-sort">拓扑排序</router-link
      >正好互补：拓扑排序处理的是<strong>无环</strong>有向图（DAG），而 Tarjan
      专门把<strong>有环</strong>的部分（每个
      SCC）识别出来——两者合起来，任何有向图都能先缩点、再拓扑。
    </p>
  </Article>
</template>
