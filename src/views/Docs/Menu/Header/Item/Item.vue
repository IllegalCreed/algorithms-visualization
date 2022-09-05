<script setup lang='ts'>
import { useRouter } from 'vue-router';
import { Item } from '../../types';
import { inject } from 'vue'

const props = defineProps<{
  data: Item
}>();

const currentSelectMenuItemKey = inject('currentSelectMenuItemKey')

const router = useRouter();

function goDocs(): void {
  router.push({
    name: props.data.url,
  })
}
</script>
<template>
  <div :class="['item', 'btn', currentSelectMenuItemKey == props.data.url ? 'item-pressed' : null]" @click="goDocs">
    <span>{{ props.data.title }}</span>
  </div>
</template>
<style scoped lang='less'>
.item {
  margin-left: 30px;
  font-size: 18px;
  transition: all 0.5s ease;
  padding: 5px 15px;


  &:not(:first-child) {
    margin-top: 8px;
  }

  &:hover {
    color: @font-highlight-color;
  }
}

.item-pressed {
  .neumorphism-pressed(2px, 5px);
}
</style>