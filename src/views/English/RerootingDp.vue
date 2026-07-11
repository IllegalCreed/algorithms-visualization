<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishRerootDpModule } from '@/i18n/en/modules/reroot-dp';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="reroot-dp"
    :module="englishRerootDpModule"
    idea="A postorder pass solves each subtree for one arbitrary root. A preorder pass then moves the root across every edge using a constant-time relation between parent and child answers."
    visualization="The first columns accumulate subtree sizes and downward distances. The answer column begins at the original root and spreads outward with the reroot formula."
    invariant="When processing edge parent to child, the parent's whole-tree answer and the child's subtree summary are already complete."
    applications="Rerooting computes all-root distance sums, eccentricity-style values, and tree contributions in linear time instead of repeating a traversal from every node."
  />
</template>
