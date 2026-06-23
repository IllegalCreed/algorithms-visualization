<!-- src/views/Article/SortAlgorithm/MergeSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { mergeSortModule } from '@/algorithms/merge-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="mergeSortModule" />
</template>
