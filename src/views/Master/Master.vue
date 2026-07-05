<script setup lang="ts">
import Header from './Header/Header.vue';
import SearchPalette from '@/components/SearchPalette.vue';
</script>

<template>
  <div id="master">
    <Header></Header>
    <SearchPalette />
    <RouterView></RouterView>
  </div>
</template>

<style scoped lang="less">
#master {
  background-color: @neumorphis-background;
  color: @font-color;
}
</style>
