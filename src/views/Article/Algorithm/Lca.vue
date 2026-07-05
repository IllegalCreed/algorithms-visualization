<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { lcaModule } from '@/algorithms/lca.module';
</script>

<template>
  <Article>
    <h1>LCA 倍增（最近公共祖先）</h1>
    <p class="sub">图算法 · 倍增跳表 · 家谱的交汇处</p>

    <h2>家谱往上翻，翻到第一个共同祖先</h2>
    <p>
      树上两点的<strong>最近公共祖先</strong>（Lowest Common
      Ancestor）：同时是两点祖先、且深度最大的那个点——树上距离、路径查询全靠它。朴素做法让两点逐步爬父链，一次查询
      <code>O(n)</code>；查询一多就顶不住。本页的树：
    </p>
    <pre>
        0
       / \
      1   2
     / \    \
    3   4    5
    |
    6
    |
    7</pre
    >

    <h2>倍增：跳 1 步、2 步、4 步的跳表</h2>
    <p>
      预处理 <code>up[k][u]</code> = u 往上跳
      <code>2^k</code> 步的祖先，「<strong>爸爸的爸爸</strong>」递推：<code
        >up[k][u] = up[k−1][up[k−1][u]]</code
      >（跳 2^k = 先跳 2^(k−1) 再跳
      2^(k−1)）。查询三段式：①深的先<strong>对齐</strong>——深度差按二进制拆成若干次跳；②相同即答案；③否则从高位<strong>试跳</strong>——<strong>祖先不同才跳</strong>（相同就跳可能越过
      LCA），最后两点停在 LCA 的两个孩子上，父亲即答案。下表 8 行 × 4
      列就是跳表，黄格是每一步引用的格子；右侧代码随步同步高亮。
    </p>

    <AlgorithmPlayer :module="lcaModule" />

    <h2>为什么「祖先相同不能跳」</h2>
    <Callout>
      <b>①对齐</b>：深度差 d 按二进制拆解，第 k 位是 1 就沿 <code>up^k</code> 跳一次——O(log n)
      步对齐。<br />
      <b>②试跳只认「不同」</b>：<code>up[k][u] = up[k][v]</code> 说明跳完已在公共祖先上——
      但可能不是<strong>最近</strong>的那个，跳了就回不了头；不同则说明还没到交汇处，放心双跳。<br />
      <b>③收官</b>：从高到低试完，两点恰好停在 LCA 的两个孩子上——<code>up⁰</code> 一步即答案。
    </Callout>
    <p>
      建表 <code>O(n log n)</code>、每次查询
      <code>O(log n)</code>。最常用的衍生是<strong>树上距离</strong>：<code
        >dist(u, v) = depth[u] + depth[v] − 2·depth[LCA]</code
      >；离线批量查询可用 Tarjan 离线（<router-link to="/docs/union-find">并查集</router-link
      >），链上重载场景还有树链剖分。与
      <router-link to="/docs/reroot-dp">换根 DP</router-link>、<router-link to="/docs/tree-dp"
        >树形 DP</router-link
      >
      一起，构成树上问题的三板斧。
    </p>
  </Article>
</template>
