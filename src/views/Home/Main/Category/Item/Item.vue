<script setup lang="ts">
import type { Item } from '../../types';

const props = defineProps<{
  data: Item;
}>();
</script>
<template>
  <RouterLink class="item" :to="{ name: props.data.url }">
    <img
      :src="props.data.icon"
      :alt="props.data.title"
      width="60"
      height="60"
      loading="lazy"
      decoding="async"
    />

    <h3>{{ props.data.title }}</h3>
    <span>{{ props.data.desc }}</span>
  </RouterLink>
</template>
<style scoped lang="less">
.item {
  width: 280px;
  padding: 30px;
  color: inherit;
  text-decoration: none;
  .column-center();
  .neumorphism-btn(4px, 10px);

  img {
    width: 60px;
    height: 60px;
    padding: 10px;
    .neumorphism-pressed(4px, 50%);
  }

  span {
    font-weight: lighter;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
  }
}

@media (max-width: @mobile-max-width) {
  .item {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr);
    grid-template-areas:
      'icon title'
      'icon description';
    width: 100%;
    min-height: 92px;
    padding: 16px;
    column-gap: 14px;
    align-items: center;

    img {
      grid-area: icon;
      width: 52px;
      height: 52px;
      padding: 8px;
    }

    h3 {
      grid-area: title;
      margin: 0 0 4px;
      text-align: left;
    }

    span {
      grid-area: description;
      text-align: left;
      line-height: 1.5;
    }
  }
}
</style>
