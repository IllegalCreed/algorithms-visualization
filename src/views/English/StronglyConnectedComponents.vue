<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishSccModule } from '@/i18n/en/modules/scc';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="scc"
    :module="englishSccModule"
    idea="Tarjan's DFS gives each vertex a discovery index and the earliest stacked vertex reachable from its subtree. When those two values match, the vertex is the root of one complete component."
    visualization="Badges show discovery and low-link values, a ring marks vertices still on the Tarjan stack, and each pop assigns one permanent component color."
    invariant="A stacked vertex belongs to an unfinished DFS component, and its low-link is the earliest discovery reachable without leaving the stack."
    applications="SCC condensation turns any directed graph into a DAG. It supports cycle grouping, dependency analysis, reachability preprocessing, and the satisfiability test used by 2-SAT."
  />
</template>
