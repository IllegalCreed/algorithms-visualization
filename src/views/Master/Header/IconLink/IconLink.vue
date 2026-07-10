<script setup lang="ts">
import type { IconLink } from './types';
import { trackEvent } from '@/analytics/client';

const props = defineProps<{
  data: IconLink;
}>();

function trackShare(): void {
  const share = props.data.share;
  if (share) trackEvent('share', share);
}
</script>
<template>
  <a
    class="icon-link"
    :href="props.data.url"
    :title="props.data.title"
    :aria-label="props.data.title"
    target="_blank"
    rel="noopener noreferrer"
    @click="trackShare"
  >
    <img :src="props.data.src" :alt="props.data.title" />
  </a>
</template>
<style scoped lang="less">
.icon-link {
  width: 40px;
  height: 40px;
  color: inherit;
  text-decoration: none;
  .neumorphism-btn(4px, 50%);
  .center();

  img {
    width: 30px;
    height: 30px;
  }
}
</style>
