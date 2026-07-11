<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import BalanceViz from '@/components/structures/BalanceViz.vue';
import TreeViz from '@/components/structures/TreeViz.vue';
</script>

<template>
  <Article>
    <h1>Binary Search Tree</h1>
    <p class="sub">Hierarchical search guided by an ordering invariant</p>

    <h2>Every comparison chooses one subtree</h2>
    <p>
      In a binary search tree (BST), every value in a node's left subtree is smaller and every value
      in its right subtree is larger. Searching compares the target with the current node and
      discards one entire subtree. Inorder traversal visits the values in ascending order.
    </p>

    <Playground title="Try it">
      <TreeViz locale="en" />
    </Playground>

    <p>
      Search and insertion take <code>O(h)</code>, where <code>h</code> is the tree height. A
      balanced tree has <code>h = O(log n)</code>, but ordinary BST insertion does not guarantee
      that shape.
    </p>

    <h2>Shape controls performance</h2>
    <p>
      Inserting already sorted values can create a one-sided chain with height <code>n</code>. AVL
      trees and red-black trees rotate nodes to keep their height logarithmic while preserving the
      same ordering invariant. Compare the two shapes using exactly the same seven values.
    </p>

    <Playground title="Try it">
      <BalanceViz locale="en" />
    </Playground>

    <Callout>
      <b>Invariant:</b> ordering determines correctness; balance determines the performance bound. A
      valid but skewed BST still returns correct answers, only more slowly.
    </Callout>

    <p>
      A <RouterLink :to="{ name: 'en-heap' }">heap</RouterLink> keeps a weaker parent-child order to
      make the minimum or maximum easy to remove, while a BST supports ordered search.
    </p>
  </Article>
</template>
