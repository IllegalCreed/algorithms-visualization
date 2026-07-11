<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishEulerPathModule } from '@/i18n/en/modules/euler-path';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="euler-path"
    :module="englishEulerPathModule"
    idea="Hierholzer's algorithm walks unused edges until it reaches a dead end. Dead-end vertices are appended while the stack unwinds, automatically splicing every discovered cycle into one trail."
    visualization="Remaining-degree badges shrink as edges are consumed. The traversal stack records the live walk, and backtracking builds the answer in reverse order."
    invariant="Every consumed edge appears exactly once in the unfinished stack walk or the reversed output suffix."
    applications="Eulerian trails model route inspection, DNA assembly with de Bruijn graphs, and reconstruction from adjacent pairs. Hamiltonian paths instead require visiting vertices once and are much harder."
  />
</template>
