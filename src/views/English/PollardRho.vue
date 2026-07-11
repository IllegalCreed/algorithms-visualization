<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishPollardRhoModule } from '@/i18n/en/modules/pollard-rho';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="pollard-rho"
    :module="englishPollardRhoModule"
    idea="Iterate a pseudo-random polynomial modulo n with tortoise and hare speeds. When the two values collide modulo an unknown factor, the gcd of their difference with n reveals that factor."
    visualization="The graph tracks both sequence positions and the gcd at each race step. A later factor-colored view shows why the sequence forms a tail and cycle modulo the hidden divisor."
    invariant="Every gcd divides n, and a value strictly between one and n is therefore a valid nontrivial factor."
    applications="Pollard's Rho is effective for composites with moderately small factors and pairs naturally with Miller-Rabin, recursive splitting, and random restarts."
  />
</template>
