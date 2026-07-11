<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishHeapSortModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Heap Sort</h1>
    <p class="sub">An in-place max heap shown as both an array and a tree</p>

    <h2>Turn the array into a priority structure</h2>
    <p>
      Heap Sort interprets the array as a complete binary tree. In a max heap, every parent is at
      least as large as its children, so the root is the maximum. Floyd's build starts at the last
      internal node and sifts each subtree downward.
    </p>

    <h2>Extract the root into the sorted suffix</h2>
    <p>
      Swap the root with the last heap element, shrink the heap, then sift the new root down until
      the max-heap invariant is restored. The array and tree tracks share element IDs, so every
      structural change stays synchronized.
    </p>

    <AlgorithmPlayer :module="englishHeapSortModule" locale="en" />

    <h2>Guaranteed bounds</h2>
    <p>
      Floyd heap construction is <code>O(n)</code>. The following <code>n - 1</code> extractions
      each cost at most <code>O(log n)</code>, giving <code>O(n log n)</code> worst-case time and
      <code>O(1)</code> auxiliary space. Heap Sort is not stable.
    </p>

    <Callout>
      <b>Invariant:</b> before each extraction, the active prefix is a max heap and the suffix is
      already in its final sorted order.
    </Callout>

    <p>
      Compare its tree-based selection with
      <RouterLink :to="{ name: 'en-quick-sort' }">Quick Sort</RouterLink> partitioning.
    </p>
  </Article>
</template>
