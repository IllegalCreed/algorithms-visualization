<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishLinearSieveModule } from '@/i18n/en/modules/linear-sieve';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="linear-sieve"
    :module="englishLinearSieveModule"
    idea="Process integers in order. An unmarked value is prime; multiplying it and every earlier prime marks composites, but the loop stops when that prime divides the current value."
    visualization="The number grid distinguishes new primes from composites, while the prime list drives each product. The break point identifies the smallest prime factor responsible for a composite."
    invariant="Before advancing past i, every composite generated so far has been generated exactly once by its smallest prime factor."
    applications="The linear sieve produces primes and smallest prime factors together, enabling fast factorization and multiplicative-function tables over a bounded range."
  />
</template>
