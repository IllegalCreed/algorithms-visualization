<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishBsearchModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Binary Search</h1>
    <p class="sub">Searching a sorted array by discarding half at every probe</p>

    <h2>The optimal guessing strategy</h2>
    <p>
      In a sorted array, comparing the target with the middle value tells us which half cannot
      contain the answer. Binary Search keeps a closed candidate range <code>[lo, hi]</code>, probes
      <code>mid</code>, and removes one impossible half while preserving the other.
    </p>

    <h2>Two complete outcomes</h2>
    <p>
      The player first finds <code>17</code>, then searches for the absent value <code>4</code>.
      Bright bars remain candidates; dimmed bars have already been ruled out. The second run ends
      with <code>lo &gt; hi</code>, which is a proof that no candidate remains, not a signal to scan
      again.
    </p>

    <AlgorithmPlayer :module="englishBsearchModule" locale="en" />

    <h2>Invariant and cost</h2>
    <Callout>
      <b>Precondition:</b> the array is sorted.<br />
      <b>Invariant:</b> if the target exists, it remains inside <code>[lo, hi]</code>.<br />
      <b>Safe midpoint:</b> use <code>lo + ((hi - lo) &gt;&gt; 1)</code> when integer overflow
      matters.<br />
      <b>Cost:</b> the range halves each time, so lookup takes <code>O(log n)</code> comparisons.
    </Callout>

    <p>
      The same invariant-driven template powers lower bounds, upper bounds, rotated-array search,
      and binary search over an answer space. The important skill is defining exactly what the
      candidate interval means before writing the loop.
    </p>
  </Article>
</template>
