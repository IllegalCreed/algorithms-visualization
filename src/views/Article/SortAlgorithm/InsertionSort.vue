<!-- src/views/Article/SortAlgorithm/InsertionSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { insertionSortModule } from '@/algorithms/insertion-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="insertionSortModule" />
</template>
