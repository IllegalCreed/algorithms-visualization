<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import SkipListViz from '@/components/structures/SkipListViz.vue';
</script>

<template>
  <Article>
    <h1>Skip List</h1>
    <p class="sub">Randomized express lanes over an ordered linked list</p>

    <h2>Move right, then descend</h2>
    <p>
      The bottom level contains every value in sorted order. Each higher level promotes a random
      subset, creating increasingly sparse express lanes. Search moves right while the next value is
      still below the target, then descends one level.
    </p>

    <Playground title="Try it">
      <SkipListViz locale="en" />
    </Playground>

    <p>
      With independent promotion probability, the expected height and expected search, insertion,
      and deletion time are <code>O(log n)</code>. The worst case is <code>O(n)</code>, but it is
      unlikely with a good random source.
    </p>

    <Callout>
      <b>Why use one:</b> skip lists offer ordered iteration and logarithmic expected updates
      without tree rotations. Their pointer-heavy layout trades away some cache locality.
    </Callout>
  </Article>
</template>
