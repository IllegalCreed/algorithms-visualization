<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import GraphViz from '@/components/structures/GraphViz.vue';
</script>

<template>
  <Article>
    <h1>Graph</h1>
    <p class="sub">Vertices and edges for relationships that are not purely linear</p>

    <h2>Model connections explicitly</h2>
    <p>
      A graph contains vertices and edges. Edges may be directed or undirected, weighted or
      unweighted. An adjacency list stores only existing neighbors and uses
      <code>O(V + E)</code> space; an adjacency matrix uses <code>O(V^2)</code> space but answers
      edge-existence queries in constant time.
    </p>

    <h2>BFS and DFS differ only in the frontier</h2>
    <p>
      Breadth-first search uses a queue, so it expands one distance layer at a time and finds
      shortest paths in an unweighted graph. Depth-first search uses a stack, so it follows a branch
      until it must backtrack. Both mark vertices to avoid revisiting cycles.
    </p>

    <Playground title="Try it">
      <GraphViz locale="en" />
    </Playground>

    <Callout>
      <b>Traversal bound:</b> with adjacency lists, BFS and DFS each visit every reachable vertex
      and edge at most a constant number of times, for <code>O(V + E)</code> time.
    </Callout>

    <p>
      Continue with <RouterLink :to="{ name: 'en-dijkstra' }">Dijkstra's algorithm</RouterLink> for
      weighted shortest paths or
      <RouterLink :to="{ name: 'en-topological-sort' }">Topological Sort</RouterLink> for dependency
      order.
    </p>
  </Article>
</template>
