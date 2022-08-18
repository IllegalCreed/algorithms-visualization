<script setup lang='ts'>
import Splash from './Splash/Splash.vue';
import Main from './Main/Main.vue';
import Footer from './Footer/Footer.vue';
import { useControlHeaderShadow } from './hooks';

useControlHeaderShadow();
</script>
<template>
  <div id="home">
    <Splash></Splash>
    <Main></Main>
    <Footer></Footer>
  </div>
</template>
<style lang='less'>
#home {
  background-color: @neumorphis-background;
  min-width: @screen-min-width;
  .column-stretch();
}
</style>