<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { ternaryModule } from '@/algorithms/ternary.module';
</script>

<template>
  <Article>
    <h1>三分查找（单峰极值）</h1>
    <p class="sub">查找 · 双探针对决 · 每轮丢掉 1/3</p>

    <h2>山顶在哪：二分为什么失灵</h2>
    <p>
      <strong>单峰数组</strong>先一路爬升、过峰后一路下降——像一座山。找峰顶时<router-link
        to="/docs/binary-search"
        >二分</router-link
      >却失灵了：只看一个
      <code>a[mid]</code>，你根本不知道自己站在<strong>上坡还是下坡</strong>，没法决定往哪走。
    </p>

    <h2>两个探针，制造方向感</h2>
    <p>
      <strong>三分查找</strong>在区间里放<strong>两个</strong>三分点探针
      <code>m1、m2</code>，让它们「对决」：若 <code>a[m1] &lt; a[m2]</code>，峰不可能在 m1
      左侧（那边只会更矮）——<strong>丢掉左侧 1/3</strong>；否则丢右侧 1/3。每轮区间变
      2/3，很快登顶。下面蓝/黄箭头就是两个探针（红/绿是区间端点），高亮的两根柱在对决，暗下去的是已排除区域——四轮登顶
      <strong>12</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="ternaryModule" />

    <h2>复杂度与同族变体</h2>
    <Callout>
      <b>正确性</b>：a[m1] &lt; a[m2] ⟹ 峰在 (m1, hi]（严格单峰下 m1 左侧必更矮）。<br />
      <b>复杂度</b>：每轮 ×2/3 → O(log₍₃⁄₂₎ n)，与二分同阶。<br />
      <b>坡度二分</b>：比较 <code>a[mid]</code> 与
      <code>a[mid+1]</code>——上坡去右、下坡去左，一个探针也能有方向感（log₂ n）。<br />
      <b>实数版</b>：凸/凹函数极值在实数域三分，固定轮数（如 100 轮）收敛到精度 ε。
    </Callout>
    <p>
      至此查找大类五页收齐：<router-link to="/docs/binary-search">找值</router-link> →
      <router-link to="/docs/binary-bounds">找边界</router-link> →
      <router-link to="/docs/rotated-search">断崖找值</router-link> →
      <router-link to="/docs/binary-answer">找答案</router-link> →
      找峰。所有套路共享一个灵魂：<strong>每一步用 O(1) 的信息，安全地扔掉一大块候选</strong>。
    </p>
  </Article>
</template>
