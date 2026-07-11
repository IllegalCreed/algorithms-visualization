<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishDualPivotQuickSortModule } from '@/i18n/en/modules/dual-pivot-quick-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="dual-pivot-quick-sort"
    :module="englishDualPivotQuickSortModule"
    idea="Order two endpoint pivots p and q, then divide the scan into values below p, between p and q, and above q. Placing both pivots finishes three subproblems at once."
    visualization="Two pivot markers remain visible while lt, i, and gt move the unknown region inward. Each comparison selects one of the three partition branches."
    invariant="The outer regions are already classified relative to p and q, and only the interval between i and gt remains unknown."
    applications="Dual-pivot partitioning can reduce comparisons and improve cache behavior in tuned primitive-array sorts. Pivot selection remains essential to avoid unbalanced recursion."
  />
</template>
