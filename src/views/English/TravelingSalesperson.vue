<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishTspModule } from '@/i18n/en/modules/tsp';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="tsp"
    :module="englishTspModule"
    idea="State dp[mask][i] stores the shortest path that starts at city zero, visits exactly the mask, and ends at i. Remove i to enumerate the predecessor of the final edge."
    visualization="Rows decode visited-city bitmasks and columns choose the endpoint. Each filled cell highlights predecessor states, and the closing phase adds one edge back to the start."
    invariant="Every finite state visits each city in its mask exactly once and ends at the column city."
    applications="Held-Karp is practical only for small city counts, but its bitmask-state technique is central to subset scheduling, assignment, and visit-all-nodes problems."
  />
</template>
