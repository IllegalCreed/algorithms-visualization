<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishWordSearchModule } from '@/i18n/en/modules/word-search';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="word-search"
    :module="englishWordSearchModule"
    idea="Try every matching start cell, then recurse to adjacent cells for successive characters. Mark a cell while it is on the path and restore it when the branch returns."
    visualization="The board distinguishes the current path, rejected candidates, and restored cells. The character index shows exactly which word position each recursive depth must match."
    invariant="The active path spells the matched word prefix and contains no grid cell more than once."
    applications="Word Search demonstrates path-local visited state. Multiple-word searches often replace repeated backtracking with a trie that prunes many prefixes together."
  />
</template>
