<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishRadixSortModule } from '@/i18n/en/modules/radix-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="radix-sort"
    :module="englishRadixSortModule"
    idea="Process digits from least to most significant. Each stable bucket pass orders values by one more digit while preserving the order established by all lower digits."
    visualization="The active place value selects one of ten buckets for every number. Collection drains buckets from zero through nine without changing order inside a bucket."
    invariant="After processing d digits, the array is stably sorted by the d least significant digits."
    applications="Radix Sort is effective for bounded integers, fixed-width identifiers, and strings with a controlled alphabet. Extra storage and multiple full passes make it unsuitable for arbitrary comparison keys."
  />
</template>
