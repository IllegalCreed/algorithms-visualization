<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishThreeWayQuickSortModule } from '@/i18n/en/modules/three-way-quick-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="three-way-quick-sort"
    :module="englishThreeWayQuickSortModule"
    idea="Maintain three regions around one pivot: values below it, values equal to it, and values above it. A single scan expands the regions until no unknown values remain."
    visualization="The lt, i, and gt pointers bound the three colored regions. Less and greater branches swap values across a boundary, while equal values simply advance the scan."
    invariant="Before every comparison, positions before lt are smaller, positions from lt to i are equal, and positions after gt are greater than the pivot."
    applications="Three-way partitioning is the preferred Quick Sort variant for data with many duplicate keys. Distinct random data behaves similarly to ordinary Quick Sort."
  />
</template>
