<!-- src/views/Article/SortAlgorithm/SelectionSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { selectionSortModule } from '@/algorithms/selection-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="selectionSortModule" />
</template>
