<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishMillerRabinModule } from '@/i18n/en/modules/miller-rabin';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="miller-rabin"
    :module="englishMillerRabinModule"
    idea="For odd n, write n minus one as d times a power of two. A prime must make each witness produce one immediately or reach minus one while repeatedly squaring."
    visualization="The decomposition fixes d and the squaring count. Each witness row begins with modular exponentiation, then follows residues until it passes or proves n composite."
    invariant="A witness is accepted only when its residue chain satisfies the strong probable-prime condition required of every prime."
    applications="Miller-Rabin is the standard fast primality screen for cryptography and factorization. Fixed witness sets make it deterministic over common 64-bit ranges."
  />
</template>
