<script setup lang="ts">
import type { Item } from '../../types';
import { inject } from 'vue';

const props = defineProps<{
  data: Item;
}>();

const currentSelectMenuItemKey = inject('currentSelectMenuItemKey');
</script>
<template>
  <RouterLink
    :to="{ name: props.data.url }"
    :class="['item', 'btn', currentSelectMenuItemKey == props.data.url ? 'item-pressed' : null]"
  >
    <span>{{ props.data.title }}</span>
  </RouterLink>
</template>
<style scoped lang="less">
.item {
  display: block;
  margin-left: 30px;
  font-size: 18px;
  color: inherit;
  text-decoration: none;
  transition:
    color 0.5s ease,
    box-shadow 0.5s ease;
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
