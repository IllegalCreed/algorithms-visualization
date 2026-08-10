<script setup lang="ts">
import { computed } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import type { VarRow } from './types';

const props = withDefaults(
  defineProps<{ vars: VarRow[]; prev?: VarRow[]; locale?: SiteLocale }>(),
  { locale: 'zh-CN' },
);
const panelLabel = computed(() => (props.locale === 'en' ? 'Variables' : '变量'));

function changed(row: VarRow): boolean {
  if (!props.prev) return false;
  const p = props.prev.find((r) => r.name === row.name);
  return p !== undefined && p.value !== row.value;
}
</script>
<template>
  <dl class="var-panel column" :aria-label="panelLabel">
    <div
      class="var-row row"
      v-for="row in props.vars"
      :key="row.name"
      :class="{ changed: changed(row) }"
    >
      <dt class="name">{{ row.name }}</dt>
      <dd class="value">{{ row.value }}</dd>
    </div>
  </dl>
</template>
<style scoped lang="less">
.var-panel {
  gap: 4px;
  margin: 0;
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
