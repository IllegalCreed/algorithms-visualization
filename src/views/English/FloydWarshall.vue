<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishFloydWarshallModule } from '@/i18n/en/modules/floyd-warshall';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="floyd-warshall"
    :module="englishFloydWarshallModule"
    idea="Dynamic programming expands the set of allowed intermediate vertices. For each pivot k, every ordered pair i and j asks whether traveling through k beats its current best distance."
    visualization="The highlighted pivot row and column provide the two candidate legs. The active matrix cell either accepts their sum or keeps its previous distance."
    invariant="After pivot k, every matrix entry is the shortest path whose intermediate vertices come only from the processed pivot set."
    applications="Floyd-Warshall is concise for dense graphs, transitive closure, and moderate all-pairs queries. Sparse large graphs usually favor repeated single-source algorithms."
  />
</template>
