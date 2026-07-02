<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { dijkstraModule } from '@/algorithms/dijkstra.module';
</script>

<template>
  <Article>
    <h1>Dijkstra 最短路</h1>
    <p class="sub">图算法 · 单源最短路径</p>

    <h2>什么是最短路</h2>
    <p>
      带权图里，从一个起点到各个点的「最短总距离」是多少、怎么走？逐条路径去试不现实。<strong
        >Dijkstra</strong
      >
      给了高效解法——前提是<strong>边权非负</strong>。
    </p>

    <h2>Dijkstra 怎么做</h2>
    <p>
      维护一张「源到各点的当前最短距离」表（源点为 0，其余为
      ∞）。然后反复做两步：①<strong>取出还没定下来、当前距离最小的点</strong>，把它「定下来」；②用它去<strong>松弛</strong>（relax）邻边——如果「经它中转」到某个邻居更短，就更新那个邻居的距离。每个点被定下来时，它的距离就是最终最短距离。
    </p>
    <p>
      下面固定一张 6 个点的带权有向图（源
      A）。点<strong>「下一步」</strong>逐步看它怎么取当前最近点（<strong>琥珀高亮</strong>）、确定它（<strong>变绿</strong>）、松弛邻边（<strong>黄边</strong>+
      节点旁距离徽标更新）——特别留意 B、D、E、F
      的距离会被<strong>更短的路径反复降低</strong>（先到的不一定最短）；走到底会点亮整棵<strong>最短路树</strong>（绿边）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="dijkstraModule" />

    <p>
      为什么「贪心地取当前最近点」是对的？因为边权非负，一个已经定下来的点，它的距离不可能再被后面更小——后面的路只会更长。用二叉堆做优先队列，复杂度约
      <code>O((V + E) log V)</code>。注意它<strong>不能处理负权边</strong>（那要用 Bellman-Ford）。
    </p>

    <h2>Dijkstra 在哪里用</h2>
    <Callout>
      <b>地图 / 导航</b>：求两地最短路线。<br />
      <b>网络路由</b>：如 OSPF 协议按链路开销选路。<br />
      <b>任何「非负权图上的单源最短路」</b>。
    </Callout>
    <p>
      它是<strong>图算法</strong>这条线的开篇——后面还有
      Bellman-Ford（带负权）、Floyd（多源最短路）、最小生成树、拓扑排序等。想先复习图本身怎么存、怎么遍历，可回看
      <strong>数据结构 · 图</strong>。
    </p>
  </Article>
</template>
