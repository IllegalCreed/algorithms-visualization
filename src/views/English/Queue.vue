<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import DequeViz from '@/components/structures/DequeViz.vue';
import QueueViz from '@/components/structures/QueueViz.vue';
</script>

<template>
  <Article>
    <h1>Queue and Deque</h1>
    <p class="sub">First-in, first-out processing and its two-ended extension</p>

    <h2>A queue preserves arrival order</h2>
    <p>
      A queue inserts at the rear and removes from the front. The oldest waiting item leaves first,
      which makes queues natural for scheduling, buffering, and breadth-first search. With a linked
      list or circular array, enqueue and dequeue both take <code>O(1)</code> time.
    </p>

    <Playground title="Try it">
      <QueueViz locale="en" />
    </Playground>

    <p>
      A circular array reuses slots vacated at the front instead of shifting every remaining value.
      Head and tail indices wrap around the capacity while the logical order stays unchanged.
    </p>

    <h2>A deque opens both ends</h2>
    <p>
      A double-ended queue supports insertion and removal at both the front and rear. It can behave
      like either a queue or a stack, and it powers sliding-window algorithms that must discard old
      candidates from one side while adding new candidates on the other.
    </p>

    <Playground title="Try it">
      <DequeViz locale="en" />
    </Playground>

    <Callout>
      <b>Invariant:</b> removal order follows the logical front-to-rear sequence, even when a
      circular backing array wraps across its physical boundary.
    </Callout>

    <p>
      Queues traverse a <RouterLink :to="{ name: 'en-tree' }">tree</RouterLink> level by level,
      while stacks traverse depth first.
    </p>
  </Article>
</template>
