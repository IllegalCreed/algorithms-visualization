<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { treeDpModule } from '@/algorithms/treedp.module';
</script>

<template>
  <Article>
    <h1>树形 DP（打家劫舍 III）</h1>
    <p class="sub">动态规划 · 状态挂节点 · 后序即拓扑</p>

    <h2>小偷上树了</h2>
    <p>
      房子连成一棵二叉树，<strong>直接相连的父子不能同偷</strong>，求最大金额。本页的树（层序
      <code>[4, 1, 5, 3, 6]</code>）：
    </p>
    <pre>
      4          ← 根
     / \
    1   5
   / \
  3   6</pre
    >
    <p>
      线性打家劫舍在数组上「偷不偷第 i 家」；上了树，链变成了分叉——但 DP
      的骨架不变：<strong>每个节点两个状态</strong>。
    </p>

    <h2>两态与后序</h2>
    <p>
      <strong>选它</strong>：孩子都不能选 →
      <code>值 + Σ 孩子的「不选」</code>；<strong>不选它</strong>：孩子自由发挥 →
      <code>Σ max(孩子两态)</code
      >。算父亲前孩子必须先算完——<strong>后序遍历天然就是拓扑序</strong>。下表每行一个节点、两列两态：注意填表<strong>跳着走</strong>（LL
      → LR → L → R → 根），那正是后序的足迹；黄格是引用的孩子状态。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="treeDpModule" />

    <h2>树形 DP 三要素</h2>
    <Callout>
      <b>状态挂节点</b>：dp[u][...] 描述「以 u 为根的子树」的最优解。<br />
      <b>子树即子问题</b>：树的递归结构就是 DP 的无后效性来源。<br />
      <b>后序即拓扑</b>：孩子先于父亲就绪，一趟 DFS O(n) 填完。<br />
      <b>同款</b>：没有上司的舞会（带权独立集）、二叉树直径、树的重心。
    </Callout>
    <p>
      再往上走是<strong>树上背包</strong>（每棵子树当一组物品做分组背包）与<strong>换根 DP</strong
      >（第二趟 DFS 把「以每个点为根」的答案摊到 O(n)）。至此 DP
      大类九页、四种状态设计集齐：序列前缀（<router-link to="/docs/lis">LIS</router-link
      >）、区间（<router-link to="/docs/stone-merge">石子合并</router-link>）、集合（<router-link
        to="/docs/tsp"
        >TSP</router-link
      >）、树（本页）。
    </p>
  </Article>
</template>
