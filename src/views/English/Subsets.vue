<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishSubsetsModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Subsets</h1>
    <p class="sub">Generate a power set through an include-or-exclude decision tree</p>

    <h2>Make one binary decision per element</h2>
    <p>
      Every subset of an <code>n</code>-element set is determined by <code>n</code> decisions:
      include the next element or exclude it. Those choices form a complete binary tree of depth
      <code>n</code>, with one subset at each of its <code>2^n</code> leaves.
    </p>

    <h2>Traverse the decision tree depth first</h2>
    <p>
      Follow the include branch, recurse, undo that choice, then follow the exclude branch. The
      highlighted root-to-node path is the current recursion stack. Reaching a leaf means every
      element has a decision, so the current subset can be recorded.
    </p>
    <p>
      The player expands all choices for <code>[1, 2, 3]</code>. Visited nodes remain visible, green
      leaves are recorded subsets, and the edge labels make every include or exclude operation
      explicit.
    </p>

    <AlgorithmPlayer :module="englishSubsetsModule" locale="en" />

    <h2>Output size sets the lower bound</h2>
    <p>
      There are <code>2^n</code> subsets. Materializing each result may copy up to
      <code>n</code> values, so the total time and output space are <code>O(n * 2^n)</code>. The
      active recursion path itself uses only <code>O(n)</code> space.
    </p>

    <Callout>
      <b>Invariant:</b> each root-to-leaf path assigns one distinct include/exclude bit to every
      element, so the traversal produces every subset exactly once.
    </Callout>

    <p>
      Add constraints and pruning to the same decision-tree model in
      <RouterLink :to="{ name: 'en-n-queens' }">N-Queens</RouterLink>.
    </p>
  </Article>
</template>
