<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishClosestPairModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Closest Pair of Points</h1>
    <p class="sub">Divide and conquer with a narrow cross-boundary strip</p>

    <h2>Improve on checking every pair</h2>
    <p>
      Comparing every pair of <code>n</code> planar points takes <code>O(n^2)</code> time. The
      divide-and-conquer algorithm first sorts points by x-coordinate, splits them at the median,
      and recursively finds the closest pair in each half.
    </p>

    <h2>The merge step must inspect the boundary</h2>
    <p>
      Let <code>delta</code> be the better distance from the two halves. A closer pair with one
      point on each side must lie inside a strip of width <code>2 * delta</code> around the midline.
      Sort those strip points by y-coordinate; each point only needs comparisons with the next few
      points whose y-gap is smaller than the current best distance.
    </p>
    <p>
      The player shows the midline, the active strip, each candidate segment, and the best pair. In
      this data set the final closest pair crosses the split, which demonstrates why the merge step
      cannot stop after solving the two halves.
    </p>

    <AlgorithmPlayer :module="englishClosestPairModule" locale="en" />

    <h2>Linear merge work per recursion level</h2>
    <p>
      A packing argument bounds the number of relevant y-neighbors by a constant. With points kept
      in y-order during merging, each recursion level costs <code>O(n)</code>, giving
      <code>T(n) = 2T(n/2) + O(n) = O(n log n)</code> time and <code>O(n)</code> auxiliary space.
    </p>

    <Callout>
      <b>Merge invariant:</b> before scanning the strip, the current best is already correct for all
      pairs that lie completely inside either half.
    </Callout>

    <p>
      Compare this distance-based divide and conquer with the orientation tests in
      <RouterLink :to="{ name: 'en-convex-hull' }">Convex Hull</RouterLink>, or revisit ordered
      merging in <RouterLink :to="{ name: 'en-merge-sort' }">Merge Sort</RouterLink>.
    </p>
  </Article>
</template>
