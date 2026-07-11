<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import DlinkViz from '@/components/structures/DlinkViz.vue';
import LinkViz from '@/components/structures/LinkViz.vue';
</script>

<template>
  <Article>
    <h1>Linked List</h1>
    <p class="sub">Nodes connected by references instead of contiguous addresses</p>

    <h2>Follow links to reach data</h2>
    <p>
      A singly linked list stores a value and a reference to the next node in each node. The nodes
      may live anywhere in memory, so the list can grow without relocating all existing values. The
      tradeoff is traversal: reaching index <code>i</code> requires following every preceding link,
      which takes <code>O(i)</code> time.
    </p>

    <Playground title="Try it">
      <LinkViz locale="en" />
    </Playground>

    <p>
      Once a node is known, inserting or removing its successor only rewires a constant number of
      references. Finding that position may still cost <code>O(n)</code>, so linked lists are most
      useful when an algorithm already holds the relevant node.
    </p>

    <h2>Doubly linked lists move both ways</h2>
    <p>
      Adding a previous reference enables backward traversal and constant-time removal of a known
      node. It also increases memory use and makes every update responsible for two directions. Move
      the cursor and watch both neighbor links remain consistent.
    </p>

    <Playground title="Try it">
      <DlinkViz locale="en" />
    </Playground>

    <Callout>
      <b>Invariant:</b> for every adjacent pair <code>a</code> and <code>b</code>,
      <code>a.next === b</code> and <code>b.prev === a</code>. A partial update can silently split
      the list.
    </Callout>

    <p>
      Linked nodes are the building blocks behind the
      <RouterLink :to="{ name: 'en-stack' }">stack</RouterLink>, queues, and the recency order in an
      LRU cache.
    </p>
  </Article>
</template>
