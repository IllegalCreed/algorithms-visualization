<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import StackViz from '@/components/structures/StackViz.vue';
</script>

<template>
  <Article>
    <h1>Stack</h1>
    <p class="sub">Last in, first out through one active end</p>

    <h2>Only the top is exposed</h2>
    <p>
      A stack accepts <code>push</code> and <code>pop</code> at the same end. The newest value is
      therefore the first one removed, a rule known as last in, first out (LIFO).
      <code>peek</code> reads that value without changing the stack.
    </p>

    <Playground title="Try it">
      <StackViz locale="en" />
    </Playground>

    <p>
      An array-backed stack keeps the top at the end of a dynamic array, so push and pop are
      amortized <code>O(1)</code>. A linked implementation can make both operations worst-case
      <code>O(1)</code> by treating the list head as the top.
    </p>

    <h2>Why stacks appear in algorithms</h2>
    <p>
      Function calls use a stack to remember return points and local state. Depth-first search uses
      the same idea explicitly or through recursion. Parsers, expression evaluators, undo history,
      and monotonic-stack algorithms all rely on controlled access to the most recent unfinished
      item.
    </p>

    <Callout>
      <b>Invariant:</b> every pop removes exactly the value returned by the most recent unmatched
      push.
    </Callout>

    <p>
      Compare LIFO ordering with the first-in, first-out behavior of a
      <RouterLink :to="{ name: 'en-queue' }">queue</RouterLink>.
    </p>
  </Article>
</template>
