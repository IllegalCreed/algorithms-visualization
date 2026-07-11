<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishLcpArrayModule } from '@/i18n/en/modules/lcp-array';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="lcp-array"
    :module="englishLcpArrayModule"
    idea="Kasai's algorithm visits suffixes in text order. If one suffix shares h characters with its suffix-array predecessor, the next text suffix can reuse at least h minus one before extending comparisons."
    visualization="The suffix-array rank selects the comparison neighbor. A highlighted prefix shows reused characters, then grows only while new characters match."
    invariant="The carried match length is a valid lower bound for the next suffix comparison and decreases by at most one between text positions."
    applications="Together with a suffix array, LCP values reveal repeated substrings and support range-minimum queries for arbitrary suffix-prefix lengths."
  />
</template>
