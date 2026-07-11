<script setup lang="ts">
import CategoryComp from '@/views/Home/Main/Category/Category.vue';
import Footer from '@/views/Home/Footer/Footer.vue';
import { useControlHeaderShadow } from '@/views/Home/hooks';
import { getEnglishAlgorithmPages, LOCALIZED_PAGE_PAIRS } from '@/i18n/catalog';
import { getEnglishHomeCategories } from './homeCatalog';

const categories = getEnglishHomeCategories();
const pageCount = LOCALIZED_PAGE_PAIRS.length;
const algorithmCount = getEnglishAlgorithmPages().length;
useControlHeaderShadow();
</script>

<template>
  <div id="english-home" :data-page-count="pageCount" :data-content-count="pageCount - 1">
    <section class="english-splash">
      <p class="eyebrow">Interactive algorithm learning</p>
      <h1>Algorithm Visualizer</h1>
      <p class="lead">
        See each decision, state change, and line of code. This English catalog contains
        {{ pageCount }} focused pages built from the same tested visual engines as the full Chinese
        catalog.
      </p>
      <div class="splash-actions">
        <RouterLink class="primary-action" :to="{ name: 'en-quick-sort' }">
          Start with Quick Sort
        </RouterLink>
        <RouterLink class="secondary-action" :to="{ name: 'en-paths' }">
          Choose a learning path
        </RouterLink>
      </div>
      <a class="catalog-cue" href="#english-catalog">Browse the catalog</a>
    </section>

    <section id="english-catalog" class="english-catalog" aria-labelledby="catalog-heading">
      <h2 id="catalog-heading">{{ pageCount }} pages, one coherent learning catalog</h2>
      <p>
        Use the tools first, or jump directly into one of {{ algorithmCount }} translated
        algorithms.
      </p>
    </section>
    <CategoryComp v-for="category in categories" :key="category.title" :data="category" />
    <Footer />
  </div>
</template>

<style scoped lang="less">
#english-home {
  min-width: @screen-min-width;
  background-color: @neumorphis-background;
  .column-stretch();
}

.english-splash {
  min-height: 82vh;
  padding: 150px 30px 70px;
  text-align: center;
  .column();
  .center();

  .eyebrow {
    margin: 0 0 12px;
    color: #1f5e3a;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: 64px;
    letter-spacing: 0;
  }

  .lead {
    max-width: 720px;
    margin: 24px auto 36px;
    color: #6b7d72;
    font-size: 20px;
    line-height: 1.7;
  }
}

.splash-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;

  a {
    padding: 12px 22px;
    color: inherit;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    .neumorphism-btn(3px, 8px);
  }

  .primary-action {
    color: #1f5e3a;
  }
}

.catalog-cue {
  margin-top: 46px;
  color: #6b7d72;
  font-size: 13px;
  text-decoration: none;
}

.english-catalog {
  max-width: 760px;
  margin: 0 auto 58px;
  padding: 0 30px;
  text-align: center;

  h2 {
    margin: 0 0 12px;
    font-size: 30px;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #6b7d72;
    font-size: 16px;
  }
}

@media (max-width: 760px) {
  .english-splash h1 {
    font-size: 46px;
  }

  .english-splash .lead {
    font-size: 17px;
  }
}
</style>
