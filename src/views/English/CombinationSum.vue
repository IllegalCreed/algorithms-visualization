<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishCombinationSumModule } from '@/i18n/en/modules/combination-sum';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="combination-sum"
    :module="englishCombinationSumModule"
    idea="Sort candidates and keep a start index so choices never decrease. Reusing the same index permits repeated values, while a negative remaining target prunes the branch."
    visualization="Each decision edge subtracts one candidate from the remainder. Green leaves reach zero, pruned nodes exceed the target, and backtracking restores the previous remainder."
    invariant="Every path is nondecreasing, so each mathematical combination has only one search-tree representation."
    applications="This pattern handles target sums, repeatable parts, and bounded construction. Changing the next start index switches between reusable and single-use candidates."
  />
</template>
