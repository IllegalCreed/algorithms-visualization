<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import ListComp from '@/components/List.vue';
import ArrowTrackComp from '@/components/ArrowTrack.vue';
import type { Pointer } from '@/types/types';
import { useSystemStore } from '@/store/modules/system';
import { bubbleSortSteps } from '@/algorithms/bubble-sort';

// 将初始值定义为函数方便还原
const getInitialNum = () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];

const numArray: [string, number][] = reactive<[string, number][]>(genNumberData(getInitialNum()));

function genNumberData(data: Array<number>): [string, number][] {
  return data.map((value, index) => {
    return [index.toString(), value];
  });
}

const genInitialPointer = () => [0, 0];

const pointerArray = reactive<Array<Pointer>>(genPointerData(genInitialPointer()));

function genPointerData(data: Array<number>): Array<Pointer> {
  return data.map((value, index) => {
    return { id: index.toString(), index: value };
  });
}

const colors = useSystemStore().colors;

const updateFirstPointerValue = () => numArray[pointerArray[0].index][1];
const updateSecondPointerValue = () => numArray[pointerArray[1].index][1];

const firstPointerValue = ref<number>(updateFirstPointerValue());
const secondPointerValue = ref<number>(updateSecondPointerValue());

const compareTwoValue = computed(() => {
  return firstPointerValue.value > secondPointerValue.value;
});

async function doSort() {
  const steps = bubbleSortSteps(getInitialNum());
  for (const step of steps) {
    const [i, j] = step.compare;
    pointerArray[0].index = i;
    pointerArray[1].index = j;
    firstPointerValue.value = numArray[i][1];
    secondPointerValue.value = numArray[j][1];
    await delay(500);
    if (step.swapped) {
      const temp = numArray[i];
      numArray[i] = numArray[j];
      numArray[j] = temp;
    }
    await delay(1000);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

doSort();
</script>
<template>
  <div class="column">
    <ListComp :data="numArray"></ListComp>
    <ArrowTrackComp :data="pointerArray"></ArrowTrackComp>
    <div class="row expression">
      <span :style="{ color: colors[0] }">{{ firstPointerValue }}</span>
      >
      <span :style="{ color: colors[1] }">{{ secondPointerValue }}</span>
      =
      <span>{{ compareTwoValue }}</span>
    </div>
  </div>
</template>
<style scoped lang="less">
.expression {
  font-weight: bold;
  font-size: 20px;
}
</style>
