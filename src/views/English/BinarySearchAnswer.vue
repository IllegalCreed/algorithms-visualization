<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishBinaryAnswerModule } from '@/i18n/en/modules/binary-answer';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="binary-answer"
    :module="englishBinaryAnswerModule"
    idea="Replace direct optimization with a yes-or-no predicate such as whether capacity x is sufficient. If feasibility changes only once, binary search finds that boundary."
    visualization="The numeric answer interval shrinks around each midpoint. The feasibility panel explains the check, and colors distinguish impossible from feasible values."
    invariant="All values strictly below the lower boundary are known impossible, while the retained interval still contains the first feasible answer."
    applications="Binary search on the answer solves capacity planning, partition limits, minimum speed, maximum spacing, and many problems whose candidate range is ordered but not explicitly listed."
  />
</template>
