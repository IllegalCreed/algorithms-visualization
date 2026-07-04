<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { coinChangeModule } from '@/algorithms/coinchange.module';
</script>

<template>
  <Article>
    <h1>硬币找零方案数</h1>
    <p class="sub">动态规划 · 计数</p>

    <h2>不求最优，只数方案</h2>
    <p>
      前几页 DP 求的都是「最优值」——<router-link to="/docs/edit-distance">最少代价</router-link
      >、<router-link to="/docs/knapsack">最大价值</router-link>。还有一大类 DP
      求的是<strong>方案数</strong>：给若干面额的硬币、每种<strong>无限枚</strong>，问凑出目标金额有<strong>多少种</strong>不同组合。这就是<strong
        >计数 DP</strong
      >。
    </p>

    <h2>把「取 max」换成「相加」</h2>
    <p>
      设 <code>dp[i][a]</code> = 只用<strong>前 i 种硬币</strong>凑出金额
      <code>a</code> 的<strong>方案数</strong>。它和
      <router-link to="/docs/complete-knapsack">完全背包</router-link
      >长得几乎一样——同样是「无限次取」的二维表，「用一枚」的来源也在<strong>本行</strong>
      <code>dp[i][a-面额]</code>。差别只在<strong>算子</strong>：
    </p>
    <p>
      完全背包在「不取」和「取」之间取
      <strong>max</strong>；硬币找零则把两条路的方案数<strong>相加</strong>——<code
        >dp[i][a] = dp[i-1][a]</code
      >（<strong>不用</strong>这种硬币的方案数）<code> + dp[i][a-面额]</code
      >（<strong>至少用一枚</strong>这种硬币的方案数）。边界也不同：<code>dp[0][0] = 1</code>——凑出
      <strong>0 元有 1 种方案</strong>（什么都不选），这个「1」是所有方案数的种子。
    </p>
    <p>
      下面固定硬币 <strong>[1, 2, 5]</strong>、金额
      <strong>5</strong
      >。点<strong>「下一步」</strong>逐格看：当前格<strong>琥珀环</strong>，「不用」的上一行格和「用一枚」的<strong>本行左侧格</strong>都<strong>黄色高亮</strong>，两个方案数<strong>相加</strong>填入即<strong>变绿</strong>。走到底，右下角
      <strong>= 4</strong
      >（四种凑法：<code>1×5</code>、<code>1×3+2</code>、<code>1+2×2</code>、<code>5</code>）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="coinChangeModule" />

    <h2>计数 DP 在哪里用</h2>
    <Callout>
      <b>组合计数</b>：找零方案、爬楼梯方法数、路径条数、可达状态数。<br />
      <b>概率 / 期望</b>：把「方案数」换成「概率累加」，同一套递推。<br />
      <b>对照最优 DP</b>：把递推里的
      <b>max/min 换成加法、边界 1 而非 0</b>——同一张表，问的问题不同。
    </Callout>
    <p>
      建议和
      <router-link to="/docs/complete-knapsack">完全背包</router-link
      >对照着看：同样一张「无限次取」的二维表、同样的本行来源，只把「取
      max」改成「方案数相加」，求的就从<strong>最大价值</strong>变成了<strong>组合总数</strong>。
    </p>
  </Article>
</template>
