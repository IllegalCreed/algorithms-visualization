<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishCocktailSortModule } from '@/i18n/en/modules/cocktail-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="cocktail-sort"
    :module="englishCocktailSortModule"
    idea="Alternate a left-to-right bubble pass with a right-to-left pass. The forward scan fixes a large value at the right boundary, while the backward scan fixes a small value at the left boundary."
    visualization="The active direction changes at each boundary. Adjacent pointers mark each comparison, swaps move stable bars, and the completed prefix and suffix close around the unsorted center."
    invariant="After every forward pass the right boundary is final, and after every backward pass the left boundary is final."
    applications="Cocktail Shaker Sort is mainly educational. It can improve over one-way Bubble Sort when small values begin near the right edge, but efficient general sorting still favors n log n methods."
  />
</template>
