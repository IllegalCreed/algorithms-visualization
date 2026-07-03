<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { knapsackModule } from '@/algorithms/knapsack.module';
</script>

<template>
  <Article>
    <h1>0-1 背包</h1>
    <p class="sub">动态规划 · 优化 / 取舍</p>

    <h2>装什么最值钱</h2>
    <p>
      有一个容量有限的背包和若干件物品，每件有<strong>重量</strong>和<strong>价值</strong>，每件<strong>要么整件装、要么不装</strong>（这就是「0-1」）。在不超重的前提下，怎么装总价值最大？这是最经典的<strong>动态规划</strong>入门题——和「编辑距离」一样填一张表，但填的是「<strong>最大价值</strong>」而非「最少代价」。
    </p>

    <h2>取，还是不取</h2>
    <p>
      设 <code>dp[i][w]</code> = 只考虑<strong>前 i 件物品</strong>、背包容量为
      <code>w</code> 时能装出的<strong>最大价值</strong>。<strong>边界</strong>：没有物品（第 0
      行）或容量为 0（第 0 列），价值都是 0。对第 <code>i</code> 件物品，只有两种选择：
    </p>
    <p>
      <strong>装不下</strong>（它的重量 &gt; 当前容量
      <code>w</code>）——只能<strong>不取</strong>，<code>dp[i][w]</code> 直接<strong
        >沿用上一行</strong
      >
      <code>dp[i-1][w]</code
      >；<strong>装得下</strong>——在<strong>不取</strong>（<code>dp[i-1][w]</code>）和<strong>取</strong>（<code
        >dp[i-1][w-重量] + 价值</code
      >，即腾出重量后的最优再加上本物品）之间<strong>取较大者</strong>。
    </p>
    <p>
      下面固定 4 件物品
      <strong>A(重2,值3) B(重3,值4) C(重4,值5) D(重5,值6)</strong>、容量
      <strong>5</strong
      >。点<strong>「下一步」</strong>逐格看：当前格<strong>琥珀环</strong>，它参考的<strong>「不取」上格</strong>和<strong>「取」的左上偏移格</strong>都<strong>黄色高亮</strong>——填入即<strong>变绿</strong>。走到底，右下角
      <strong>= 7</strong>（选 A+B：重 2+3=5、值 3+4=7）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="knapsackModule" />

    <p>
      每格只看<strong>上一行的两个格子</strong>就能定，共
      <code>O(物品数 × 容量)</code> 格，远快于枚举 <code>2ⁿ</code> 种取法。这正是动态规划：<strong
        >把「前 i 件、容量 w」的子问题解存进表，后面的直接查表复用</strong
      >。递推里的「取 / 不取」两个来源，就是把「选择」显式地摆在两个邻居格上。
    </p>

    <h2>0-1 背包在哪里用</h2>
    <Callout>
      <b>资源分配</b>：预算/时间有限，选收益最大的项目组合。<br />
      <b>装载 / 切割</b>：容器装货、原料下料求最优。<br />
      <b>DP 基石</b
      >：完全背包、多重背包、子集和都由它变体而来。它和编辑距离分别是<b>优化型</b>与<b>序列对齐型</b>二维
      DP 的代表。
    </Callout>
    <p>
      想看另一种「填表」DP（求最少代价而非最大价值），回看
      <strong>编辑距离</strong>——两页对照，能体会动态规划「定义状态 + 写对递推 +
      逐格填表」的通用套路。
    </p>
  </Article>
</template>
