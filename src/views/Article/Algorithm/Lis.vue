<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { lisModule } from '@/algorithms/lis.module';
</script>

<template>
  <Article>
    <h1>最长递增子序列</h1>
    <p class="sub">动态规划 · 一维 DP</p>

    <h2>最长的一段「越来越大」</h2>
    <p>
      给一串数
      <code>[1, 3, 2, 4, 3, 5]</code
      >，找一个最长的<strong>子序列</strong>（按顺序挑，不要求连续），让它<strong>严格递增</strong>。这里的答案是
      <code>1 → 3 → 4 → 5</code>（长度 4）。这仍是<strong>动态规划</strong>，但和前几页不同——它的 DP
      表是<strong>一维</strong>的。
    </p>

    <h2>一维 DP：dp[i] 只回看前面</h2>
    <p>
      设
      <code>dp[i]</code> 为<strong>以第 <code>i</code> 个数结尾</strong
      >的最长递增子序列长度。每个数单独成序列，所以 <code>dp</code> 全部从
      <strong>1</strong>
      起。填 <code>dp[i]</code> 时，<strong>回看前面每一个 <code>j &lt; i</code></strong
      >：只要 <code>a[j] &lt; a[i]</code>（能接在 <code>a[j]</code> 后面继续变大），就用
      <code>dp[j] + 1</code> 更新 <code>dp[i]</code>，取所有这样的
      <code>j</code>
      里最大的。前几页 DP 依赖「上/左/左上」的相邻格，这里
      <code>dp[i]</code> 依赖<strong>前面所有 <code>dp[j]</code></strong
      >——这就是一维 DP 的味道。
    </p>
    <p>
      全部填完后，<strong>最大的 <code>dp[i]</code></strong> 就是 LIS
      的长度。想恢复出<strong>具体是哪几个数</strong>，和 LCS
      一样从最大值处<strong>回溯</strong>：记住每个 <code>dp[i]</code> 是从哪个
      <code>j</code> 接过来的（前驱），沿前驱倒着串起来即可。
    </p>
    <p>
      下面是
      <code>[1, 3, 2, 4, 3, 5]</code> 的 DP 两行表（上行是<strong>值</strong>、下行是
      <code>dp</code>）。点<strong>「下一步」</strong>逐步看：<strong>当前 <code>i</code></strong
      >（琥珀）逐个回看每个 <strong><code>j</code></strong
      >（黄色），能变长就把 <code>dp[i]</code> 增大（<strong>绿色</strong>）；填完后从最大
      <code>dp</code> 回溯，构成 LIS 的元素<strong>绿环</strong>标出。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="lisModule" />

    <h2>一维 vs 二维</h2>
    <Callout>
      DP 的「表」有不同形状：<br />
      <b>二维表</b>：<router-link to="/docs/edit-distance">编辑距离</router-link> /
      <router-link to="/docs/knapsack">0-1 背包</router-link> /
      <router-link to="/docs/lcs">最长公共子序列</router-link
      >——两个维度（两串、或物品×容量）。<br />
      <b>一维数组</b>：最长递增子序列（本页）——<code>dp[i]</code> 沿一条线回看前面。
    </Callout>
    <p>
      本页的
      <code>O(n²)</code>
      解法最直观（每个 <code>i</code> 回看所有 <code>j</code>）；LIS 还有更快的
      <code>O(n log n)</code>
      解法（维护一个「各长度下最小结尾」的数组 + 二分），但一维 DP
      已足够把「回看前面、取最优、再回溯恢复」讲清楚。它与<router-link to="/docs/lcs"
        >LCS</router-link
      >同属「子序列」家族，一个在两串间、一个在一串内。
    </p>
  </Article>
</template>
