<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishSelectionSortModule } from '@/i18n/en/modules/selection-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="selection-sort"
    :module="englishSelectionSortModule"
    idea="For each output position, scan the entire remaining suffix and remember its minimum. One final swap places that minimum and grows the sorted prefix by exactly one."
    visualization="The scan pointer visits every candidate while a separate marker follows the best minimum seen so far. Only the pass-ending swap changes the array."
    invariant="Before pass i, positions before i contain the globally smallest i values in final order."
    applications="Selection Sort is useful when writes are much more expensive than comparisons because it performs only a linear number of swaps. It is otherwise mostly a compact teaching algorithm."
  />
</template>
