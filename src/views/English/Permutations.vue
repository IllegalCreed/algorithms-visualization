<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishPermutationsModule } from '@/i18n/en/modules/permutations';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="permutations"
    :module="englishPermutationsModule"
    idea="Fill one output position at a time by choosing any unused input value. A boolean used set enforces uniqueness, and backtracking releases each value for sibling branches."
    visualization="The decision tree has one level per output position. Descending edges add a value, leaf nodes record complete arrangements, and returning upward removes the final choice."
    invariant="The current path contains distinct values and is exactly the prefix shared by every permutation in its subtree."
    applications="Permutation search appears in small assignment, ordering, and route problems. Duplicate input values require sorting plus a same-depth skip rule to avoid repeated outputs."
  />
</template>
