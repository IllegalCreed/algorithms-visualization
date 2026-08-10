<script setup lang="ts"></script>
<template>
  <div class="main">
    <RouterView></RouterView>
  </div>
</template>
<style scoped lang="less">
.main {
  padding: 20px;
}

@media (max-width: @mobile-max-width) {
  .main {
    padding: 0;
  }
}
</style>
