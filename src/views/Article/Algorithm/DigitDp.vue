<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { digitDpModule } from '@/algorithms/digitdp.module';
</script>

<template>
  <Article>
    <h1>数位 DP（按位走上界）</h1>
    <p class="sub">动态规划 · 自由分支与贴着走 · O(位数) 数天文数字</p>

    <h2>数不过来的时候</h2>
    <p>
      「[1, N] 里有多少个数不含数字 4？」N=245 还能逐个检查；N=10¹⁸ 呢？<strong>数位 DP</strong>
      不数「数」，改数「<strong>数位的走法</strong>」：把 N
      的十进制位从高到低排开（2、4、5），想象你在<strong>一位一位地写</strong>一个 ≤ N 的数。
    </p>

    <h2>每一位只有两条路</h2>
    <p>
      <strong>自由分支</strong
      >：本位写得比上界位<strong>小</strong>——从此后面每一位都<strong>随便写</strong>（只避开
      4，每位 9 种），一次性入账
      <code>可选数 × 9^剩余位</code>；<strong>贴着走</strong>：本位恰写上界位数字，继续被 N
      压着走。关键戏剧点：十位的上界位<strong>就是 4</strong>——想贴着走就必须写 4，被禁！<strong
        >tight 断裂</strong
      >，个位整位跳过。下表逐位记账，黄格是被加总的小计。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="digitDpModule" />

    <h2>通用模板</h2>
    <Callout>
      <b>记忆化搜索版</b>：<code>dp(pos, tight, state)</code>——pos 当前位、tight 是否贴上界、state
      按题意定制。<br />
      <b>state 举例</b>：前导零标记（数 0 的个数类）、上一位数字（windy 数）、模 k
      余数（整除类）。<br />
      <b>复杂度</b>：O(位数 × 状态数 × 10)——N=10¹⁸ 也只有 19 位。<br />
      <b>区间技巧</b>：[L, R] 的答案 = count(R) − count(L−1)。
    </Callout>
    <p>
      「不含 62」「至少一个 1」「二进制表示里 1 比 0
      多」……所有这类<strong>按数位施加约束的计数题</strong>，都是同一个走位骨架换 state。DP
      大类至此十页，五种状态设计全景：序列前缀、区间、集合、树、<strong>数位</strong>——状态定义的想象力，就是动态规划的全部秘密。
    </p>
  </Article>
</template>
