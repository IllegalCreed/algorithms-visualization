<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishStoneMergeModule } from '@/i18n/en/modules/stone-merge';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="stone-merge"
    :module="englishStoneMergeModule"
    idea="The final operation on interval i through j must merge two adjacent already-complete subintervals. Try every split point and add the fixed total weight of the interval."
    visualization="The upper-triangular table fills by increasing interval length. Each highlighted cell compares split candidates from two smaller cells plus a prefix-sum interval cost."
    invariant="Before intervals of length L are processed, every shorter interval already stores its minimum merge cost."
    applications="Interval DP appears in matrix-chain multiplication, polygon triangulation, optimal parsing, and burst-style games. Faster optimizations require additional structure in the split costs."
  />
</template>
