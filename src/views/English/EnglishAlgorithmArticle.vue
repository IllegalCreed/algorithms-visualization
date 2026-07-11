<script setup lang="ts">
import type { AlgorithmModule } from '@/components/player/types';
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { ENGLISH_FULL_PARITY_ADDITIONS } from '@/i18n/en/fullParityPages';

const props = defineProps<{
  slug: string;
  module: AlgorithmModule;
  idea: string;
  visualization: string;
  invariant: string;
  applications: string;
}>();

const page = ENGLISH_FULL_PARITY_ADDITIONS.find(
  (candidate) => candidate.kind === 'algorithm' && candidate.key === props.slug,
);
if (!page) throw new Error(`English algorithm metadata is missing: ${props.slug}`);
</script>

<template>
  <Article>
    <h1>{{ page.heading }}</h1>
    <p class="sub">{{ page.description }}</p>

    <h2>Core idea</h2>
    <p>{{ idea }}</p>

    <h2>Read the visualization</h2>
    <p>{{ visualization }}</p>

    <AlgorithmPlayer :module="module" locale="en" />

    <h2>Complexity and tradeoffs</h2>
    <p>
      Time: <code>{{ page.complexity.time }}</code
      >. Space: <code>{{ page.complexity.space }}</code
      >. {{ page.complexity.note }}
    </p>

    <Callout> <b>Invariant:</b> {{ invariant }} </Callout>

    <h2>Where it fits</h2>
    <p>{{ applications }}</p>
  </Article>
</template>
