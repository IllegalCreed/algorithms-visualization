<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishEulerPhiModule } from '@/i18n/en/modules/euler-phi';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="euler-phi"
    :module="englishEulerPhiModule"
    idea="Factor n into distinct primes. For each prime p, remove the one-in-p fraction of candidates divisible by p, producing the product n times one minus one over p."
    visualization="Candidate integers are crossed out when a discovered prime factor divides them. The product column updates once per distinct factor, not once per exponent."
    invariant="After processing a set of prime factors, the surviving candidates are divisible by none of those factors."
    applications="Euler's phi function controls multiplicative groups modulo n, Euler's theorem, modular inverses, RSA reasoning, and reduced-fraction counts."
  />
</template>
