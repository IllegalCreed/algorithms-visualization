<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import HashProbeViz from '@/components/structures/HashProbeViz.vue';
import HashViz from '@/components/structures/HashViz.vue';
</script>

<template>
  <Article>
    <h1>Hash Table</h1>
    <p class="sub">Expected constant-time lookup by mapping keys to buckets</p>

    <h2>A hash narrows the search</h2>
    <p>
      A hash function converts a key into a table index. Good hashing spreads expected keys evenly,
      so lookup usually examines only a tiny part of the table. Distinct keys can still select the
      same index; this unavoidable event is a collision.
    </p>

    <h2>Separate chaining stores a list per bucket</h2>
    <p>
      Chaining keeps colliding entries together. Insertions are simple, deletion is direct once an
      entry is found, and the table can hold more entries than buckets. Long chains appear when the
      hash distribution or load factor is poor.
    </p>

    <Playground title="Try it">
      <HashViz locale="en" />
    </Playground>

    <h2>Open addressing searches the table itself</h2>
    <p>
      Linear probing advances through slots until it finds the key or an empty position. It avoids
      per-entry nodes and has strong cache locality, but dense tables create long clusters. Resizing
      and rehashing before the load factor becomes too high protects expected <code>O(1)</code>
      operations.
    </p>

    <Playground title="Try it">
      <HashProbeViz locale="en" />
    </Playground>

    <Callout>
      <b>Expected, not absolute:</b> lookup, insertion, and deletion are normally <code>O(1)</code>,
      but a pathological collision pattern can degrade them to <code>O(n)</code>.
    </Callout>
  </Article>
</template>
