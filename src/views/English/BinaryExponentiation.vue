<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishFastPowerModule } from '@/i18n/en/modules/fast-power';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="fast-power"
    :module="englishFastPowerModule"
    idea="Decompose the exponent into powers of two. Repeatedly square the base, and multiply the result only for set bits in the exponent."
    visualization="Exponent bits disappear from least significant to most significant. The base block squares every round, while result blocks grow only on multiply steps."
    invariant="At every round, accumulated result times current base to the remaining exponent equals the original requested power."
    applications="Binary exponentiation supports modular powers, matrix recurrences, permutation powers, and any associative operation with an identity element."
  />
</template>
