<script setup lang='ts'>
import { IconLink } from './types';

const props = defineProps<{
  data: IconLink
}>();

function linkTo(): void {
  window.open(props.data.url);
}

</script>
<template>
  <div class="icon-link" :title="props.data.title" @click="linkTo">
    <img :src="props.data.src" />
  </div>
</template>
<style scoped lang='less'>
.icon-link {
  width: 40px;
  height: 40px;
  .neumorphism-btn(4px, 50%);
  .center();

  img {
    width: 30px;
    height: 30px;
  }
}
</style>