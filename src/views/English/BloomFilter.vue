<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import BloomViz from '@/components/structures/BloomViz.vue';
</script>

<template>
  <Article>
    <h1>Bloom Filter</h1>
    <p class="sub">Space-efficient membership tests with controlled false positives</p>

    <h2>Hash each item into several bits</h2>
    <p>
      Adding an item sets <code>k</code> positions in a bit array. A query checks the same
      positions. If any bit is zero, the item is definitely absent. If every bit is one, the item
      may be present because other inserted items could have set the same positions.
    </p>

    <Playground title="Try it">
      <BloomViz locale="en" />
    </Playground>

    <p>
      Standard Bloom filters never produce false negatives, but they can produce false positives.
      The probability depends on the bit-array size, number of hash functions, and number of
      inserted items. They also do not support ordinary deletion because one bit may belong to many
      items.
    </p>

    <Callout>
      <b>Use a Bloom filter to avoid expensive negative lookups:</b> cache penetration checks,
      storage-engine filters, web-crawl deduplication, and distributed data placement.
    </Callout>
  </Article>
</template>
