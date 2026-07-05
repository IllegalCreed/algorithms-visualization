<!-- src/views/Article/Paths.vue —— 学习路径页（C-115，M11-S3）：四条推荐路线，步骤链直达 -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import { LEARNING_PATHS } from '@/data/paths';
import { useCategoryData } from '@/views/Home/Main/hooks';

const lookup = new Map<string, { title: string; category: string }>();
for (const cat of useCategoryData()) {
  for (const item of cat.children) {
    lookup.set(item.url, { title: item.title, category: cat.title });
  }
}
const nameOf = (url: string): string => lookup.get(url)?.title ?? url;
const catOf = (url: string): string => lookup.get(url)?.category ?? '';
</script>

<template>
  <Article>
    <h1>学习路径</h1>
    <p class="sub">不知道从哪开始？四条走过验证的路线，按顺序点下去就行</p>

    <section v-for="p in LEARNING_PATHS" :key="p.id" class="lp-card">
      <h2>
        {{ p.emoji }} {{ p.title }}<span class="lp-count">{{ p.steps.length }} 站</span>
      </h2>
      <p class="lp-desc">{{ p.desc }}</p>
      <ol class="lp-steps">
        <li v-for="(s, i) in p.steps" :key="s" class="lp-step">
          <span class="lp-idx">{{ i + 1 }}</span>
          <router-link :to="`/docs/${s}`" :title="catOf(s)">{{ nameOf(s) }}</router-link>
          <span v-if="i < p.steps.length - 1" class="lp-arrow">→</span>
        </li>
      </ol>
    </section>
  </Article>
</template>

<style scoped lang="less">
.lp-card {
  margin-top: 26px;
  padding: 16px 20px;
  .neumorphism-flat(4px, 14px);

  h2 {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .lp-count {
    font-size: 13px;
    font-weight: normal;
    color: #1f5e3a;
  }
  .lp-desc {
    margin: 8px 0 12px;
    font-size: 14px;
    color: #6b7d72;
  }
}
.lp-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 6px;
}
.lp-step {
  display: flex;
  align-items: center;
  gap: 6px;

  .lp-idx {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 11px;
    font-weight: bold;
    color: #1f5e3a;
    background: #dcebe0;
  }
  a {
    font-size: 14px;
    font-weight: bold;
    color: @font-highlight-color;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  .lp-arrow {
    color: #b9c6bd;
    font-weight: bold;
  }
}
</style>
