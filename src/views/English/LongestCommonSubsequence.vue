<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishLcsModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Longest Common Subsequence</h1>
    <p class="sub">Fill for the optimal length, then trace for an actual subsequence</p>

    <h2>Preserve order without requiring adjacency</h2>
    <p>
      A subsequence keeps the original character order but may skip characters. For prefixes of
      strings <code>X</code> and <code>Y</code>, let <code>dp[i][j]</code> be their longest common
      subsequence length. Empty prefixes form the zero row and column.
    </p>

    <h2>Match diagonally or discard one character</h2>
    <p>
      When <code>X[i - 1] === Y[j - 1]</code>, append that shared character to the best solution for
      the shorter prefixes, giving the top-left value plus 1. Otherwise one current character must
      be skipped, so keep the larger value from the up and left cells.
    </p>
    <p>
      After the table is full, the player traces backward from the bottom-right cell. A character
      match moves diagonally and records that character; a mismatch follows a neighboring cell that
      preserves the optimal length. The highlighted path reconstructs <code>ACD</code>.
    </p>

    <AlgorithmPlayer :module="englishLcsModule" locale="en" />

    <h2>Value first, witness second</h2>
    <p>
      The table takes <code>O(mn)</code> time and space. This two-phase pattern appears throughout
      dynamic programming: first compute the optimal value, then follow stored choices to recover a
      concrete solution.
    </p>

    <Callout>
      LCS underlies sequence comparison and diff tools. A common subsequence need not be contiguous,
      which distinguishes it from a common substring.
    </Callout>

    <p>
      Contrast this maximum-length recurrence with
      <RouterLink :to="{ name: 'en-edit-distance' }">Edit Distance</RouterLink>, or continue to a
      one-dimensional subsequence DP in
      <RouterLink :to="{ name: 'en-lis' }">Longest Increasing Subsequence</RouterLink>.
    </p>
  </Article>
</template>
