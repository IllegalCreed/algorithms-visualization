<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishInsertionSortModule } from '@/i18n/en/modules/insertion-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="insertion-sort"
    :module="englishInsertionSortModule"
    idea="Treat the left prefix as sorted. Remove the next key, shift every larger prefix value one step right, and insert the key into the resulting gap."
    visualization="The key marker stays attached to the value being inserted. Comparisons move left through the prefix, and each shift visibly opens the gap that eventually receives the key."
    invariant="At the start and end of every outer iteration, the processed prefix is sorted and contains exactly its original values."
    applications="Insertion Sort is a strong base case for hybrid sorts and performs well on small or nearly sorted arrays. Stable insertion also makes it useful inside more specialized algorithms."
  />
</template>
