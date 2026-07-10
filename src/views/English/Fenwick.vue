<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishFenwickModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Fenwick Tree</h1>
    <p class="sub">Binary Indexed Tree for logarithmic updates and prefix queries</p>

    <h2>Balance updates with queries</h2>
    <p>
      A plain array updates quickly but needs a linear prefix scan. A prefix-sum array answers
      quickly but needs a linear rebuild after an update. A Fenwick Tree makes both operations
      <code>O(log n)</code> by storing carefully chosen partial sums.
    </p>

    <h2>Lowbit defines every covered range</h2>
    <p>
      <code>lowbit(i) = i &amp; -i</code> isolates the least significant set bit. Entry
      <code>tree[i]</code> stores a range of that length ending at <code>i</code>. A prefix query
      jumps backward with <code>i -= lowbit(i)</code>; a point update jumps forward with
      <code>i += lowbit(i)</code> to notify every range that contains the changed position.
    </p>

    <AlgorithmPlayer :module="englishFenwickModule" locale="en" />

    <h2>When to use it</h2>
    <Callout>
      Fenwick Trees are excellent for cumulative frequencies, inversion counting, dynamic ranks, and
      range sums via <code>query(r) - query(l-1)</code>. A segment tree supports more general range
      operations, but a Fenwick Tree is smaller and often much simpler.
    </Callout>

    <p>
      The visualization queries the prefix ending at 6, adds 2 at position 3, then repeats the same
      query. Compare the two identical lowbit chains to see exactly where the update becomes
      visible.
    </p>
  </Article>
</template>
