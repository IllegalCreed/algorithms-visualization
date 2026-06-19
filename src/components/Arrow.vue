<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ color: string }>();

// 把 store 的语义色（red/blue/...）映射成柔一档的展示色，更贴新拟物风；
// 非预设色按原值透传
const SOFT_COLOR: Record<string, string> = {
  red: '#e5686b',
  blue: '#5a8ee0',
  yellow: '#e0b34a',
  green: '#67c184',
};
const stroke = computed(() => SOFT_COLOR[props.color] ?? props.color);
</script>
<template>
  <svg class="chevron" width="50" height="30" viewBox="0 0 50 30" fill="none">
    <path
      d="M12 21 L25 9 L38 21"
      :stroke="stroke"
      stroke-width="6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
<style scoped lang="less">
.chevron {
  // 新拟物柔和浮起：右下暗影 + 左上亮影（取自 @neumorphis-background）
  filter: drop-shadow(1.5px 1.5px 1.5px darken(@neumorphis-background, 15%))
    drop-shadow(-1.5px -1.5px 1.5px lighten(@neumorphis-background, 15%));
}
</style>
