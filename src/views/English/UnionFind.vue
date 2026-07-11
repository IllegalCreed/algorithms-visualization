<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import UnionFindViz from '@/components/structures/UnionFindViz.vue';
</script>

<template>
  <Article>
    <h1>Disjoint Set Union</h1>
    <p class="sub">Maintain dynamic connectivity with parent forests</p>

    <h2>Represent each component by a root</h2>
    <p>
      Disjoint set union (DSU), also called union-find, partitions elements into non-overlapping
      sets. <code>find(x)</code> follows parent links to a representative root, and
      <code>union(a, b)</code> connects two roots when their sets differ.
    </p>

    <Playground title="Try it">
      <UnionFindViz locale="en" />
    </Playground>

    <h2>Flatten paths as they are discovered</h2>
    <p>
      Path compression makes every node seen by <code>find</code> point directly toward the root.
      Union by rank or size attaches the smaller tree below the larger one. Together, these rules
      make a long sequence of operations take almost constant amortized time,
      <code>O(alpha(n))</code> per operation.
    </p>

    <Callout>
      <b>Invariant:</b> two elements are connected exactly when their finds return the same root.
    </Callout>

    <p>
      DSU is the cycle detector inside
      <RouterLink :to="{ name: 'en-kruskal' }">Kruskal's minimum spanning tree</RouterLink> and is
      widely used for offline connectivity problems.
    </p>
  </Article>
</template>
