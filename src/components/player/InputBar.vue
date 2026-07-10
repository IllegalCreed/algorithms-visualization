<!-- src/components/player/InputBar.vue —— 自定义输入条（C-110，M10-P1）：模块声明 inputSpec 才渲染 -->
<script setup lang="ts">
import { ref, useId, watch } from 'vue';
import type { InputSpec } from './types';
import { parseInputArray } from './inputSpec';
import type { SiteLocale } from '@/i18n/pilot';

const props = withDefaults(
  defineProps<{ spec: InputSpec; modelText: string; locale?: SiteLocale }>(),
  { locale: 'zh-CN' },
);
const emit = defineEmits<{ apply: [value: number[]]; restore: [] }>();

const inputId = `algorithm-player-input-${useId()}`;
const errorId = `${inputId}-error`;
const text = ref(props.modelText);
const error = ref('');

watch(
  () => props.modelText,
  (v) => {
    text.value = v;
    error.value = '';
  },
);

function apply(): void {
  const r = parseInputArray(text.value, props.spec, props.locale);
  if (!r.ok) {
    error.value = r.error;
    return;
  }
  error.value = '';
  emit('apply', r.value);
}

function restore(): void {
  error.value = '';
  emit('restore');
}
</script>

<template>
  <div class="input-bar column">
    <div class="ib-row row">
      <label class="ib-label" :for="inputId">{{ locale === 'en' ? 'Input' : '输入' }}</label>
      <input
        :id="inputId"
        v-model="text"
        class="ib-text"
        type="text"
        name="algorithm-input"
        :placeholder="spec.hint"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? errorId : undefined"
        autocomplete="off"
        spellcheck="false"
        @keydown.enter="apply"
      />
      <button type="button" class="ib-apply" @click="apply">
        {{ locale === 'en' ? 'Apply' : '应用' }}
      </button>
      <button
        type="button"
        class="ib-restore"
        :title="locale === 'en' ? 'Restore default data' : '恢复默认数据'"
        @click="restore"
      >
        {{ locale === 'en' ? 'Restore' : '恢复默认' }}
      </button>
    </div>
    <p v-if="error" :id="errorId" class="ib-error" role="alert" aria-live="polite">
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="less">
.input-bar {
  width: 100%;
  gap: 6px;
}
.ib-row {
  gap: 10px;
  align-items: center;
  width: 100%;
}
.ib-label {
  font-weight: bold;
  font-size: 14px;
  color: @font-highlight-color;
  flex-shrink: 0;
}
.ib-text {
  flex: 1;
  min-width: 0;
  height: 34px;
  padding: 0 12px;
  border: none;
  font-size: 14px;
  color: @font-color;
  .neumorphism-concave(2px, 8px);
  &:focus {
    outline: 2px solid #8bd3a0;
  }
}
.ib-apply,
.ib-restore {
  height: 34px;
  padding: 0 14px;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  color: @font-color;
  .neumorphism-btn(2px, 8px);
  flex-shrink: 0;
}
.ib-apply {
  color: #1f5e3a;
}
.ib-error {
  font-size: 13px;
  color: #c0392b;
  font-weight: bold;
}
@media (max-width: @screen-max-width) {
  .ib-row {
    flex-wrap: wrap;
  }
}
</style>
