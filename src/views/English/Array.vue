<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import ArrayGrowViz from '@/components/structures/ArrayGrowViz.vue';
import ArrayViz from '@/components/structures/ArrayViz.vue';
</script>

<template>
  <Article>
    <h1>Array</h1>
    <p class="sub">Contiguous storage with constant-time indexed access</p>

    <h2>Positions are addresses</h2>
    <p>
      An array stores same-shaped elements next to one another. Because every element has the same
      size, index <code>i</code> can be converted directly into an address. Reading or replacing an
      element therefore takes <code>O(1)</code> time, no matter how long the array is.
    </p>
    <p>
      Contiguity makes insertion and deletion more expensive. Inserting in the middle shifts the
      suffix one position right; deleting shifts it left to close the gap. Select an index below,
      then compare access, insertion, deletion, and appending.
    </p>

    <Playground title="Try it">
      <ArrayViz locale="en" />
    </Playground>

    <h2>Dynamic arrays trade rare copies for fast appends</h2>
    <p>
      Languages usually expose a resizable array. When its backing storage is full, it allocates a
      larger block, copies the existing values, and appends into the new space. One growth costs
      <code>O(n)</code>, but doubling capacity makes growth progressively rarer.
    </p>

    <Playground title="Try it">
      <ArrayGrowViz locale="en" />
    </Playground>

    <p>
      Across a long sequence of appends, each old value is copied only a small number of times.
      Charging those occasional copies to all successful appends gives an amortized cost of
      <code>O(1)</code> per append.
    </p>

    <Callout>
      <b>Use an array when:</b> indexed reads, compact storage, and cache-friendly traversal matter
      more than frequent insertion or deletion in the middle.
    </Callout>

    <p>
      Next, compare this contiguous layout with a
      <RouterLink :to="{ name: 'en-link' }">linked list</RouterLink>, where nodes can move
      independently but indexed access is no longer constant time.
    </p>
  </Article>
</template>
