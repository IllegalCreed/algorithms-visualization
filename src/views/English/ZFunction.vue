<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishZFunctionModule } from '@/i18n/en/modules/z-function';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="z-function"
    :module="englishZFunctionModule"
    idea="For each position, z stores the longest suffix prefix that matches the whole string prefix. The rightmost known match box lets positions inside it reuse a mirrored value."
    visualization="The active Z-box marks its left and right boundaries. Inside it, a mirror supplies an initial radius; direct comparisons occur only when that radius reaches the right edge."
    invariant="The current box is the processed prefix match with the farthest right endpoint, and every earlier z value is final."
    applications="The Z function supports exact pattern matching with pattern-plus-text concatenation, borders, periods, and string compression checks."
  />
</template>
