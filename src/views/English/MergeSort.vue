<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishMergeSortModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Merge Sort</h1>
    <p class="sub">Stable bottom-up sorting through ordered runs and an auxiliary array</p>

    <h2>Merge small sorted runs into larger ones</h2>
    <p>
      A one-element run is already sorted. Bottom-up Merge Sort first combines neighboring runs of
      width 1, then width 2, width 4, and so on. Each merge repeatedly takes the smaller front value
      from two sorted ranges.
    </p>

    <h2>Follow the main and auxiliary tracks</h2>
    <p>
      Red and blue pointers mark the front of the left and right runs. The lower track is the
      temporary array: values enter it in sorted order, then the completed range is copied back to
      the main array. Stable element IDs make that write-back visible without changing the
      algorithm's meaning.
    </p>

    <AlgorithmPlayer :module="englishMergeSortModule" locale="en" />

    <h2>Predictable performance</h2>
    <p>
      Every level processes all <code>n</code> values, and there are <code>log n</code> run widths,
      so time is <code>O(n log n)</code> in the best, average, and worst cases. This array version
      uses <code>O(n)</code> auxiliary space and remains stable by taking the left value first on a
      tie.
    </p>

    <Callout>
      <b>Merge invariant:</b> before writing position <code>k</code>, the filled temporary prefix is
      sorted and contains exactly the smallest values consumed from both runs.
    </Callout>

    <p>
      Compare the auxiliary-array tradeoff with in-place
      <RouterLink :to="{ name: 'en-heap-sort' }">Heap Sort</RouterLink>.
    </p>
  </Article>
</template>
