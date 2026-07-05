<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { rerootModule } from '@/algorithms/reroot.module';
</script>

<template>
  <Article>
    <h1>换根 DP（树中距离之和）</h1>
    <p class="sub">动态规划 · 二次扫描 · 每个点都当一次根</p>

    <h2>每个点都要答案</h2>
    <p>
      求树上<strong>每个节点</strong>到其余所有点的距离之和。<router-link to="/docs/tree-dp"
        >树形 DP</router-link
      >
      固定一个根算一次没问题，可这里 n 个点都要——逐点重跑就是
      <code>O(n²)</code>。本页的树：
    </p>
    <pre>
      0          ← 先当根
     / \
    1   2
   / \
  3   4</pre
    >

    <h2>换根：账本不用重记，挪一格改两笔</h2>
    <p>
      <strong>第一趟（后序）</strong>：老老实实算出每个点的 <code>size</code>（子树大小）和
      <code>down</code>（到子树内所有点的距离和），顺手得到根的答案
      <code>ans[0] = down[0]</code>。<strong>第二趟（前序）</strong>：根从 u 挪到相邻的 v——v 子树里
      <code>size[v]</code> 个点<strong>近了 1 步</strong>、其余 <code>n − size[v]</code> 个点<strong
        >远了 1 步</strong
      >：<strong><code>ans[v] = ans[u] − size[v] + (n − size[v])</code></strong
      >。一步 O(1)，全树 O(n)。下表三列逐格点亮，黄格是每一步引用的账本。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="rerootModule" />

    <h2>换根三件套</h2>
    <Callout>
      <b>①第一趟后序</b>：把「子树内」的信息算干净（size / down / 子树最远……）。<br />
      <b>②可增量修正</b>：答案对「根挪一步」能 O(1) 修正——距离和的近远账、最值的换根合并。<br />
      <b>③第二趟前序</b>：沿树把修正传下去，每点各得其所。<br />
      <b>坑</b>：第二趟必须用<strong>父亲已换根后</strong>的答案推孩子（前序），别用第一趟的旧值。
    </Callout>
    <p>
      同款还有：树的中心（最远距离最小的点）、每点的最远节点（向上/向下两条最长路合并）、834
      距离之和原题。至此 DP
      大类十一页<strong>真收官</strong>：序列、区间、集合、树、数位五种状态设计，外加「一趟不够就两趟」的换根——动态规划的常用武器全部上墙。
    </p>
  </Article>
</template>
