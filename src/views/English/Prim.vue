<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishPrimModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Prim's Minimum Spanning Tree</h1>
    <p class="sub">Grow one connected tree through the lightest crossing edge</p>

    <h2>Start small and keep the tree connected</h2>
    <p>
      Prim's algorithm starts from one vertex. At every step it considers edges with exactly one
      endpoint inside the current tree, chooses the lightest such edge, and brings the outside
      endpoint into the tree. After <code>V - 1</code> choices, every vertex is connected.
    </p>

    <h2>Read the expanding cut</h2>
    <p>
      Green vertices and edges are already inside the tree. The amber edge is the lightest edge
      crossing from that set to an outside vertex. Advancing one step adds both the edge and the new
      vertex, so the selected structure remains connected at all times.
    </p>

    <AlgorithmPlayer :module="englishPrimModule" locale="en" />

    <h2>Correctness and implementation choices</h2>
    <p>
      The cut property makes each lightest crossing edge safe. A binary heap implementation runs in
      <code>O(E log V)</code> on adjacency lists, while a simple dense-graph implementation can run
      in <code>O(V^2)</code>. The visualization scans a compact fixed edge set so every choice stays
      visible.
    </p>

    <Callout>
      <b>Invariant:</b> selected edges form one connected tree, and every selected edge is safe for
      a minimum spanning tree.
    </Callout>

    <p>
      See the same objective approached from a forest in
      <RouterLink :to="{ name: 'en-kruskal' }">Kruskal's algorithm</RouterLink>.
    </p>
  </Article>
</template>
