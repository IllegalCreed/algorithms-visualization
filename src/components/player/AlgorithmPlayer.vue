<!-- src/components/player/AlgorithmPlayer.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, shallowRef, watch } from 'vue';
import type { AlgorithmModule } from './types';
import { usePlayer } from './usePlayer';
import { clearInputFromUrl, readInputFromUrl, writeInputToUrl } from './inputSpec';
import InputBar from './InputBar.vue';
import QuizCard from './QuizCard.vue';
import BarsView from '@/components/BarsView.vue';
import AuxView from '@/components/AuxView.vue';
import StackView from '@/components/StackView.vue';
import TreeView from '@/components/TreeView.vue';
import CountView from '@/components/CountView.vue';
import BucketView from '@/components/BucketView.vue';
import GraphView from '@/components/GraphView.vue';
import MatrixView from '@/components/MatrixView.vue';
import BoardView from '@/components/BoardView.vue';
import DecisionTreeView from '@/components/DecisionTreeView.vue';
import MazeView from '@/components/MazeView.vue';
import KmpView from '@/components/KmpView.vue';
import ManacherView from '@/components/ManacherView.vue';
import SudokuView from '@/components/SudokuView.vue';
import SuffixArrayView from '@/components/SuffixArrayView.vue';
import SieveView from '@/components/SieveView.vue';
import GcdView from '@/components/GcdView.vue';
import PowerView from '@/components/PowerView.vue';
import HullView from '@/components/HullView.vue';
import NetworkView from '@/components/NetworkView.vue';
import CodePanel from './CodePanel.vue';
import VariablePanel from './VariablePanel.vue';
import TransportControls from './TransportControls.vue';
import type { SiteLocale } from '@/i18n/catalog';

const props = withDefaults(defineProps<{ module: AlgorithmModule; locale?: SiteLocale }>(), {
  locale: 'zh-CN',
});

// C-110 自定义输入：模块声明 inputSpec 时支持 ?input= 初始化与运行时重建；不声明 = 固定剧本（旧路径全等）
const input = shallowRef(readInputFromUrl(props.module.inputSpec) ?? props.module.initialInput());
const steps = shallowRef(props.module.buildSteps(input.value));
const {
  index,
  isPlaying,
  atStart,
  atEnd,
  total,
  speed,
  loop,
  current,
  play,
  pause,
  stepForward,
  stepBackward,
  seek,
  reset,
  setSpeed,
  toggleLoop,
} = usePlayer(steps);

// C-111 键盘快捷键：→/←/空格；输入控件聚焦时不抢（InputBar 打字优先）；题卡可见时不响应（C-112 防绕题）
function onKeydown(e: KeyboardEvent): void {
  if (activeQuizVisible.value) return;
  const t = e.target as HTMLElement | null;
  const tag = t?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    stepForward();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    stepBackward();
  } else if (e.key === ' ') {
    e.preventDefault(); // 防页面滚动
    if (isPlaying.value) pause();
    else play();
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));

const prevVars = computed(() => steps.value[index.value - 1]?.vars);
const inputText = computed(() => input.value.join(', '));

// C-112 测验：步下标 → 是否答对；同一步答过不再出题
const quizRecord = reactive(new Map<number, boolean>());
const showQuizResult = ref(false);
const wasAutoPlaying = ref(false);
const quizTotal = computed(() => steps.value.filter((s) => s.quiz).length);
const quizCorrect = computed(() => [...quizRecord.values()].filter(Boolean).length);
const activeQuizVisible = computed(() => {
  const q = current.value.quiz;
  return !!q && (!quizRecord.has(index.value) || showQuizResult.value);
});

watch(index, (i) => {
  showQuizResult.value = false; // 离步收结果态
  const q = steps.value[i]?.quiz;
  if (q && !quizRecord.has(i)) {
    wasAutoPlaying.value = isPlaying.value;
    if (isPlaying.value) pause(); // 自动播放拦停出题
  }
});

function onQuizAnswered(correct: boolean): void {
  quizRecord.set(index.value, correct);
  showQuizResult.value = true;
}

function onQuizResume(): void {
  showQuizResult.value = false;
  if (wasAutoPlaying.value) play();
}

