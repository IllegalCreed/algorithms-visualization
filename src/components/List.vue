<script setup lang='ts'>
import { computed } from '@vue/reactivity';
import BlockComp from './Block.vue'

const props = defineProps<{
  data: [string, number][]
}>()

const maxValue = computed(() => {
  let numArray = props.data.map((item) => {
    return item[1];
  })

  return Math.max(...numArray);
})

const minValue = computed(() => {
  let numArray = props.data.map((item) => {
    return item[1];
  })

  return Math.min(...numArray);
})

function genPercent(item: number): number {
  let offset = item - minValue.value;
  let total = maxValue.value - minValue.value;

  return offset / total;
}
</script>
<template>
  <TransitionGroup name="list" tag="div" class="row">
    <BlockComp v-for="item in props.data" :key="item[0]" :data="item" :percent="genPercent(item[1])"></BlockComp>
  </TransitionGroup>
</template>
<style scoped lang='less'>
.list-move,
/* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>