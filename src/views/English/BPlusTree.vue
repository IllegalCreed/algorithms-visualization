<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import BTreeViz from '@/components/structures/BTreeViz.vue';
</script>

<template>
  <Article>
    <h1>B+ Tree</h1>
    <p class="sub">A shallow multiway index with linked data leaves</p>

    <h2>Use wide nodes to reduce height</h2>
    <p>
      A B+ tree stores many separator keys per internal node, so one read chooses among many child
      ranges. All records live in leaves at the same depth. High branching factors keep disk and
      database indexes shallow, minimizing expensive page reads.
    </p>

    <Playground title="Try it">
      <BTreeViz locale="en" />
    </Playground>

    <h2>Leaves make range scans sequential</h2>
    <p>
      Exact search descends by separators in <code>O(log_B n)</code> node visits. Leaves are linked
      from left to right, so a range query locates its first key and then scans adjacent leaves
      without returning to upper levels.
    </p>

    <Callout>
      <b>Invariant:</b> internal separators route every key to the correct child range, all leaves
      have the same depth, and leaf links preserve sorted order.
    </Callout>

    <p>
      Splits, merges, and redistribution maintain occupancy as records change. Those updates are why
      B+ trees remain balanced without periodic rebuilding.
    </p>
  </Article>
</template>
