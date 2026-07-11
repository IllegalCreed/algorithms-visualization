<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishExtGcdModule } from '@/i18n/en/modules/ext-gcd';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="ext-gcd"
    :module="englishExtGcdModule"
    idea="Euclid's remainder chain preserves the gcd. Extended Euclid also substitutes equations backward so the same gcd becomes a linear combination of the original inputs."
    visualization="Rows descend through quotients and remainders to the zero base case, then fill coefficient columns in reverse order during unwinding."
    invariant="Every completed row's coefficients express its gcd as a linear combination of that row's two inputs."
    applications="Bezout coefficients solve linear Diophantine equations and provide modular inverses, which are the key construction step in the Chinese Remainder Theorem."
  />
</template>
