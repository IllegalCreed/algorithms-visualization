<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishKruskalModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Kruskal's Minimum Spanning Tree</h1>
    <p class="sub">A global greedy edge order guarded by disjoint sets</p>

    <h2>Connect every vertex at minimum total cost</h2>
    <p>
      A minimum spanning tree connects every vertex of a connected, undirected weighted graph with
      exactly <code>V - 1</code> edges, no cycle, and the smallest possible total weight. Kruskal's
      algorithm builds that tree from a forest of isolated vertices.
    </p>

    <h2>Accept the lightest safe edge</h2>
    <p>
      Sort all edges by weight. Consider them from lightest to heaviest and accept an edge only when
      its endpoints belong to different components. A disjoint-set structure answers that
      connectivity question and merges the two components after an accepted edge.
    </p>
    <p>
      In the player, amber marks the edge under consideration, green edges belong to the growing
      tree, and dashed edges were rejected because they would close a cycle. The variable panel
      keeps the selected edge count and total weight visible throughout the scan.
    </p>

    <AlgorithmPlayer :module="englishKruskalModule" locale="en" />

    <h2>Why the greedy choice is safe</h2>
    <p>
      The cut property says that a lightest edge crossing any cut is safe for some minimum spanning
      tree. Each accepted edge joins two current components, so it is a lightest crossing edge for
      that cut. Sorting costs <code>O(E log E)</code>; disjoint-set operations add almost constant
      amortized work per edge.
    </p>

    <Callout>
      <b>Invariant:</b> the accepted edges always form an acyclic forest that can be extended to a
      minimum spanning tree.
    </Callout>

    <p>
      Compare this global edge scan with
      <RouterLink :to="{ name: 'en-prim' }">Prim's vertex-driven growth</RouterLink> on the same
      weighted graph.
    </p>
  </Article>
</template>
