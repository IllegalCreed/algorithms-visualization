<!-- src/components/player/AlgorithmPlayer.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue';
import type { AlgorithmModule } from './types';
import { usePlayer } from './usePlayer';
import { clearInputFromUrl, readInputFromUrl, writeInputToUrl } from './inputSpec';
import InputBar from './InputBar.vue';
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

const props = defineProps<{ module: AlgorithmModule }>();

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

// C-111 键盘快捷键：→/←/空格；输入控件聚焦时不抢（InputBar 打字优先）
function onKeydown(e: KeyboardEvent): void {
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

function applyInput(arr: number[]): void {
  input.value = arr;
  steps.value = props.module.buildSteps(arr);
  reset();
  writeInputToUrl(arr);
}

function restoreInput(): void {
  input.value = props.module.initialInput();
  steps.value = props.module.buildSteps(input.value);
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
    <KmpView v-if="current.kmp" :kmp="current.kmp" />
    <ManacherView v-if="current.manacher" :manacher="current.manacher" />
    <SudokuView v-if="current.sudoku" :sudoku="current.sudoku" />
    <SuffixArrayView v-if="current.suffixArray" :suffix-array="current.suffixArray" />
    <SieveView v-if="current.sieve" :sieve="current.sieve" />
    <GcdView v-if="current.gcd" :gcd="current.gcd" />
    <PowerView v-if="current.power" :power="current.power" />
    <HullView v-if="current.hull" :hull="current.hull" />
    <NetworkView v-if="current.network" :network="current.network" />
    <AuxView v-if="current.aux" :aux="current.aux" :main-array="current.array" />
    <StackView v-if="current.stack" :stack="current.stack" />
    <CountView v-if="current.count" :count="current.count" />
    <BucketView v-if="current.bucket" :bucket="current.bucket" />
    <p class="caption">{{ current.caption }}</p>
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
