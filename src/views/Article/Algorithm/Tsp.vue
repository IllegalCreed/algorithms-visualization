<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { tspModule } from '@/algorithms/tsp.module';
</script>

<template>
  <Article>
    <h1>旅行商 TSP（状压 DP）</h1>
    <p class="sub">动态规划 · 集合当下标 · Held-Karp</p>

    <h2>n! 条路线，怎么剪</h2>
    <p>
      推销员要走遍 n 座城市各一次、回到起点，求最短回路——<strong>旅行商问题</strong>。暴力枚举全排列
      <code>O(n!)</code>：20 城就是 2.4×10¹⁸
      条路线。可仔细想：走到半路时，决定未来的只有两件事——<strong>去过哪些城</strong>（不在乎顺序！）和<strong>现在人在哪</strong>。不同顺序、同一批城、同一个落脚点的路线，只需要留最短的那条。
    </p>

    <h2>把集合压进一个整数</h2>
    <p>
      「去过哪些城」是个集合——用<strong>二进制 mask</strong> 压缩：第 i 位为 1 表示城 i 已访问。状态
      <code>dp[mask][i]</code> = 已访问 mask、现在在城 i 的最短路程，转移时枚举<strong
        >上一站 j</strong
      >：<code>dp[mask][i] = min (dp[mask∖{i}][j] + d[j][i])</code>。下表 8 行就是含起点的全部
      mask（二进制行标），逐格点亮、黄格 = 胜出的前置状态；填到全集行后，补上回起点的边取
      min。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="tspModule" />

    <h2>状压 DP 的边界与家族</h2>
    <Callout>
      <b>复杂度</b>：状态 2ⁿ·n 个、每个转移 O(n) → O(2ⁿ·n²)——从 n! 到指数，是巨大的降维。<br />
      <b>实用上限</b>：n ≈ 20（约 4 亿次运算）；再大交给近似/启发式（最近邻、2-opt、LKH）。<br />
      <b>填表序</b>：mask 从小到大天然满足拓扑序——子集永远先于超集就绪。<br />
      <b>家族</b>：子集枚举 DP（3ⁿ）、轮廓线 DP（棋盘覆盖）、集合划分——「集合当下标」一脉相承。
    </Callout>
    <p>
      至此 DP 大类八页集齐三种状态设计：<strong>序列前缀</strong>（<router-link to="/docs/lis"
        >LIS</router-link
      >/<router-link to="/docs/lcs">LCS</router-link>）、<strong>区间</strong>（<router-link
        to="/docs/stone-merge"
        >石子合并</router-link
      >）、<strong>集合</strong>（本页）——动态规划的想象力，全在「状态怎么定义」这一步。
    </p>
  </Article>
</template>
