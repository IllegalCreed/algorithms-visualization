<!-- src/components/Bar.vue -->
<script setup lang="ts">
defineProps<{
  value: number;
  percent: number;
  state:
    | 'idle'
    | 'comparing'
    | 'swapped'
    | 'sorted'
    | 'min'
    | 'key'
    | 'dimmed'
    | 'empty'
    | 'pivot'
    | 'heapNode';
}>();
</script>
<template>
  <div class="bar-cell column center">
    <span class="val">{{ state === 'empty' ? ' ' : value }}</span>
    <div class="bar" :class="state" :style="{ height: 30 + percent * 130 + 'px' }"></div>
  </div>
</template>
<style scoped lang="less">
.bar-cell {
  justify-content: flex-end;
}
.val {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}
.bar {
  width: 40px;
  border-radius: 8px;
  background-color: #8bd3a0;
  transition:
    height 0.3s ease,
    background-color 0.3s ease;
  .neumorphism-flat(3px, 8px);
}
.bar.comparing {
  background-color: #ffcf5c;
}
.bar.swapped {
  background-color: #ff8a65;
}
.bar.sorted {
  background-color: #4caf50;
}
.bar.min {
  background-color: #9d8df0;
}
.bar.key {
  background-color: #e07b9a;
}
.bar.pivot {
  background-color: #c2185b;
}
.bar.heapNode {
  background-color: #7e57c2;
}
.bar.dimmed {
  opacity: 0.28;
}
.bar.empty {
  background-color: transparent;
  border: 2px dashed fade(@font-color, 35%);
  box-shadow: none;
}
</style>
