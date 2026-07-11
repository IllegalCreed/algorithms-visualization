<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishBucketSortModule } from '@/i18n/en/modules/bucket-sort';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="bucket-sort"
    :module="englishBucketSortModule"
    idea="Map each value into an ordered numeric range, sort values within each range, then concatenate the buckets. Distribution turns one global problem into several smaller local ones."
    visualization="The range label below each bucket explains every distribution choice. Buckets first contain arrival order, then show their local sort, and finally drain into the output array."
    invariant="Every value in bucket i is no greater than every value in a later nonempty bucket, so concatenating sorted buckets is globally sorted."
    applications="Bucket Sort approaches linear time for known, roughly uniform distributions. Skewed data can overload one bucket and recover the cost of its inner sorting method."
  />
</template>
