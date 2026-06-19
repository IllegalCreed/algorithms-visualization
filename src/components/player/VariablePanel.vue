<script setup lang="ts">
import type { VarRow } from './types';

const props = defineProps<{ vars: VarRow[]; prev?: VarRow[] }>();

function changed(row: VarRow): boolean {
  if (!props.prev) return false;
  const p = props.prev.find((r) => r.name === row.name);
  return p !== undefined && p.value !== row.value;
}
</script>
<template>
  <div class="var-panel column">
    <div
      class="var-row row"
      v-for="row in props.vars"
      :key="row.name"
      :class="{ changed: changed(row) }"
    >
      <span class="name">{{ row.name }}</span>
      <span class="value">{{ row.value }}</span>
    </div>
  </div>
</template>
<style scoped lang="less">
.var-panel {
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  .neumorphism-flat(4px, 12px);
}
.var-row {
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  transition: background-color 0.3s ease;
}
.var-row.changed {
  background: rgba(255, 138, 101, 0.25);
}
.name {
  opacity: 0.65;
}
.value {
  font-weight: bold;
}
</style>
