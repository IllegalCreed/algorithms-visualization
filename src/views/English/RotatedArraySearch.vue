<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishRotatedSearchModule } from '@/i18n/en/modules/rotated-search';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="rotated-search"
    :module="englishRotatedSearchModule"
    idea="A rotated sorted array still has at least one sorted half around every midpoint. Determine that half, test whether the target falls inside its value range, and discard the other half."
    visualization="Low, midpoint, and high pointers bound the candidate interval. Each step labels the sorted half and visibly removes the half that cannot contain the target."
    invariant="The target, when present, remains inside the current inclusive candidate interval after every half elimination."
    applications="This pattern handles searches across one unknown cyclic pivot. Repeated values may make both halves ambiguous and can degrade the worst case to linear time."
  />
</template>
