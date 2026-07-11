<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishDigitDpModule } from '@/i18n/en/modules/digit-dp';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="digit-dp"
    :module="englishDigitDpModule"
    idea="Scan the upper bound from most significant digit to least. A tight prefix may not exceed the bound digit; choosing a smaller digit releases every later position from that limit."
    visualization="The table separates free branches from the single tight path. Each row shows how many valid suffixes follow a smaller choice and whether matching the bound digit survives."
    invariant="Every counted prefix is either exactly equal to the bound prefix or already smaller, and the remaining state captures all constraints needed for its suffix."
    applications="Digit DP counts bounded integers with forbidden digits, digit sums, automaton constraints, and modular properties without enumerating the range."
  />
</template>
