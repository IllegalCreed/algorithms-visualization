<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishAstarModule } from '@/i18n/en/modules/astar';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="astar"
    :module="englishAstarModule"
    idea="A* orders its priority queue by f equals g plus h: the exact cost already paid plus a heuristic estimate to the goal. Relaxation updates a neighbor when a cheaper g value appears."
    visualization="Open cells form the frontier, closed cells are settled, and the active cell has the smallest f score. Once the goal settles, predecessor arrows reveal the route."
    invariant="With a consistent heuristic, every closed state's g score is optimal and f scores do not decrease along an optimal path."
    applications="A* powers pathfinding and planning when a useful lower-bound heuristic exists. Setting h to zero gives Dijkstra; an overestimating heuristic may trade optimality for speed."
  />
</template>
