<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishKmpModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>KMP String Matching</h1>
    <p class="sub">Linear matching by reusing a pattern's prefix structure</p>

    <h2>Do not throw away a successful prefix</h2>
    <p>
      A naive matcher restarts the pattern after every mismatch, repeatedly scanning the same text.
      KMP preprocesses the pattern into an LPS table. <code>lps[k]</code> is the length of the
      longest proper prefix of <code>P[0..k]</code> that is also a suffix.
    </p>

    <h2>Jump the pattern, not the text</h2>
    <p>
      Pointer <code>i</code> scans the text and <code>j</code> scans the pattern. Equal characters
      move both pointers. On a mismatch with <code>j &gt; 0</code>, set
      <code>j = lps[j-1]</code> and keep <code>i</code> fixed. The pattern slides to the longest
      prefix that can still match what has already been seen.
    </p>

    <AlgorithmPlayer :module="englishKmpModule" locale="en" />

    <h2>Why it is linear</h2>
    <p>
      The text pointer never moves backward, and LPS jumps strictly reduce the pattern pointer when
      they do not advance the text. Pattern preprocessing costs <code>O(m)</code> and matching costs
      <code>O(n)</code>, for <code>O(n + m)</code> total time and <code>O(m)</code> extra space.
    </p>

    <Callout>
      KMP is useful anywhere exact substring search must be predictable: editors, command-line text
      tools, protocol parsers, and biological sequence matching. Its central lesson is broader:
      preprocess structure once so mismatches can skip work later.
    </Callout>
  </Article>
</template>
