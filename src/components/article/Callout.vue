<!-- 知识页提示/旁注框（新拟物浮起卡片） -->
<template>
  <div class="callout"><slot /></div>
</template>
<style scoped lang="less">
.callout {
  margin: 22px 0;
  padding: 14px 18px;
  font-size: 15px;
  line-height: 1.95;
  color: @font-color;
  .neumorphism-flat(4px, 14px);
}
.callout :slotted(b) {
  color: @font-highlight-color;
}
</style>
