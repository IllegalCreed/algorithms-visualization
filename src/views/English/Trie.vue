<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import TrieViz from '@/components/structures/TrieViz.vue';
</script>

<template>
  <Article>
    <h1>Trie</h1>
    <p class="sub">A prefix tree that shares paths between strings</p>

    <h2>Characters live on a path</h2>
    <p>
      Each trie edge represents one character. Following a word from the root reaches its prefix
      node, while a terminal marker distinguishes a complete stored word from a prefix that only
      leads to longer words. Common prefixes share the same nodes.
    </p>

    <Playground title="Try it">
      <TrieViz locale="en" />
    </Playground>

    <p>
      Insertion and exact lookup take <code>O(L)</code> time for a string of length <code>L</code>,
      independent of the number of stored words. Enumerating completions additionally costs the size
      of the returned prefix subtree.
    </p>

    <Callout>
      <b>Use a trie for:</b> autocomplete, dictionary lookup, prefix routing, and multi-pattern
      preprocessing. Its speed trades against the memory required by child references.
    </Callout>

    <p>
      <RouterLink :to="{ name: 'en-aho-corasick' }">Aho-Corasick</RouterLink> augments a trie with
      failure links to search many patterns through one text in a single pass.
    </p>
  </Article>
</template>
