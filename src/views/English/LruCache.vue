<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import LruViz from '@/components/structures/LruViz.vue';
</script>

<template>
  <Article>
    <h1>LRU Cache</h1>
    <p class="sub">Constant-time lookup with eviction by recent use</p>

    <h2>Combine two structures</h2>
    <p>
      A least recently used cache keeps a hash table from keys to nodes and a doubly linked list in
      recency order. The hash table finds a key in expected <code>O(1)</code>; the list removes or
      moves that known node in <code>O(1)</code>.
    </p>

    <Playground title="Try it">
      <LruViz locale="en" />
    </Playground>

    <p>
      Every successful get moves its node to the most-recent end. A put updates or inserts there.
      When capacity is full, the node at the least-recent end is removed from both the list and the
      hash table.
    </p>

    <Callout>
      <b>Invariant:</b> each cached key has exactly one list node, and list order always matches the
      order of most recent access.
    </Callout>

    <p>
      LRU is useful when recent access predicts future reuse, including page caches, database buffer
      pools, and bounded memoization. It can perform poorly for scans larger than the cache.
    </p>
  </Article>
</template>