function applyInput(arr: number[]): void {
  input.value = arr;
  steps.value = props.module.buildSteps(arr);
  quizRecord.clear();
  showQuizResult.value = false;
  reset();
  writeInputToUrl(arr);
}

function restoreInput(): void {
  input.value = props.module.initialInput();
  steps.value = props.module.buildSteps(input.value);
  quizRecord.clear();
  showQuizResult.value = false;
  reset();
  clearInputFromUrl();
}
</script>
<template>
  <div class="algo-player column center">
    <InputBar
      v-if="props.module.inputSpec"
      :spec="props.module.inputSpec"
      :model-text="inputText"
      :locale="props.locale"
      @apply="applyInput"
      @restore="restoreInput"
    />
    <TreeView
      v-if="current.tree"
      :array="current.array"
      :emphasis="current.emphasis"
      :heap-size="current.tree.heapSize"
    />
    <BarsView
      v-if="current.array.length"
      :array="current.array"
      :pointers="current.pointers"
      :emphasis="current.emphasis"
    />
    <GraphView v-if="current.graph" :graph="current.graph" />
    <MatrixView v-if="current.matrix" :matrix="current.matrix" />
    <BoardView v-if="current.board" :board="current.board" />
    <DecisionTreeView v-if="current.decisionTree" :decision-tree="current.decisionTree" />
    <MazeView v-if="current.maze" :maze="current.maze" />
    <KmpView v-if="current.kmp" :kmp="current.kmp" :locale="props.locale" />
    <ManacherView v-if="current.manacher" :manacher="current.manacher" :locale="props.locale" />
    <SudokuView v-if="current.sudoku" :sudoku="current.sudoku" />
    <SuffixArrayView
      v-if="current.suffixArray"
      :suffix-array="current.suffixArray"
      :locale="props.locale"
    />
    <SieveView v-if="current.sieve" :sieve="current.sieve" />
    <GcdView v-if="current.gcd" :gcd="current.gcd" />
    <PowerView v-if="current.power" :power="current.power" :locale="props.locale" />
    <HullView v-if="current.hull" :hull="current.hull" />
    <NetworkView v-if="current.network" :network="current.network" />
    <AuxView v-if="current.aux" :aux="current.aux" :main-array="current.array" />
    <StackView v-if="current.stack" :stack="current.stack" :locale="props.locale" />
    <CountView v-if="current.count" :count="current.count" />
    <BucketView v-if="current.bucket" :bucket="current.bucket" />
    <p class="caption">{{ current.caption }}</p>
    <QuizCard
      v-if="activeQuizVisible && current.quiz"
      :quiz="current.quiz"
      :locale="props.locale"
      @answered="onQuizAnswered"
      @resume="onQuizResume"
    />
    <p v-if="atEnd && quizTotal > 0" class="quiz-score">
      {{ props.locale === 'en' ? 'Quiz score:' : '📊 本页测验：' }} {{ quizCorrect }} /
      {{ quizTotal }}
    </p>
    <div class="middle row">
      <CodePanel class="code-pane" :sources="props.module.sources" :point="current.point" />
      <VariablePanel class="var-pane" :vars="current.vars" :prev="prevVars" />
    </div>
    <TransportControls
      :is-playing="isPlaying"
      :at-start="atStart"
      :at-end="atEnd"
      :index="index"
      :total="total"
      :speed="speed"
      :loop="loop"
      :locale="props.locale"
      @play="play"
      @pause="pause"
      @step-back="stepBackward"
      @step-forward="stepForward"
      @reset="reset"
      @seek="seek"
      @set-speed="setSpeed"
      @toggle-loop="toggleLoop"
    />
  </div>
</template>
<style scoped lang="less">
.algo-player {
  gap: 16px;
  width: 100%;
}
.caption {
  font-weight: bold;
  font-size: 16px;
  min-height: 24px;
}
.quiz-score {
  font-weight: bold;
  font-size: 15px;
  color: #1f5e3a;
}
.middle {
  gap: 16px;
  width: 100%;
  align-items: stretch;
}
.code-pane {
  flex: 2;
  min-width: 0;
}
.var-pane {
  flex: 1;
  min-width: 160px;
}
@media (max-width: @screen-max-width) {
  .middle {
    flex-direction: column;
  }
}
</style>
