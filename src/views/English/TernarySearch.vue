<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishTernarySearchModule } from '@/i18n/en/modules/ternary-search';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="ternary-search"
    :module="englishTernarySearchModule"
    idea="For a unimodal objective, compare points at one third and two thirds of the interval. Their values identify one outer third that cannot contain the peak."
    visualization="The plotted curve keeps both probes and shades the discarded third. Repeated probes close around the unique maximum until the chosen precision is reached."
    invariant="The remaining interval always contains a global peak of the unimodal objective."
    applications="Ternary search optimizes unimodal discrete or continuous functions when derivatives are unavailable. Convex minimization uses the symmetric comparison direction."
  />
</template>
