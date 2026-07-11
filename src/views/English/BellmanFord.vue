<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishBellmanFordModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Bellman-Ford Shortest Paths</h1>
    <p class="sub">Single-source shortest paths with negative edge weights</p>

    <h2>Relax edges instead of finalizing vertices</h2>
    <p>
      A negative edge can improve a route after another vertex already looked settled, so the greedy
      guarantee used by Dijkstra no longer applies. Bellman-Ford repeatedly scans every directed
      edge and relaxes <code>u -> v</code> whenever <code>dist[u] + w &lt; dist[v]</code>.
    </p>

    <h2>Why V - 1 rounds are enough</h2>
    <p>
      A simple shortest path visits at most <code>V - 1</code> edges. After round <code>k</code>,
      all shortest paths using at most <code>k</code> edges can be represented by the distance
      labels. The player highlights each scanned edge and updates the destination badge only when a
      shorter candidate is found.
    </p>

    <AlgorithmPlayer :module="englishBellmanFordModule" locale="en" />

    <h2>Cost and negative-cycle detection</h2>
    <p>
      Scanning every edge for <code>V - 1</code> rounds costs <code>O(VE)</code> time and
      <code>O(V)</code> distance storage. Run one additional round to detect a reachable negative
      cycle: if any distance still improves, no finite shortest path exists for vertices reachable
      from that cycle.
    </p>

    <Callout>
      Use Bellman-Ford when negative weights are possible or negative-cycle detection matters. On a
      graph with non-negative weights,
      <RouterLink :to="{ name: 'en-dijkstra' }">Dijkstra's algorithm</RouterLink> is usually faster.
    </Callout>
  </Article>
</template>
