<script setup lang='ts'>
import HeaderComp from './Header/Header.vue'
import { useCategoryData, useMenuSelect } from './hooks';

const categoryData = useCategoryData();
useMenuSelect();

</script>
<template>
  <div id="menu">
    <HeaderComp v-for="item in categoryData" :key="item.title" :data="item"></HeaderComp>
  </div>
</template>
<style scoped lang='less'>
#menu {
  padding: 30px;
}
</style>