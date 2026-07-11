<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishCountingSortModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Counting Sort</h1>
    <p class="sub">Sorting compact integer ranges by counting instead of comparing</p>

    <h2>Replace comparisons with frequencies</h2>
    <p>
      When values are integers from a manageable range, use one bucket per value. The first pass
      counts every occurrence. The second pass walks buckets from smallest to largest and writes
      each value back as many times as it was counted.
    </p>

    <h2>Watch counts enter and leave buckets</h2>
    <p>
      The main array stays unchanged during counting while the bucket track grows. During
      write-back, the green pointer advances through the array and each active bucket decreases to
      zero. No pair of input elements is ever compared.
    </p>

    <AlgorithmPlayer :module="englishCountingSortModule" locale="en" />

    <h2>Range size is the real constraint</h2>
    <p>
      For <code>n</code> values spanning <code>k</code> distinct integer positions, time is
      <code>O(n + k)</code> and bucket space is <code>O(k)</code>. The method is excellent when
      <code>k</code> is close to <code>n</code>, but wasteful for a huge sparse range. This direct
      write-back version does not preserve record order; a prefix-count output array can make it
      stable.
    </p>

    <Callout>
      Counting Sort is a domain-specific optimization. Validate the value range before allocating
      buckets, especially when input is user-controlled.
    </Callout>

    <p>
      Return to the <RouterLink :to="{ name: 'en-paths' }">learning paths</RouterLink> to compare
      comparison and non-comparison sorting.
    </p>
  </Article>
</template>
