<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { floydModule } from '@/algorithms/floyd.module';
</script>

<template>
  <Article>
    <h1>Floyd-Warshall 多源最短路</h1>
    <p class="sub">图算法 · 全源最短路径（任意两点）</p>

    <h2>一次求出所有点对的最短路</h2>
    <p>
      Dijkstra、Bellman-Ford 都是<strong>单源</strong>最短路——从一个起点出发。可有时我们想知道
      <strong>任意两点之间</strong
      >的最短距离（比如任意两城市间的最短车程）。挨个点跑一遍单源当然行，但
      <strong>Floyd-Warshall</strong> 用一张<strong>距离矩阵</strong>+
      三行循环，优雅地一次算出全部。
    </p>

    <h2>Floyd 怎么做</h2>
    <p>
      用矩阵 <code>dist[i][j]</code> 存「i 到 j
      当前已知的最短距离」，初始就是<strong>邻接矩阵</strong>（有直接边取边权，没有则
      ∞，自己到自己为 0）。然后<strong>逐个</strong>把每个点
      <code>k</code> 试作<strong>中转点</strong>：对每一对 <code>(i, j)</code>，如果「<strong
        >i 先到 k，再从 k 到 j</strong
      >」比「i 直接到 j」更短，就更新 <code>dist[i][j]</code>。三层循环
      <code>for k / for i / for j</code>，跑完就得到所有点对的最短距离。
    </p>
    <p>
      下面固定一张 4 个点的有向带权图。点<strong>「下一步」</strong>逐步看：每选定一个中转点
      <code>k</code>，它所在的<strong>行与列高亮</strong>；对每个候选单元
      <code>(i,j)</code
      >（<strong>琥珀环</strong>），比较它与「两个<strong>黄色源单元</strong>之和」<code>dist[i][k]+dist[k][j]</code>——更短就<strong>变绿更新</strong>。走到底，矩阵里就是任意两点的最短距离。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="floydModule" />

    <p>
      为什么三重循环、<code>k</code> 在最外层就对？这其实是<strong>动态规划</strong>：做完前
      <code>k</code> 个中转点，<code>dist[i][j]</code> 就是「只允许经过前
      <code>k</code> 个点中转」的最短路；加入第 <code>k</code> 个点后取
      <code>min</code>，逐步放开限制直到允许所有点。复杂度
      <code>O(V³)</code>——点少时简单又全面，还能处理负权边（无负环）。
    </p>

    <h2>Floyd vs 单源最短路</h2>
    <Callout>
      <b>Dijkstra / Bellman-Ford</b>：<strong>单源</strong>，一次一个起点；稀疏图上跑 V
      次也常更快。<br />
      <b>Floyd（本页）</b
      >：<strong>全源</strong>，一次算出所有点对；<code>O(V³)</code>、代码极短，<strong>稠密小图</strong>首选，是「矩阵
      DP」的经典范例。<br />
      Floyd 的距离矩阵思路，正是<b>动态规划</b>在网格上填表的缩影。
    </Callout>
    <p>
      想复习单源最短路，回看
      <strong>Dijkstra 最短路</strong>（正权贪心）与
      <strong>Bellman-Ford 最短路</strong>（负权松弛）——三页合起来就是最短路问题的完整版图。
    </p>
  </Article>
</template>
