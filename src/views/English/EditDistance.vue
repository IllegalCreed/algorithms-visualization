<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishEditDistanceModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Edit Distance</h1>
    <p class="sub">Levenshtein distance through a two-dimensional DP table</p>

    <h2>Count the cheapest string transformation</h2>
    <p>
      Edit distance is the minimum number of single-character insertions, deletions, and
      substitutions needed to transform one string into another. Define <code>dp[i][j]</code> as the
      cost of transforming the first <code>i</code> source characters into the first
      <code>j</code> target characters.
    </p>

    <h2>Each cell represents three possible edits</h2>
    <p>
      The first row counts insertions from an empty source, and the first column counts deletions to
      an empty target. If the current characters match, copy the top-left cell. Otherwise take 1
      plus the minimum of top-left for substitution, up for deletion, and left for insertion.
    </p>
    <p>
      The player transforms <code>SAT</code> into <code>SUN</code>. The amber cell is being solved,
      yellow cells supply candidate costs, and the new value turns green. The bottom-right cell is
      the answer for both complete strings.
    </p>

    <AlgorithmPlayer :module="englishEditDistanceModule" locale="en" />

    <h2>Complexity and reconstruction</h2>
    <p>
      Filling an <code>(m + 1) x (n + 1)</code> table costs <code>O(mn)</code> time and
      <code>O(mn)</code> space. If only the distance is needed, two rows reduce auxiliary space to
      <code>O(n)</code>. Keeping the full table allows a backward trace of the actual edits.
    </p>

    <Callout>
      Applications include spell checking, fuzzy search, text comparison, and biological sequence
      alignment.
    </Callout>

    <p>
      Compare the three-neighbor minimum with the matching recurrence in
      <RouterLink :to="{ name: 'en-lcs' }">Longest Common Subsequence</RouterLink>.
    </p>
  </Article>
</template>
