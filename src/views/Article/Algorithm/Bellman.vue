<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bellmanFordModule } from '@/algorithms/bellman-ford.module';
</script>

<template>
  <Article>
    <h1>Bellman-Ford 最短路</h1>
    <p class="sub">图算法 · 单源最短路径（可含负权）</p>

    <h2>当最短路遇上负权边</h2>
    <p>
      <strong>Dijkstra</strong>
      求单源最短路又快又好，但有个硬前提：<strong>边权非负</strong>。一旦图里有<strong>负权边</strong>，它的「贪心取当前最近点、一锤定音」就会出错——一个点可能之后被一条含负权的更短路径再次刷新。<strong
        >Bellman-Ford</strong
      >
      正是为此而生。
    </p>

    <h2>Bellman-Ford 怎么做</h2>
    <p>
      它不挑点，也不贪心，而是<strong>反复「松弛」所有边</strong>：对每条边
      <code>u→v(w)</code>，如果「先到 u 再走这条边」比「当前到 v」更短，就更新
      <code>dist[v]</code>。把<strong>所有边</strong>都这样扫一遍算<strong>一轮</strong>，一共做
      <strong><code>V−1</code> 轮</strong>（V 是点数）。
    </p>
    <p>
      为什么是 <code>V−1</code> 轮？因为任何最短路最多经过
      <code>V−1</code> 条边；每做一轮，至少能把「再多一条边可达」的最短距离敲定，<code>V−1</code>
      轮后全部收敛。下面固定一张 5 个点的<strong>含负权</strong>有向图（源 A，含
      <strong>B→C=−3</strong
      >、<strong>D→E=−2</strong>）。点<strong>「下一步」</strong>逐步看每轮怎么扫边：当前边<strong>黄色高亮</strong>，能松弛就让终点的<strong>距离徽标下降</strong>——特别留意
      D、E 的距离要经过<strong>好几轮</strong>才逐步降到最终值（这正是需要 V−1
      轮的原因），走到底点亮<strong>最短路树</strong>（绿边）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="bellmanFordModule" />

    <p>
      复杂度 <code>O(V·E)</code>——比 Dijkstra
      慢，但能吃下负权。它还能<strong>顺带检测负环</strong>：跑完
      <code>V−1</code>
      轮后再多跑一轮，若还能松弛任何边，就说明图里有<strong>负权环</strong>（最短路无下界，无意义）。
    </p>

    <h2>Dijkstra vs Bellman-Ford</h2>
    <Callout>
      <b>Dijkstra</b>：贪心取当前最近点、一次定一点，<strong>要求边权非负</strong>，堆优化后
      <code>O((V+E)log V)</code>，快。<br />
      <b>Bellman-Ford（本页）</b>：盲扫所有边
      <code>V−1</code> 轮，<strong>能处理负权</strong>、能检测负环，<code>O(V·E)</code>，稳。<br />
      有负权用 Bellman-Ford，全正权优先 Dijkstra。多源最短路（任意两点）另有 <b>Floyd</b>。
    </Callout>
    <p>
      想复习正权图上的贪心最短路，去看
      <strong>Dijkstra 最短路</strong>——两页正是同一类问题的两种解法。
    </p>

    <h2>彩蛋：差分约束——最短路解不等式组</h2>
    <p>
      Bellman-Ford 有个漂亮的隐藏技能：解<strong>差分约束系统</strong>。一组形如
      <code>x_v − x_u ≤ w</code> 的不等式（工期先后、事件间隔这类约束都长这样），每条恰好对应一条边
      <code>u → v</code>（权 w）——因为最短路的三角不等式
      <code>dist[v] ≤ dist[u] + w</code> 与它一模一样。于是：建图跑 Bellman-Ford，<code>dist</code>
      数组就是一组可行解；出现<strong>负环</strong>
      = 约束互相矛盾、无解。负权边随手就来，这活非 Bellman-Ford
      莫属——「解不等式」与「跑最短路」在此合流。
    </p>
  </Article>
</template>
