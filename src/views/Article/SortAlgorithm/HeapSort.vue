<!-- src/views/Article/SortAlgorithm/HeapSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { heapSortModule } from '@/algorithms/heap-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="heapSortModule" />
</template>
