<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishSuffixArrayModule } from '@/i18n/en/modules/suffix-array';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="suffix-array"
    :module="englishSuffixArrayModule"
    idea="The doubling algorithm ranks suffixes by prefixes of length 1, 2, 4, and so on. A longer rank is determined by the pair of ranks for its first and second halves."
    visualization="Each row lists a suffix index, its current rank pair, and its sorted position. Equal pairs share a new rank until enough characters distinguish every suffix."
    invariant="After round k, rank order is exactly lexicographic order for the first 2 to the power k characters of every suffix."
    applications="Suffix arrays support substring search, repeated-substring analysis, and compressed text indexes with less pointer overhead than suffix trees."
  />
</template>
