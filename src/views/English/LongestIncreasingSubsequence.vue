<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishLisModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Longest Increasing Subsequence</h1>
    <p class="sub">One-dimensional DP with predecessor reconstruction</p>

    <h2>End each subproblem at a specific index</h2>
    <p>
      Let <code>dp[i]</code> be the length of the longest strictly increasing subsequence that ends
      at index <code>i</code>. Every value can stand alone, so all entries start at 1. To solve
      <code>dp[i]</code>, inspect every earlier index <code>j</code>.
    </p>

    <h2>Extend only from a smaller value</h2>
    <p>
      If <code>a[j] &lt; a[i]</code>, an increasing subsequence ending at <code>j</code> can accept
      <code>a[i]</code>. Update <code>dp[i]</code> with <code>dp[j] + 1</code> when it is larger,
      and remember <code>j</code> as the predecessor. The largest DP entry gives the global length.
    </p>
    <p>
      The two-row matrix shows input values above their DP lengths. Yellow cells identify the value
      and predecessor under comparison, green marks an improvement, and the final highlighted value
      path follows predecessors back to one optimal sequence.
    </p>

    <AlgorithmPlayer :module="englishLisModule" locale="en" />

    <h2>The transparent quadratic solution</h2>
    <p>
      Comparing each pair with <code>j &lt; i</code> takes <code>O(n^2)</code> time and
      <code>O(n)</code> space. A patience-sorting method with binary search reaches
      <code>O(n log n)</code>, but this DP makes the ending-index state and reconstruction invariant
      explicit.
    </p>

    <Callout>
      <b>Invariant:</b> after index <code>i</code> is processed, <code>dp[i]</code> is optimal among
      all increasing subsequences whose final value is <code>a[i]</code>.
    </Callout>

    <p>
      Compare one-sequence predecessor links with the two-string trace in
      <RouterLink :to="{ name: 'en-lcs' }">Longest Common Subsequence</RouterLink>.
    </p>
  </Article>
</template>
