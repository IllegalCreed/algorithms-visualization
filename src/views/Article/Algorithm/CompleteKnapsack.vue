<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { completeKnapsackModule } from '@/algorithms/completeknapsack.module';
</script>

<template>
  <Article>
    <h1>完全背包</h1>
    <p class="sub">动态规划 · 无限次取</p>

    <h2>同一件，可以拿很多个</h2>
    <p>
      <strong>完全背包</strong>和
      <router-link to="/docs/knapsack">0-1 背包</router-link>只差一个字：0-1
      背包每件物品<strong>要么装一次、要么不装</strong>；完全背包里每件物品有<strong>无限多个</strong>，同一件<strong>可以反复装</strong>（只要不超重）。物品仍各有<strong>重量</strong>和<strong>价值</strong>，问在容量内怎么装总价值最大。
    </p>

    <h2>唯一的差别：「取」看哪一行</h2>
    <p>
      状态定义和 0-1 完全一样：<code>dp[i][w]</code> = 考虑<strong>前 i 种物品</strong>、容量
      <code>w</code> 时的<strong>最大价值</strong>。<strong>装不下</strong>时也一样——沿用上一行
      <code>dp[i-1][w]</code>。差别只在<strong>装得下</strong>那一步的「取」：
    </p>
    <p>
      0-1 背包「取」是
      <code>dp[<strong>i-1</strong>][w-重量] + 价值</code
      >——用的是<strong>上一行</strong>，意味着「取了这件就换下一件」；完全背包「取」是
      <code>dp[<strong>i</strong>][w-重量] + 价值</code
      >——用的是<strong>本行</strong>，意味着「取了这件<strong>还能再取同一件</strong>」。代码上就是把一个下标
      <code>i-1</code> 改成
      <code>i</code
      >，可视化上「取」的来源格从<strong>左上方</strong>挪到了<strong>同一行的左侧</strong>。
    </p>
    <p>
      下面固定 3 种物品 <strong>A(重2,值5) B(重3,值6) C(重4,值7)</strong>、容量
      <strong>6</strong
      >。点<strong>「下一步」</strong>逐格看：当前格<strong>琥珀环</strong>，「不取」的上一行格和「取」的<strong>本行左侧格</strong>都<strong>黄色高亮</strong>——填入即<strong>变绿</strong>。留意<strong
        >第 1 行（只有 A）</strong
      >：容量 6 的格子一路 <code>0→5→10→15</code>，靠的全是本行左侧格，正是<strong
        >把 A 装了 3 个</strong
      >。走到底右下角 <strong>= 15</strong>（A×3：重 2×3=6、值 5×3=15）；同样这批物品若按 0-1 只能拿
      <strong>12</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="completeKnapsackModule" />

    <p>
      正因为「取」可以停在<strong>本行</strong>，一次从左往右扫容量的过程中，同一件物品就被反复利用了——这就是完全背包<strong>允许重复</strong>的本质。其余套路和
      0-1 完全相同：<code>O(物品数 × 容量)</code> 逐格填表、后面的直接查表复用。
    </p>

    <h2>完全背包在哪里用</h2>
    <Callout>
      <b>硬币找零 / 凑数</b>：每种面额硬币不限个数，凑出目标金额的最少枚数或方案数。<br />
      <b>无限资源下料</b>：同规格材料无限供应，求最优切割 / 装载。<br />
      <b>DP 变体家族</b
      >：把「取」的来源在<b>上一行</b>（0-1）与<b>本行</b>（完全）之间切换，是理解背包问题族的关键；再加上「次数有限」就成了多重背包。
    </Callout>
    <p>
      建议和
      <router-link to="/docs/knapsack">0-1 背包</router-link
      >两页对照着看——同一张表、同一套递推，只有「取」看上一行还是本行之差，却决定了每件物品能拿几个。
    </p>
  </Article>
</template>
