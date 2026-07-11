<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import { getEnglishLearningPaths } from '@/i18n/catalog';

const learningPaths = getEnglishLearningPaths().map((path) => ({
  ...path,
  steps: path.steps.map((page) => ({
    name: page.en.name,
    title: page.en.heading,
    category: page.en.category,
  })),
}));
</script>

<template>
  <Article>
    <h1>Algorithm Learning Paths</h1>
    <p class="sub">Focused routes through every translated learning page in the catalog</p>

    <p>
      Each route is intentionally small. Work through the pages in order, use the player controls
      instead of passively watching, and check the
      <RouterLink :to="{ name: 'en-complexity' }">complexity reference</RouterLink>
      whenever two approaches feel similar.
    </p>

    <section v-for="path in learningPaths" :key="path.id" class="learning-path">
      <h2>
        {{ path.title }}
        <span>{{ path.steps.length }} stops</span>
      </h2>
      <p>{{ path.description }}</p>
      <ol>
        <li v-for="(step, index) in path.steps" :key="step.name">
          <span class="step-number">{{ index + 1 }}</span>
          <RouterLink :to="{ name: step.name }" :title="step.category">
            {{ step.title }}
          </RouterLink>
          <span v-if="index < path.steps.length - 1" class="arrow">-&gt;</span>
        </li>
      </ol>
    </section>
  </Article>
</template>

<style scoped lang="less">
.learning-path {
  margin-top: 28px;
  padding: 16px 20px;
  .neumorphism-flat(4px, 8px);

  h2 {
    display: flex;
    align-items: baseline;
    gap: 12px;

    span {
      color: #1f5e3a;
      font-size: 13px;
      font-weight: normal;
    }
  }

  p {
    color: #6b7d72;
    font-size: 14px;
  }

  ol {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  a {
    color: @font-highlight-color;
    font-size: 14px;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.step-number {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #1f5e3a;
  background: #dcebe0;
  font-size: 11px;
  font-weight: bold;
  .center();
}

.arrow {
  color: #9eaca2;
  font-weight: bold;
}
</style>
