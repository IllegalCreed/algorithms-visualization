<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishHungarianModule } from '@/i18n/en/modules/hungarian';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="hungarian"
    :module="englishHungarianModule"
    idea="For each left vertex, search for an alternating path that ends at a free right vertex. Flipping unmatched and matched edges along that path increases the matching by one."
    visualization="A trial edge highlights the current request. When a right vertex is occupied, recursion follows its partner to find another option; a successful chain flips as one augmentation."
    invariant="The green edges always form a valid matching: no vertex is incident to more than one selected edge."
    applications="Maximum bipartite matching models worker-job assignment, course selection, and pairing. Weighted assignment and very large sparse graphs use more specialized algorithms."
  />
</template>
