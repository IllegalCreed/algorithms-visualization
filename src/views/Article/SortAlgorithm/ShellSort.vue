<!-- src/views/Article/SortAlgorithm/ShellSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { shellSortModule } from '@/algorithms/shell-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="shellSortModule" />
</template>
