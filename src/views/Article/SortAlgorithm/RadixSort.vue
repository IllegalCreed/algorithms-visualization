<!-- src/views/Article/SortAlgorithm/RadixSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { radixSortModule } from '@/algorithms/radix-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="radixSortModule" />
</template>
