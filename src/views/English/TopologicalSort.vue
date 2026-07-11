<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishTopoModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Topological Sort</h1>
    <p class="sub">Kahn's algorithm for ordering dependencies in a DAG</p>

    <h2>Turn a partial order into a valid sequence</h2>
    <p>
      In a directed dependency graph, edge <code>u -> v</code> means that <code>u</code> must appear
      before <code>v</code>. A topological order satisfies every such edge. It exists only when the
      graph is acyclic.
    </p>

    <h2>Remove vertices with no remaining prerequisite</h2>
    <p>
      Kahn's algorithm counts every vertex's indegree. Any vertex with indegree 0 is ready to
      output. Removing it deletes its outgoing edges, which may reduce another vertex to indegree 0.
      The player shows indegrees as node badges, the active ready vertex in amber, and completed
      vertices in green.
    </p>

    <AlgorithmPlayer :module="englishTopoModule" locale="en" />

    <h2>Cycles and non-unique answers</h2>
    <p>
      Several vertices may be ready at once, so a DAG can have many valid orders. This demonstration
      chooses the lowest-index ready vertex for a deterministic trace. If vertices remain but none
      has indegree 0, those dependencies contain a directed cycle. Processing each vertex and edge
      once takes <code>O(V + E)</code> time.
    </p>

    <Callout>
      Typical uses include build scheduling, course prerequisites, spreadsheet recalculation, and
      detecting circular dependencies.
    </Callout>

    <p>
      Continue the graph path with
      <RouterLink :to="{ name: 'en-dijkstra' }">Dijkstra's shortest-path invariant</RouterLink>.
    </p>
  </Article>
</template>
