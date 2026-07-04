<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { rotSearchModule } from '@/algorithms/rotsearch.module';
</script>

<template>
  <Article>
    <h1>旋转数组搜索</h1>
    <p class="sub">查找 · 断崖上的二分 · 至少一半有序</p>

    <h2>被旋转的有序数组</h2>
    <p>
      <code>[1..17]</code> 从中间某处「旋转」一下变成
      <code>[13, 15, 17, 1, 3, 5, 7, 9, 11]</code
      >——柱形图里那道<strong>断崖</strong>一眼可见。整体没序了，
      <router-link to="/docs/binary-search">基础二分</router-link
      >的「和中点比大小」直接失灵：中点比目标大，目标却可能在右边。
    </p>

    <h2>关键引理：mid 切开的两半，至少一半完好有序</h2>
    <p>
      断崖只有一道，mid 落在它的某一侧——于是<strong>另一侧必然完好有序</strong>。判断很便宜：<code
        >a[lo] ≤ a[mid]</code
      >
      就是左半有序，否则右半有序。<strong>有序半的范围是明明白白的</strong>（首尾即最小最大），看目标在不在里面：在，就进有序半；不在，目标必在另一半。每步照样扔掉一半。下面两次查找：<code
        >target = 5</code
      >（先进右半再进左半）、<code>target = 15</code
      >（有序半不含目标、整半排除）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="rotSearchModule" />

    <h2>细节与边界</h2>
    <Callout>
      <b>判半</b>：a[lo] ≤ a[mid] ⟹ 左半 [lo, mid] 有序；否则右半 [mid, hi] 有序。<br />
      <b>范围判断</b>：左半有序时看 a[lo] ≤ t &lt; a[mid]；右半有序时看 a[mid] &lt; t ≤ a[hi]。<br />
      <b>复杂度</b>：每步一次判半 + 一次范围判断，仍是 O(log n)。<br />
      <b>坑</b>：含重复元素时 a[lo] == a[mid] 无法判半（只能 lo++），最坏退化 O(n)。
    </Callout>
    <p>
      同样的「断崖」思路还能找<strong>旋转点</strong>（最小值位置：与 a[hi]
      比较的二分）。至此二分已经在三种地形上跑过：全有序、带重复、被旋转——下一站彻底跳出数组，在<strong>答案空间</strong>上二分（二分答案），那是查找大类的收官技。
    </p>
  </Article>
</template>
