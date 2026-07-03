<!-- src/components/player/AlgorithmPlayer.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { AlgorithmModule } from './types';
import { usePlayer } from './usePlayer';
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
import CodePanel from './CodePanel.vue';
import VariablePanel from './VariablePanel.vue';
import TransportControls from './TransportControls.vue';

const props = defineProps<{ module: AlgorithmModule }>();

const steps = props.module.buildSteps(props.module.initialInput());
const {
  index,
  isPlaying,
  atStart,
  atEnd,
  total,
  speed,
  current,
  play,
  pause,
  stepForward,
  stepBackward,
  seek,
  reset,
  setSpeed,
} = usePlayer(steps);

const prevVars = computed(() => steps[index.value - 1]?.vars);
</script>
<template>
  <div class="algo-player column center">
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
      @play="play"
      @pause="pause"
      @step-back="stepBackward"
      @step-forward="stepForward"
      @reset="reset"
      @seek="seek"
      @set-speed="setSpeed"
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
