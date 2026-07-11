<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishShellSortModule } from '@/i18n/en/modules/shell-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="shell-sort"
    :module="englishShellSortModule"
    idea="Apply insertion sort to elements separated by a large gap, then shrink the gap. Early passes move badly misplaced values long distances before the final gap-one cleanup."
    visualization="Dimmed bars are outside the current gap group. Within the active group, the key, comparisons, shifts, and insertion follow ordinary Insertion Sort at gap-sized distances."
    invariant="After finishing gap g, every subsequence formed by equal indices modulo g is sorted."
    applications="Shell Sort is compact, in-place, and practical for moderate arrays when a library sort is unavailable. Its performance depends strongly on the gap sequence and it is not stable."
  />
</template>
