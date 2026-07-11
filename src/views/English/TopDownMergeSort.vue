<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishTopDownMergeSortModule } from '@/i18n/en/modules/top-down-merge-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="top-down-merge-sort"
    :module="englishTopDownMergeSortModule"
    idea="Recursively split an interval until each leaf contains one value. On the return path, merge two sorted halves into an auxiliary buffer and copy the result back."
    visualization="The interval stack shows the active recursive frame. During a merge, two read pointers choose the next value, an auxiliary pointer fills the buffer, and write-back restores the source interval."
    invariant="Every recursive call returns with its interval sorted and containing exactly the values it received."
    applications="Top-down Merge Sort gives stable, predictable performance and adapts naturally to linked lists and external sorting. Arrays pay for an auxiliary buffer and recursive frames."
  />
</template>
