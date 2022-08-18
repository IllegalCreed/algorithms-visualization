<script setup lang="ts">
import Header from './Header/Header.vue'
</script>

<template>
  <div id="master">
    <Header></Header>
    <RouterView></RouterView>
  </div>
</template>

<style scoped lang="less">
#master {
  background-color: @neumorphis-background;
  color: @font-color;
}
</style>