<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { primModule } from '@/algorithms/prim.module';
</script>

<template>
  <Article>
    <h1>Prim 最小生成树</h1>
    <p class="sub">图算法 · 最小生成树（MST）</p>

    <h2>什么是最小生成树</h2>
    <p>
      在一张<strong>无向带权连通图</strong>里，选若干条边把所有点连起来、<strong>不成环</strong>、<strong>总权重最小</strong>——就是<strong>最小生成树（MST）</strong>。<strong
        >Prim</strong
      >
      和 <strong>Kruskal</strong> 是求它的两大经典算法，思路不同、结果一致。
    </p>

    <h2>Prim 怎么做</h2>
    <p>
      Prim
      从<strong>一个起点</strong>开始，把它当作一棵只有一个点的树，然后<strong>让树一点点长大</strong>：每一步，在所有<strong>「一端在树里、一端在树外」的横切边</strong>里挑<strong>权重最小</strong>的那条，把它和它连接的树外点<strong>并入树</strong>。重复
      <code>V−1</code> 次，就把所有点接进来了。
    </p>
    <p>
      下面固定一张 6 个点的无向带权图，从
      <strong>A</strong>
      起。点<strong>「下一步」</strong>逐步看：当前选中的最小横切边<strong>黄色高亮</strong>，加入后<strong>变绿</strong>、新点也<strong>并进绿色的树</strong>。走到底得到
      5 条边、总权重最小的生成树。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="primModule" />

    <p>
      为什么每步「贪心取最小横切边」是对的？由<strong>切分定理</strong>保证：把已在树里的点和其余点看成一种分割，横跨它的最小边一定属于某棵最小生成树。用堆维护候选横切边，复杂度约
      <code>O(E log V)</code>——在<strong>稠密图</strong>上通常比 Kruskal 更省。
    </p>

    <h2>Prim vs Kruskal：同一问题，两种思路</h2>
    <Callout>
      <b>Prim（本页）</b
      >：从一个点<strong>生长</strong>，每步选「树↔树外」的最小横切边——始终维护<strong>一棵连通的树</strong>。稠密图更优。<br />
      <b>Kruskal</b
      >：把边<strong>按权全局排序</strong>，从小到大逐条尝试，用<strong>并查集判环</strong>——过程中是<strong>一片森林</strong>，最后才连成一棵。稀疏图更优。<br />
      两者在同一张图上得到<strong>相同的 MST</strong>（本页与 Kruskal
      页正是同一张图，可对照：边集一样、加入顺序不同）。
    </Callout>
    <p>
      想看按权选边 + 并查集判环的另一种建法，去看
      <strong>Kruskal 最小生成树</strong>；判环背后的并查集，可回看
      <strong>数据结构 · 并查集</strong>。
    </p>
  </Article>
</template>
