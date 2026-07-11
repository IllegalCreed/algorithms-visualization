<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishBubbleSortModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Bubble Sort</h1>
    <p class="sub">Adjacent swaps that grow a sorted suffix one pass at a time</p>

    <h2>Move the largest remaining value right</h2>
    <p>
      Bubble Sort scans adjacent pairs from left to right. Whenever the left value is larger, the
      pair swaps. After one complete pass, the largest value in the unsorted prefix has moved to the
      end, where it will never move again.
    </p>

    <h2>Read the two pointers</h2>
    <p>
      The arrows mark the current adjacent pair. A comparison highlights both bars, a swap changes
      their stable positions, and the green suffix records values already fixed. Watch how one large
      value can move several places during a single pass.
    </p>

    <AlgorithmPlayer :module="englishBubbleSortModule" locale="en" />

    <h2>Cost and limits</h2>
    <p>
      This direct version performs <code>O(n^2)</code> comparisons and uses <code>O(1)</code>
      auxiliary space. It is stable because equal values are never swapped. An early-exit flag can
      make an optimized version linear on already sorted input, but it remains a poor choice for
      large arrays.
    </p>

    <Callout>
      <b>Invariant:</b> after pass <code>p</code>, the last <code>p</code> positions contain the
      correct largest values in sorted order.
    </Callout>

    <p>
      Continue with <RouterLink :to="{ name: 'en-merge-sort' }">Merge Sort</RouterLink> to replace
      repeated adjacent work with structured merging, or compare all sorting costs in the
      <RouterLink :to="{ name: 'en-complexity' }">complexity reference</RouterLink>.
    </p>
  </Article>
</template>
