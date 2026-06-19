<!-- src/views/Article/SortAlgorithm/BubbleSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bubbleSortModule } from '@/algorithms/bubble-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="bubbleSortModule" />
</template>
