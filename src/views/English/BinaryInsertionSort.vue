<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishBinaryInsertionSortModule } from '@/i18n/en/modules/binary-insertion-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="binary-insertion-sort"
    :module="englishBinaryInsertionSortModule"
    idea="Binary search locates the stable insertion boundary inside the sorted prefix. The array then shifts the suffix of that prefix and places the key at the boundary."
    visualization="First watch the half-open search interval shrink around the insertion point. The second phase highlights every value moved right before the key enters the gap."
    invariant="The binary-search boundary is the first prefix position greater than the key, so inserting there preserves both order and stability."
    applications="This variant helps when comparisons are costly, but it cannot avoid the quadratic number of array moves. Linked storage changes the move cost but loses direct midpoint access."
  />
</template>
