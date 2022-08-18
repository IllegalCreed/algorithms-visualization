<script setup lang='ts'>
import Splash from './Splash/Splash.vue';
import Main from './Main/Main.vue';
import { useControlHeaderShadow } from './hooks'

useControlHeaderShadow();
</script>
<template>
  <div id="home">
    <Splash></Splash>
    <Main></Main>
  </div>
</template>
<style lang='less'>
#home {
  background-color: @neumorphis-background;
  min-width: @screen-min-width;
  .column-stretch();
}
</style>