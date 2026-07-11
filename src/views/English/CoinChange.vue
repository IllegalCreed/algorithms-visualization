<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishCoinChangeModule } from '@/i18n/en/modules/coin-change';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="coin-change"
    :module="englishCoinChangeModule"
    idea="For each amount, try appending every coin to a solved smaller amount. The minimum reachable candidate becomes the state value, and a predecessor coin can reconstruct one solution."
    visualization="The amount row grows from zero toward the target. Candidate arrows point back by one coin value, while unreachable cells remain infinite until a valid predecessor appears."
    invariant="When amount a is finalized, every transition into it comes from a smaller amount whose minimum coin count is already correct."
    applications="The same unbounded DP pattern handles denominations, minimum pieces, and repeated actions. Counting combinations instead of minimizing changes the state meaning and loop order."
  />
</template>
