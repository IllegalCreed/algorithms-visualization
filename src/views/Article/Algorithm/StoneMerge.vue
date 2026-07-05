<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { stoneModule } from '@/algorithms/stones.module';
</script>

<template>
  <Article>
    <h1>石子合并（区间 DP）</h1>
    <p class="sub">动态规划 · 区间由短及长 · 枚举分割点</p>

    <h2>贪心为什么会错</h2>
    <p>
      4 堆石子 <code>[4, 1, 3, 2]</code> 排成一行，每次只能合并<strong>相邻</strong>两堆、代价 =
      两堆之和，求合成一堆的最小总代价。直觉贪心「每次挑最小的一对」：先合
      1+3？可它们的合并结果会<strong>反复参与后续合并</strong>——早合的堆被「搬运」次数更多，局部最小不等于全局最小。
    </p>

    <h2>把区间当阶段</h2>
    <p>
      设 <code>dp[i][j]</code> = 合并第 i..j 堆的最小代价。最后一次合并一定把区间劈成两半：<strong
        ><code>dp[i][j] = min<sub>k</sub>(dp[i][k] + dp[k+1][j]) + sum(i..j)</code></strong
      >——枚举<strong>分割点 k</strong
      >，再加上「最后把两半合起来」的代价（恰为区间和）。填表按<strong>区间长度由短及长</strong>：对角线
      0 → 相邻直合 →
      越来越长。下面的上三角表逐格点亮，黄格是当前格引用的<strong>最优拆分对</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="stoneModule" />

    <h2>区间 DP 范式</h2>
    <Callout>
      <b>三层循环</b>：len 由短及长 → 左端点 i → 分割点 k，O(n³)。<br />
      <b>为什么由短及长</b>：算 dp[i][j] 时它引用的都是更短区间——填表序保证「用到时已就绪」。<br />
      <b>环形变体</b>：石子围成圈 → 拆环成链（复制一倍），答案取 min。<br />
      <b>更快</b>：四边形不等式（决策单调性）可把 O(n³) 优化到 O(n²)。
    </Callout>
    <p>
      同一范式的题排成一串：矩阵链乘法（怎么加括号乘法次数最少）、最优二叉搜索树、能量项链、多边形三角剖分——凡是「最后一步把区间劈成两半」的问题，都是石子合并换皮。与<router-link
        to="/docs/lcs"
        >LCS</router-link
      >、<router-link to="/docs/edit-distance">编辑距离</router-link>同为二维表
      DP，只是填表方向从「左上往右下」换成了「短区间往长区间」。
    </p>
  </Article>
</template>
