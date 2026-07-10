<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishDijkstraModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Dijkstra's Shortest Path</h1>
    <p class="sub">Single-source shortest paths on a non-negative weighted graph</p>

    <h2>From tentative to final distances</h2>
    <p>
      Dijkstra's algorithm stores the best distance currently known from one source to every vertex.
      The source starts at 0 and all other vertices start at infinity. Repeatedly choose the
      unsettled vertex with the smallest tentative distance, settle it, and relax each outgoing
      edge.
    </p>

    <h2>Watch relaxation change the graph</h2>
    <p>
      The amber ring marks the active vertex, green vertices are settled, and the small badge beside
      each vertex is its current distance. An edge relaxation asks whether reaching a neighbor
      through the active vertex is shorter than the route stored so far. The final green edges form
      a shortest-path tree rooted at A.
    </p>

    <AlgorithmPlayer :module="englishDijkstraModule" locale="en" />

    <h2>Why non-negative weights matter</h2>
    <p>
      Once the nearest unsettled vertex is chosen, non-negative edges guarantee that no later route
      can make it cheaper. Negative edges break that argument. With a binary heap, the usual running
      time is <code>O((V + E) log V)</code>.
    </p>

    <Callout>
      Typical uses include map routing, network path selection, and any state graph where each move
      has a non-negative cost. For negative weights, use a different shortest-path algorithm.
    </Callout>
  </Article>
</template>
