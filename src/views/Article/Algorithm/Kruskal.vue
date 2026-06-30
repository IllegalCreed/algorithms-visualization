<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import KruskalViz from '@/components/structures/KruskalViz.vue';
</script>

<template>
  <Article>
    <h1>Kruskal 最小生成树</h1>
    <p class="sub">图算法 · 最小生成树（MST）</p>

    <h2>什么是最小生成树</h2>
    <p>
      在一张<strong>无向带权连通图</strong>里，选出若干条边把所有点连起来、<strong>不成环</strong>、且<strong>总权重最小</strong>——这就是<strong>最小生成树（MST）</strong>。比如要给几个村庄铺电缆，怎么连最省料？
    </p>

    <h2>Kruskal 怎么做</h2>
    <p>
      把所有边<strong>按权重从小到大排序</strong>，依次考虑每条边：用<strong>并查集</strong>判断这条边的两端是否<strong>已经连通</strong>——<strong>没连通就加入</strong>生成树（并把两端合并到一组），<strong>已连通就跳过</strong>（再加它会成环）。选够
      <code>V−1</code> 条边就完成。
    </p>
    <p>
      下面固定一张 6
      个点的无向带权图。点<strong>「下一步」</strong>按权重从小到大逐条考虑——看哪些边加入（绿）、哪些因<strong>成环被跳过</strong>（红），最后得到总权重最小的生成树。
    </p>

    <Playground>
      <KruskalViz />
    </Playground>

    <p>
      为什么「每次贪心取不成环的最小边」是对的？由<strong>切分定理</strong>保证：横跨任意一种分割的最小边，一定属于某棵最小生成树。判环用<strong>并查集</strong>，几乎是常数时间；整体复杂度由排序主导，约
      <code>O(E log E)</code>。判环正是并查集的经典应用。
    </p>

    <h2>Kruskal 在哪里用</h2>
    <Callout>
      <b>最省布线</b>：电网 / 网络 / 道路连通所有节点、总成本最低。<br />
      <b>聚类</b>：建 MST 后切掉最大的几条边，自然分成簇。<br />
      <b>近似算法基础</b>（如旅行商问题的近似）。另一种 MST 算法是 <b>Prim</b>（从点集生长）。
    </Callout>
    <p>
      它把<strong>「贪心 + 并查集」</strong>用得很漂亮——想复习并查集怎么合并、找根，可回看
      <strong>数据结构 · 并查集</strong>。
    </p>
  </Article>
</template>
