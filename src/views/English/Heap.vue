<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import HeapViz from '@/components/structures/HeapViz.vue';
</script>

<template>
  <Article>
    <h1>Binary Heap</h1>
    <p class="sub">A complete tree that keeps one extreme value at the root</p>

    <h2>Tree shape from array indices</h2>
    <p>
      A binary heap is a complete binary tree usually stored in an array. For a node at index
      <code>i</code>, its children are at <code>2i + 1</code> and <code>2i + 2</code>. No pointers
      are needed, and the complete shape keeps the height at <code>O(log n)</code>.
    </p>

    <h2>Restore order along one path</h2>
    <p>
      In a max heap, every parent is at least as large as its children. Insertion appends a leaf and
      sifts it upward. Extracting the maximum moves the final leaf to the root and sifts it
      downward. Both repairs touch only one root-to-leaf path.
    </p>

    <Playground title="Try it">
      <HeapViz locale="en" />
    </Playground>

    <Callout>
      <b>Costs:</b> peek at the root in <code>O(1)</code>; insert or extract in
      <code>O(log n)</code>; build a heap bottom-up in <code>O(n)</code>.
    </Callout>

    <p>
      Heaps implement priority queues and power
      <RouterLink :to="{ name: 'en-heap-sort' }">Heap Sort</RouterLink>. Unlike a binary search
      tree, they do not keep the entire set in sorted order.
    </p>
  </Article>
</template>
