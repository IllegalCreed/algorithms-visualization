<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishNumberOfIslandsModule } from '@/i18n/en/modules/number-of-islands';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="number-of-islands"
    :module="englishNumberOfIslandsModule"
    idea="Scan the grid. Every unseen land cell starts one new component search, and that flood fill marks all land reachable through four-directional neighbors."
    visualization="The scan cursor moves row by row. A newly discovered island changes the traversal color, and the active frontier spreads until water or visited cells block it."
    invariant="After a flood fill ends, every cell in that island is marked, so no later scan position can count it again."
    applications="Grid component labeling supports maps, image regions, board games, and cluster counting. Diagonal connectivity or weighted movement changes only the neighbor relation."
  />
</template>
