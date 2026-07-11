<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishAhoCorasickModule } from '@/i18n/en/modules/aho-corasick';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="aho-corasick"
    :module="englishAhoCorasickModule"
    idea="Store all patterns in one trie. Failure links connect each state to its longest suffix that is also a trie prefix, so a mismatch reuses text already read instead of restarting every pattern."
    visualization="Solid edges form the trie and dashed edges show failures. The active automaton state follows each text character, and output links report overlapping pattern endings."
    invariant="After consuming text position i, the active state represents the longest suffix of the processed text that is also a pattern prefix."
    applications="Aho-Corasick powers dictionary scanning, moderation filters, intrusion signatures, and lexing when many patterns must be found in the same stream."
  />
</template>
