<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishMazeModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Maze Solving with DFS</h1>
    <p class="sub">Grid search with visited cells and path backtracking</p>

    <h2>Explore one route as deeply as possible</h2>
    <p>
      Depth-first search enters an open neighboring cell, marks it visited, and continues from
      there. Walls, boundaries, and visited cells are rejected. The visited set prevents cycles,
      while a separate path stack records the cells on the current candidate route.
    </p>

    <h2>Dead ends trigger an undo</h2>
    <p>
      If a cell has no unvisited open neighbor, remove it from the active path and return to the
      previous cell. That previous recursive call can then try another direction. Reaching the goal
      stops the search with the current path intact.
    </p>
    <p>
      The player uses a fixed 5 by 5 maze. Amber cells form the current DFS path, previously visited
      cells remain visible, dark cells are walls, and the successful start-to-goal route turns
      green.
    </p>

    <AlgorithmPlayer :module="englishMazeModule" locale="en" />

    <h2>One path, not necessarily the shortest</h2>
    <p>
      With a visited set, DFS processes each grid cell at most once, taking <code>O(RC)</code> time
      and space. It finds a path when one exists, but not necessarily the shortest path.
      Breadth-first search is the standard unweighted-grid choice when minimum step count matters.
    </p>

    <Callout>
      <b>Invariant:</b> the active path is always a simple route from the start to the current cell,
      and every removed cell remains visited so the search cannot loop.
    </Callout>

    <p>
      Compare grid backtracking with board constraints in
      <RouterLink :to="{ name: 'en-n-queens' }">N-Queens</RouterLink> and explicit choices in
      <RouterLink :to="{ name: 'en-subsets' }">Subsets</RouterLink>.
    </p>
  </Article>
</template>
