<script setup lang='ts'>
const props = defineProps<{
  data: [string, number]
  percent: number
}>()
</script>
<template>
  <div class="block center" :style="{ 'background-color': 'rgba(0,200,50,' + props.percent + ')' }">
    <span :style="{ 'color': props.percent < 0.5 ? 'block' : 'white' }">{{ props.data[1] }}</span>
  </div>
</template>
<style scoped lang='less'>
.block {
  width: 50px;
  height: 50px;
  .neumorphism-flat(3px, 50%);

  &:not(:first-child) {
    margin-left: 10px;
  }

  span {
    font-weight: bold;
    font-size: 18px;
  }
}
</style>