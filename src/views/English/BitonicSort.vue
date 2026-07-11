<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishBitonicSortModule } from '@/i18n/en/modules/bitonic-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="bitonic-sort"
    :module="englishBitonicSortModule"
    idea="A bitonic network first creates sequences that rise and then fall, then merges them with compare-exchange stages whose distances repeatedly halve. The comparator pattern depends only on positions, not values."
    visualization="Read the network from left to right. Comparators in one column are independent and can execute together; each highlighted pair is oriented toward the order required by its current bitonic block."
    invariant="After a merge stage of size k, every completed k-position block has the required monotone order."
    applications="Data-independent comparisons make Bitonic Sort useful on sorting networks, SIMD hardware, and GPUs. Padding or a specialized network is needed when the input length is not a power of two."
  />
</template>
