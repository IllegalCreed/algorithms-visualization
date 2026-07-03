<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { lcsModule } from '@/algorithms/lcs.module';
</script>

<template>
  <Article>
    <h1>最长公共子序列</h1>
    <p class="sub">动态规划 · 填表 + 回溯恢复解</p>

    <h2>两个串的最长公共子序列</h2>
    <p>
      给两个串
      <code>X = ABCD</code> 和
      <code>Y = ACDF</code
      >，找它们最长的<strong>公共子序列</strong>（LCS）。<strong>子序列</strong>是从原串里<strong>按顺序挑出若干字符</strong>（不要求连续，区别于<strong>子串</strong>）。这里的答案是
      <code>ACD</code>（长度 3）。LCS 是 <code>diff</code>、<code>git</code> 比对、DNA
      序列比对的核心，也是<strong>动态规划</strong>的又一经典。
    </p>

    <h2>二维 DP：逐格填表</h2>
    <p>
      设
      <code>dp[i][j]</code> 为 X 前 <code>i</code> 个字符与 Y 前 <code>j</code> 个字符的 LCS
      长度。空串没有公共子序列，所以<strong>第 0 行、第 0 列都是 0</strong>。填每一格时看
      <code>X[i-1]</code> 和 <code>Y[j-1]</code>：
    </p>
    <p>
      <strong>相同</strong>——这个公共字符能接在「各退一格」的 LCS 后面，所以取<strong
        >左上 + 1</strong
      >（<code>dp[i-1][j-1] + 1</code>）；<strong>不同</strong>——当前这对字符至少有一个用不上，丢掉
      X 或 Y 的当前字符取较优的，即<strong>取上、左两格的较大值</strong>（<code
        >max(dp[i-1][j], dp[i][j-1])</code
      >）。填到<strong>右下角</strong>就是 LCS 的<strong>长度</strong>。
    </p>

    <h2>回溯：从表里恢复出 LCS</h2>
    <p>
      但表格只给出<strong>长度</strong>，LCS<strong>字符串本身</strong>要<strong>回溯</strong>出来：从<strong>右下角</strong>出发倒着走——当前格字符<strong>相同</strong>，说明它是
      LCS 的一员，<strong>记下这个字符、往左上对角走</strong>；<strong>不同</strong>，就往<strong
        >上、左中 dp 较大的那格</strong
      >走（当初的值就是从那来的）。一路收集到的字符<strong>倒序拼起来</strong>就是 LCS。
    </p>
    <p>
      下面是
      <code>X=ABCD</code>、<code>Y=ACDF</code> 的 DP
      表。点<strong>「下一步」</strong>逐步看：先<strong>逐格填表</strong>（相同取左上
      +1、不同取上/左较大，源格<strong>黄色</strong>、新填<strong>绿色</strong>）；填满后从右下角<strong>回溯</strong>，路径格<strong>绿环</strong>连成一条，匹配处收字符，最终恢复出
      <code>ACD</code>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="lcsModule" />

    <h2>填表求值，回溯求解</h2>
    <Callout>
      很多 DP
      都是两步：<b>填表</b>求出最优<b>值</b>，再<b>回溯</b>沿「当初的选择」倒推出最优<b>解</b>。<br />
      <router-link to="/docs/edit-distance">编辑距离</router-link>
      同样可回溯出<b>具体的增删改操作序列</b>；<router-link to="/docs/knapsack"
        >0-1 背包</router-link
      >
      可回溯出<b>到底选了哪些物品</b>。本页把「回溯恢复解」讲到最直观。
    </Callout>
    <p>
      LCS 与<router-link to="/docs/edit-distance">编辑距离</router-link>是一对近亲：同为两串上的二维
      DP，只是递推规则不同（LCS 相同取左上 +1，编辑距离相同取左上、不同取三邻最小
      +1）。填表是同一套范式，回溯恢复解则让「表」变回「答案」。
    </p>
  </Article>
</template>
