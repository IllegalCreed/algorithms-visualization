<!-- src/components/player/AlgorithmPlayer.vue -->
<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  shallowRef,
  useId,
  watch,
} from 'vue';
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
const paneLabels = computed(() =>
  props.locale === 'en'
    ? {
        visual: 'Visualization',
        explanation: 'Step explanation',
        inspector: 'Code and variables',
      }
    : {
        visual: '可视化',
        explanation: '步骤说明',
        inspector: '代码与变量',
      },
);
const inspectorTab = ref<'code' | 'vars'>('code');
const inspectorPaneRef = ref<HTMLElement | null>(null);
const inspectorMediaQuery = '(max-width: 899px)';
const isMobileInspector = ref(
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(inspectorMediaQuery).matches
    : false,
);
let inspectorMedia: MediaQueryList | undefined;
const inspectorId = `inspector-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
const inspectorLabels = computed(() =>
  props.locale === 'en'
    ? { list: 'Inspector panels', code: 'Code', vars: 'Variables' }
    : { list: '检查面板', code: '代码', vars: '变量' },
);

function onInspectorTabKeydown(event: KeyboardEvent, tab: 'code' | 'vars'): void {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  const tabs = Array.from(
    (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]',
    ) ?? [],
  );
  if (tabs.length < 2) return;
  const currentIndex = tab === 'code' ? 0 : 1;
  const nextIndex =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  const nextTab = nextIndex === 0 ? 'code' : 'vars';
  event.preventDefault();
  inspectorTab.value = nextTab;
  tabs[nextIndex]?.focus();
}

function syncInspectorMode(matches: boolean): void {
  const activeElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const focusedTabWillDisappear =
    isMobileInspector.value && !matches && !!activeElement?.closest('.inspector-tabs');
  const focusedDesktopPanel =
    !isMobileInspector.value && matches
      ? activeElement?.closest<HTMLElement>('.code-pane, .var-pane')
      : null;
  const mobilePanelToFocus = focusedDesktopPanel?.classList.contains('var-pane') ? 'vars' : 'code';
  if (focusedDesktopPanel) inspectorTab.value = mobilePanelToFocus;
  isMobileInspector.value = matches;
  if (!focusedTabWillDisappear && !focusedDesktopPanel) return;

  void nextTick(() => {
    if (matches) {
      document.getElementById(`${inspectorId}-tab-${mobilePanelToFocus}`)?.focus();
    } else {
      const selector = inspectorTab.value === 'code' ? '.code-pane' : '.var-pane';
      inspectorPaneRef.value?.querySelector<HTMLElement>(selector)?.focus();
    }
  });
}

function onInspectorMediaChange(event: MediaQueryListEvent): void {
  syncInspectorMode(event.matches);
}

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

// C-111/C-140 键盘快捷键：→/←/空格；交互控件聚焦时完全交给控件自己的
// keyboard interaction，避免按钮上的 Space 同时触发原生 click 和播放器全局切换。
function isInteractiveKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement) && !(target instanceof SVGElement)) return false;
  const element = target as HTMLElement;
  if (element.isContentEditable || element.closest('[contenteditable="true"]')) return true;
  return !!element.closest(
    [
      'button',
      'a[href]',
      'input',
      'textarea',
      'select',
      'option',
      '[role="button"]',
      '[role="link"]',
      '[role="checkbox"]',
      '[role="radio"]',
      '[role="switch"]',
      '[role="tab"]',
      '[role="tabpanel"]',
      '[role="combobox"]',
      '[role="slider"]',
      '[role="spinbutton"]',
      '[role="textbox"]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(','),
  );
}

function onKeydown(e: KeyboardEvent): void {
  if (activeQuizVisible.value) return;
  if (isInteractiveKeyboardTarget(e.target)) return;
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    stepForward();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    stepBackward();
  } else if (e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {
    e.preventDefault(); // 防页面滚动
    if (isPlaying.value) pause();
    else play();
  }
}
onMounted(() => {
  window.addEventListener('keydown', onKeydown);
  if (typeof window.matchMedia === 'function') {
    inspectorMedia = window.matchMedia(inspectorMediaQuery);
    syncInspectorMode(inspectorMedia.matches);
    inspectorMedia.addEventListener('change', onInspectorMediaChange);
  }
});
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  inspectorMedia?.removeEventListener('change', onInspectorMediaChange);
});

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
  <div class="algo-player column">
    <InputBar
      v-if="props.module.inputSpec"
      :spec="props.module.inputSpec"
      :model-text="inputText"
      :locale="props.locale"
      @apply="applyInput"
      @restore="restoreInput"
    />
    <div class="player-stage">
      <section class="visual-pane" :aria-label="paneLabels.visual">
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
      </section>
      <section class="explanation-pane" :aria-label="paneLabels.explanation">
        <p class="caption" role="status" aria-live="polite" aria-atomic="true">
          {{ current.caption }}
        </p>
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
      </section>
      <aside ref="inspectorPaneRef" class="inspector-pane" :aria-label="paneLabels.inspector">
        <div
          v-if="isMobileInspector"
          class="inspector-tabs"
          role="tablist"
          :aria-label="inspectorLabels.list"
        >
          <button
            type="button"
            class="inspector-tab"
            role="tab"
            :id="`${inspectorId}-tab-code`"
            :aria-selected="inspectorTab === 'code'"
            :aria-controls="`${inspectorId}-code`"
            :tabindex="inspectorTab === 'code' ? 0 : -1"
            @click="inspectorTab = 'code'"
            @keydown="onInspectorTabKeydown($event, 'code')"
          >
            {{ inspectorLabels.code }}
          </button>
          <button
            type="button"
            class="inspector-tab"
            role="tab"
            :id="`${inspectorId}-tab-vars`"
            :aria-selected="inspectorTab === 'vars'"
            :aria-controls="`${inspectorId}-vars`"
            :tabindex="inspectorTab === 'vars' ? 0 : -1"
            @click="inspectorTab = 'vars'"
            @keydown="onInspectorTabKeydown($event, 'vars')"
          >
            {{ inspectorLabels.vars }}
          </button>
        </div>
        <CodePanel
          class="code-pane"
          :class="{ 'mobile-panel-off': isMobileInspector && inspectorTab !== 'code' }"
          :id="`${inspectorId}-code`"
          :role="isMobileInspector ? 'tabpanel' : 'region'"
          :aria-labelledby="isMobileInspector ? `${inspectorId}-tab-code` : undefined"
          :aria-label="!isMobileInspector ? inspectorLabels.code : undefined"
          :tabindex="!isMobileInspector ? -1 : undefined"
          :sources="props.module.sources"
          :point="current.point"
          :locale="props.locale"
        />
        <VariablePanel
          class="var-pane"
          :class="{ 'mobile-panel-off': isMobileInspector && inspectorTab !== 'vars' }"
          :id="`${inspectorId}-vars`"
          :role="isMobileInspector ? 'tabpanel' : 'region'"
          :aria-labelledby="isMobileInspector ? `${inspectorId}-tab-vars` : undefined"
          :aria-label="!isMobileInspector ? inspectorLabels.vars : undefined"
          :tabindex="!isMobileInspector ? -1 : undefined"
          :vars="current.vars"
          :prev="prevVars"
          :locale="props.locale"
        />
      </aside>
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
  align-items: stretch;
}
.player-stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.82fr);
  grid-template-rows: auto auto;
  grid-template-areas:
    'visual inspector'
    'explanation inspector';
  gap: 16px;
  width: 100%;
  align-items: start;
}
.visual-pane {
  grid-area: visual;
  display: flex;
  align-self: stretch;
  min-width: 0;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  .neumorphism-flat(4px, 12px);
}
.explanation-pane {
  grid-area: explanation;
  display: flex;
  align-self: stretch;
  min-width: 0;
  width: 100%;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  .neumorphism-flat(4px, 12px);
}
.inspector-pane {
  grid-area: inspector;
  display: grid;
  grid-template-rows: subgrid;
  min-width: 0;
  width: 100%;
  align-self: start;
  gap: 16px;
  position: sticky;
  top: 16px;
  // 代码/变量卡片的拟物阴影必须能绘制到自身边界之外；滚动由代码区和页面承担。
  overflow: visible;
}
.inspector-tabs {
  display: none;
}
.caption {
  margin: 0;
  font-weight: bold;
  font-size: 16px;
  min-height: 24px;
}
.quiz-score {
  font-weight: bold;
  font-size: 15px;
  color: #1f5e3a;
}
.code-pane {
  min-width: 0;
  width: 100%;
}
.var-pane {
  min-width: 0;
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
}
@media (max-width: 1179px) {
  .player-stage {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto;
    grid-template-areas:
      'visual'
      'explanation'
      'inspector';
  }
  .inspector-pane {
    grid-template-rows: auto auto;
    position: static;
    overflow: visible;
  }
  .var-pane {
    max-height: none;
    overflow: visible;
  }
}

@media (max-width: @mobile-max-width) {
  .algo-player,
  .player-stage,
  .inspector-pane {
    gap: 12px;
    min-width: 0;
    max-width: 100%;
  }

  .visual-pane {
    max-width: 100%;
    padding: 10px 8px;
    overscroll-behavior-inline: contain;
  }

  .explanation-pane {
    padding: 14px 12px;
  }

  .inspector-pane {
    display: flex;
    flex-direction: column;
  }

  .inspector-tabs {
    display: flex;
    gap: 6px;
    padding: 4px;
    border-radius: 10px;
    .neumorphism-concave(2px, 10px);
  }

  .inspector-tab {
    flex: 1 1 0;
    min-height: 44px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: @font-color;
    font: inherit;
    cursor: pointer;
    touch-action: manipulation;
  }

  .inspector-tab[aria-selected='true'] {
    .neumorphism-pressed(2px, 8px);
    font-weight: bold;
  }

  .mobile-panel-off {
    display: none;
  }

  .caption {
    font-size: 15px;
    line-height: 1.55;
  }
}
</style>
