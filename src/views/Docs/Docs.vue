<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import MenuComp from './Menu/Menu.vue';
import MainComp from './Main/Main.vue';
import MobileNavigationActions from '@/views/Master/Header/MobileNavigationActions.vue';
import { useControlHeaderShadow, useDocsMobileDrawer, useDocsMobileViewport } from './hooks';

useControlHeaderShadow();
const route = useRoute();
const isEnglish = computed(() => route.path.startsWith('/en'));
const drawerTitle = computed(() => (isEnglish.value ? 'Table of contents' : '文章目录'));
const closeLabel = computed(() => (isEnglish.value ? 'Close table of contents' : '关闭文章目录'));
const rightRef = ref<HTMLElement | null>(null);
const drawerRef = ref<HTMLElement | null>(null);
const { isMobile } = useDocsMobileViewport();
const { drawerOpen, closeDrawer, onDrawerKeydown } = useDocsMobileDrawer({
  isMobile,
  drawerRef,
});

async function resetArticleViewport(path: string): Promise<void> {
  // The initial Docs mount can happen before the lazy article child has
  // painted (notably Home → Search → Enter). Keep the reset/focus operation
  // tied to this route and retry a few frames instead of leaving focus on
  // the mobile trigger.
  await nextTick();
  const right = rightRef.value;
  if (!right) return;
  right.scrollTop = 0;
  if (window.innerWidth <= 899) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (route.fullPath !== path) return;
    const heading = right.querySelector<HTMLElement>('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      return;
    }
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await nextTick();
  }
}

watch(
  () => route.fullPath,
  (path) => void resetArticleViewport(path),
  { immediate: true },
);
onMounted(() => void resetArticleViewport(route.fullPath));
</script>
<template>
  <div id="docs">
    <div id="left">
      <MenuComp></MenuComp>
    </div>
    <div id="right" ref="rightRef">
      <MainComp></MainComp>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="drawerOpen" class="docs-drawer-overlay" @click.self="closeDrawer">
      <aside
        id="docs-menu-drawer"
        ref="drawerRef"
        class="docs-menu-drawer"
        role="dialog"
        aria-modal="true"
        :aria-label="drawerTitle"
        @keydown="onDrawerKeydown"
      >
        <div class="docs-drawer-header">
          <h2>{{ drawerTitle }}</h2>
          <button type="button" :aria-label="closeLabel" @click="closeDrawer">×</button>
        </div>
        <MobileNavigationActions @navigate="closeDrawer" />
        <MenuComp />
      </aside>
    </div>
  </Teleport>
</template>
<style lang="less">
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
      overflow-y: auto;
    }

    @media (min-width: @screen-max-width) {
      #left {
        width: calc((100vw - @screen-max-width) / 2 + @slider-width);
        padding-left: calc((100vw - @screen-max-width) / 2);
      }

      #right {
        width: calc(100vw - (100vw - @screen-max-width) / 2 - @slider-width);
        padding-right: calc((100vw - @screen-max-width) / 2);
      }
    }
  }
}

.docs-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  background: rgba(60, 66, 62, 0.38);
}

.docs-menu-drawer {
  width: min(340px, calc(100vw - 28px));
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background-color: @neumorphis-background;
  box-shadow: 18px 0 45px rgba(0, 0, 0, 0.2);
}

.docs-drawer-header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  background-color: @neumorphis-background;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  button {
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    color: @font-color;
    font-size: 28px;
    cursor: pointer;
    .neumorphism-btn(3px, 50%);
  }
}

@media (max-width: @mobile-max-width) {
  #docs {
    width: 100%;
    height: auto;
    min-height: 100dvh;
    padding-top: 64px;
    display: block;

    #left {
      display: none;
    }

    #right {
      width: 100%;
      height: auto;
      min-height: calc(100dvh - 64px);
      min-width: 0;
      overflow-x: hidden;
      overflow-y: visible;
      padding: 0;
      -webkit-overflow-scrolling: touch;
    }
  }
}
</style>
