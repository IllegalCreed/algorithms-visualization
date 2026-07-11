<!-- src/components/player/QuizCard.vue —— 测验题卡（C-112，M10-P3）：关键步拦停出题，答后可续播 -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import type { QuizItem } from './types';
import type { SiteLocale } from '@/i18n/catalog';

const props = withDefaults(defineProps<{ quiz: QuizItem; locale?: SiteLocale }>(), {
  locale: 'zh-CN',
});
const emit = defineEmits<{ answered: [correct: boolean]; resume: [] }>();

const selected = ref<number | null>(null);

watch(
  () => props.quiz,
  () => {
    selected.value = null; // 换题重置
  },
);

function choose(i: number): void {
  if (selected.value !== null) return; // 答后锁定
  selected.value = i;
  emit('answered', i === props.quiz.answer);
}

function optionClass(i: number): Record<string, boolean> {
  if (selected.value === null) return {};
  return {
    'qc-correct': i === props.quiz.answer,
    'qc-wrong': i === selected.value && i !== props.quiz.answer,
  };
}
</script>

<template>
  <div class="quiz-card column">
    <p class="qc-question">🤔 {{ quiz.question }}</p>
    <div class="qc-options column">
      <button
        v-for="(opt, i) in quiz.options"
        :key="i"
        type="button"
        class="qc-option"
        :class="optionClass(i)"
        @click="choose(i)"
      >
        {{ opt }}
        <span v-if="selected !== null && i === quiz.answer" class="qc-mark">✓</span>
        <span v-else-if="selected === i && i !== quiz.answer" class="qc-mark">✗</span>
      </button>
    </div>
    <button v-if="selected !== null" type="button" class="qc-resume" @click="emit('resume')">
      {{ props.locale === 'en' ? 'Continue' : '继续播放' }} ▶
    </button>
  </div>
</template>

<style scoped lang="less">
.quiz-card {
  width: 100%;
  max-width: 560px;
  padding: 14px 18px;
  gap: 10px;
  .neumorphism-flat(4px, 12px);
}
.qc-question {
  font-weight: bold;
  font-size: 15px;
  color: @font-highlight-color;
}
.qc-options {
  gap: 8px;
  width: 100%;
}
.qc-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 14px;
  border: none;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  color: @font-color;
  .neumorphism-btn(2px, 8px);
}
.qc-option.qc-correct {
  color: #1f5e3a;
  font-weight: bold;
  outline: 2px solid #8bd3a0;
}
.qc-option.qc-wrong {
  color: #c0392b;
  outline: 2px solid #e6a9a0;
}
.qc-mark {
  font-weight: bold;
  margin-left: 8px;
}
.qc-resume {
  align-self: center;
  padding: 6px 18px;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  color: #1f5e3a;
  .neumorphism-btn(2px, 8px);
}
</style>
