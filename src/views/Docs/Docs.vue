<script setup lang='ts'>
import MenuComp from './Menu/Menu.vue';
import MainComp from './Main/Main.vue';
import { useControlHeaderShadow } from './hooks';

useControlHeaderShadow();
</script>
<template>
  <div id="docs">
    <div id="left">
      <MenuComp></MenuComp>
    </div>
    <div id="right">
      <MainComp></MainComp>
    </div>
  </div>
</template>
<style lang='less'>
#docs {
  height: 100vh;
  width: 100vw;
  padding-top: 100px;
  .row();
  align-items: stretch;

  @media screen {
    #left {
      width: @slider-width;
      overflow-y: auto;
    }

    #right {
      width: calc(100vw - @slider-width);
      background-color: blue;
      overflow-y: auto;
    }

    @media (min-width:@screen-max-width) {
      #left {
        width: calc((100vw - @screen-max-width) / 2 + @slider-width);
        padding-left: calc((100vw - @screen-max-width) / 2);
      }

      #right {
        width: calc(100vw - (100vw - @screen-max-width) / 2 - @slider-width);
        background-color: blue;
        padding-right: calc((100vw - @screen-max-width) / 2);
      }
    }
  }

}
</style>