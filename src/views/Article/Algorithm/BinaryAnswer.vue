<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { banswerModule } from '@/algorithms/banswer.module';
</script>

<template>
  <Article>
    <h1>二分答案</h1>
    <p class="sub">查找 · 答案空间上的二分 · 最小可行解</p>

    <h2>数组没了，也能二分</h2>
    <p>
      经典题：4 堆香蕉 <code>[3, 6, 7, 11]</code>，警卫 <code>8</code>
      小时后回来，珂珂每小时只能吃一堆里的 k 根——<strong>最小</strong>时速 k
      是多少？没有现成的数组可查，但把<strong>候选答案排成一排</strong>（速度
      1..11），奇妙的事发生了：速度越快越可能吃完，<strong>可行性关于答案单调</strong>——
      <code>✗ ✗ ✗ ✓ ✓ ✓ …</code>。「找第一个 ✓」，这不就是<router-link to="/docs/binary-bounds"
        >二分边界</router-link
      >里的 lower_bound 吗？
    </p>

    <h2>柱子这回是答案本身</h2>
    <p>
      下面的柱子<strong>不是被查数组，而是 11 个候选速度</strong>。每一步试探 mid：现场算
      <code>Σ ⌈pile / k⌉</code> 与 8 比——可行就「答案还能更小」收 hi，不可行就「只能加速」抬
      lo；相遇点即<strong>最小可行速度 4</strong>（恰好 8 小时，慢一档就 10
      小时超时）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="banswerModule" />

    <h2>什么时候能「二分答案」</h2>
    <Callout>
      <b>三要素</b>：①答案空间有界（如 [1,
      max]）；②可行性关于答案<strong>单调</strong>；③单点可行性<strong>可验</strong>（一个 O(n) 的
      check）。<br />
      <b>复杂度</b>：O(check × log(答案空间))——把「求最优」降成「验可行」。<br />
      <b>找最大可行</b>：谓词方向反过来（✓✓✓✗✗），找最后一个 ✓ = upper 侧模板。<br />
      <b>实数版</b>：答案是实数时二分固定次数（如 100 轮）或到精度 ε。
    </Callout>
    <p>
      「最小化最大值 / 最大化最小值」一族几乎全是它：分割数组的最大段和最小化、D
      天内送达的最低运载能力、切木材求最长段、会议室最少数量……凡是<strong>答案越大越可行（或越不可行）</strong>的题，先想二分答案。至此查找大类四页收官：<router-link
        to="/docs/binary-search"
        >找值</router-link
      >
      → <router-link to="/docs/binary-bounds">找边界</router-link> →
      <router-link to="/docs/rotated-search">断崖找值</router-link> → 找答案——二分的四重境界。
    </p>
  </Article>
</template>
