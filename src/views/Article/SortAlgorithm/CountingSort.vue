<!-- src/views/Article/SortAlgorithm/CountingSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { countingSortModule } from '@/algorithms/counting-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="countingSortModule" />
</template>
