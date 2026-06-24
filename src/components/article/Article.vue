<!-- 知识页排版骨架：限阅读宽度 + 给 slot 内的语义标签统一排版 -->
<template>
  <article class="article"><slot /></article>
</template>
<style scoped lang="less">
.article {
  max-width: 720px;
  margin: 0 auto;
  padding: 8px 8px 48px;
  color: @font-color;
  line-height: 1.85;
}
// slot 内容由父页面传入，需用 :slotted 才能命中
.article :slotted(h1) {
  font-size: 30px;
  margin: 0 0 4px;
  letter-spacing: 1px;
}
.article :slotted(.sub) {
  color: #888;
  font-size: 14px;
  margin-bottom: 32px;
}
.article :slotted(h2) {
  font-size: 21px;
  margin: 40px 0 14px;
  padding-left: 12px;
  border-left: 4px solid @font-highlight-color;
}
.article :slotted(h3) {
  font-size: 17px;
  margin: 24px 0 10px;
}
.article :slotted(p) {
  margin: 14px 0;
  font-size: 16px;
}
.article :slotted(ul) {
  padding-left: 22px;
}
.article :slotted(li) {
  margin: 6px 0;
  font-size: 16px;
}
.article :slotted(strong) {
  color: darken(@font-highlight-color, 10%);
}
.article :slotted(code) {
  font-size: 14px;
  padding: 2px 7px;
  margin: 0 1px;
  .neumorphism-pressed(2px, 6px);
}
</style>
