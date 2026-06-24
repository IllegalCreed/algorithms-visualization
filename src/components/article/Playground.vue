<!-- 知识页互动组件外框：新拟物卡片 + 左上角标 -->
<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: '亲手试试' });
</script>
<template>
  <div class="playground">
    <span class="tag">{{ title }}</span>
    <slot />
  </div>
</template>
<style scoped lang="less">
.playground {
  position: relative;
  margin: 26px 0;
  padding: 26px 20px 20px;
  .neumorphism-flat(6px, 18px);
}
.tag {
  position: absolute;
  top: -11px;
  left: 22px;
  font-size: 12px;
  font-weight: bold;
  color: @font-highlight-color;
  padding: 2px 12px;
  .neumorphism-flat(2px, 10px);
}
</style>
