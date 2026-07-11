<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishTwoSatModule } from '@/i18n/en/modules/two-sat';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="two-sat"
    :module="englishTwoSatModule"
    idea="Clause a or b is equivalent to two implications: not a implies b, and not b implies a. Strongly connected components expose contradictions and provide an assignment order."
    visualization="Each variable appears as two literal vertices. Clause edges arrive in pairs, SCC colors group mutual implications, and the final badges show the selected truth values."
    invariant="A partial implication graph represents exactly the clauses already inserted; a variable is contradictory only if both literals enter one SCC."
    applications="2-SAT models pairwise choices, scheduling exclusions, orientation constraints, and configuration flags. Clauses with three or more unrestricted literals make the general problem NP-complete."
  />
</template>
