<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishLcaModule } from '@/i18n/en/modules/lca';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="lca"
    :module="englishLcaModule"
    idea="Binary lifting stores each node's ancestor one, two, four, and more powers of two above it. Queries first equalize depths, then lift both nodes without jumping above their meeting point."
    visualization="The table builds from smaller jumps to larger ones. During a query, highlighted powers explain each depth alignment and synchronized jump before the shared parent is returned."
    invariant="After column j is built, every entry points exactly 2 to the power j edges upward, or to the root sentinel when that ancestor does not exist."
    applications="LCA preprocessing supports repeated ancestor, tree-distance, path, and virtual-tree queries on a static rooted tree. Dynamic trees require different machinery."
  />
</template>
