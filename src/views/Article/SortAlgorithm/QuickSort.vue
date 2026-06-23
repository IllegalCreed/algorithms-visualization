<!-- src/views/Article/SortAlgorithm/QuickSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { quickSortModule } from '@/algorithms/quick-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="quickSortModule" />
</template>
