<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishQuickSortModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Quick Sort</h1>
    <p class="sub">Divide and conquer sorting with visible partition boundaries</p>

    <h2>Put one pivot in its final place</h2>
    <p>
      Quick Sort chooses a <strong>pivot</strong>, partitions the current range so smaller values
      are on its left and larger values are on its right, then repeats the same job on both sides.
      Once partitioning finishes, that pivot is already in its final sorted position.
    </p>

    <h2>What the visualization shows</h2>
    <p>
      This page uses Lomuto partitioning with the last value as the pivot. The side panel is an
      explicit interval stack that replaces recursion. Watch the scan pointer move, the less-than
      region grow, and each pivot become fixed. Change the input to test favorable, reversed, or
      duplicate-heavy data.
    </p>

    <AlgorithmPlayer :module="englishQuickSortModule" locale="en" />

    <h2>Complexity and tradeoffs</h2>
    <p>
      Average time is <code>O(n log n)</code>, auxiliary stack space is typically
      <code>O(log n)</code>, and partitioning is in-place. Quick Sort is not stable. Consistently
      bad pivots can produce <code>O(n^2)</code> time, so practical implementations randomize or
      improve pivot selection.
    </p>

    <Callout>
      <b>Invariant:</b> before each scan step, values before <code>i</code> are smaller than the
      pivot, while values from <code>i</code> through the previous scan position are at least the
      pivot. Keeping that statement true explains why the final pivot swap is correct.
    </Callout>

    <p>
      Compare its growth rate in the
      <RouterLink :to="{ name: 'en-complexity' }">complexity reference</RouterLink>, or continue
      with <RouterLink :to="{ name: 'en-binary-search' }">Binary Search</RouterLink> to see another
      logarithmic divide-and-conquer pattern.
    </p>
  </Article>
</template>
