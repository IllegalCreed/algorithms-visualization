<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishCompleteKnapsackModule } from '@/i18n/en/modules/complete-knapsack';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="complete-knapsack"
    :module="englishCompleteKnapsackModule"
    idea="Each item type may be chosen repeatedly. When a state takes the current item, its remainder stays on the same row instead of moving to the previous-item row."
    visualization="Every matrix cell compares skipping the item with taking one copy plus the best value at the smaller capacity. The highlighted dependency reveals why reuse is allowed."
    invariant="After finishing item row i, every capacity stores the best value obtainable from unlimited copies of the first i item types."
    applications="Unbounded Knapsack models repeatable purchases, cutting, and resource composition. Reverse the one-dimensional capacity loop to recover the at-most-once 0/1 variant."
  />
</template>
