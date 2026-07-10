<script setup lang="ts">
const privacyUrl = `${import.meta.env.BASE_URL}privacy.html`;
</script>
<template>
  <footer id="footer">
    <span>MIT Licensed | Copyright © 2022-PRESENT Zhang Xu</span>
    <a :href="privacyUrl">隐私与统计</a>
  </footer>
</template>
<style scoped lang="less">
#footer {
  height: 100px;
  gap: 18px;
  .neumorphism-flat (5px, 0px);
  .center();

  a {
    color: @font-highlight-color;
    font-weight: bold;
  }
}

@media (max-width: @screen-max-width) {
  #footer {
    width: 100vw;
    max-width: 100vw;
    height: auto;
    min-height: 100px;
    padding: 20px;
    flex-direction: column;
    gap: 8px;
    text-align: center;

    span {
      max-width: 100%;
    }
  }
}
</style>
