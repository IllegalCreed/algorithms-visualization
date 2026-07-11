<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishBentleyOttmannModule } from '@/i18n/en/modules/bentley-ottmann';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="bentley-ottmann"
    :module="englishBentleyOttmannModule"
    idea="Sweep events from left to right while a balanced status structure orders segments by their current vertical position. Only neighboring segments can create the next unseen intersection."
    visualization="The sweep line advances through endpoint and crossing events. The status order inserts, removes, or swaps segments, and only newly adjacent pairs schedule tests."
    invariant="Between consecutive events, the status structure has the same vertical order as the segments crossing the sweep line."
    applications="Bentley-Ottmann reports all intersections output-sensitively. Robust event ordering and exact predicates are essential in production geometry systems."
  />
</template>
