<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import SegTreeViz from '@/components/structures/SegTreeViz.vue';
</script>

<template>
  <Article>
    <h1>Segment Tree</h1>
    <p class="sub">Hierarchical aggregates for dynamic range queries</p>

    <h2>Store an answer for every power-of-two segment</h2>
    <p>
      Each leaf represents one array element, and every internal node combines the answers of its
      two children. A query interval is decomposed into a small set of disjoint nodes whose segments
      fit completely inside it.
    </p>

    <Playground title="Try it">
      <SegTreeViz locale="en" />
    </Playground>

    <p>
      A point update changes one leaf and recomputes ancestors to the root. Both range query and
      point update touch <code>O(log n)</code> tree levels; the complete structure uses
      <code>O(n)</code> memory.
    </p>

    <Callout>
      <b>General form:</b> replace sum with any associative combine operation, such as minimum,
      maximum, greatest common divisor, or a custom record. Lazy propagation extends the structure
      to range updates.
    </Callout>

    <p>
      For prefix sums with smaller constants, compare the
      <RouterLink :to="{ name: 'en-fenwick' }">Fenwick Tree</RouterLink>.
    </p>
  </Article>
</template>
