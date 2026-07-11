<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishMaxFlowModule } from '@/i18n/en/modules/max-flow';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="max-flow"
    :module="englishMaxFlowModule"
    idea="A residual network records how much more flow can move forward and how much previous flow can be canceled backward. Each augmenting path pushes its smallest residual capacity."
    visualization="Edge labels show flow over capacity. The active path is highlighted before its bottleneck is added, and reverse residual choices preserve the ability to reroute earlier decisions."
    invariant="Every intermediate flow respects edge capacities and conserves flow at all vertices except the source and sink."
    applications="Maximum flow solves transport capacity, bipartite matching, image segmentation, and many disjoint-path problems. The final unreachable boundary also identifies a minimum cut."
  />
</template>
