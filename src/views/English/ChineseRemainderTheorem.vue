<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishCrtModule } from '@/i18n/en/modules/crt';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="crt"
    :module="englishCrtModule"
    idea="For pairwise coprime moduli, construct one basis term per congruence. That term is one under its own modulus and zero under all others, so weighted terms combine independently."
    visualization="Each table row builds its partial product, modular inverse, and residue term. The final row adds them and reduces the sum by the full modulus product."
    invariant="After a basis term is built, it contributes its requested residue to exactly one congruence and contributes zero to every other congruence."
    applications="CRT reconstructs values from modular channels, accelerates large-integer arithmetic, and schedules repeating cycles. Non-coprime moduli require compatibility checks and generalized merging."
  />
</template>
