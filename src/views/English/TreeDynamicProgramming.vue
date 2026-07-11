<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishTreeDpModule } from '@/i18n/en/modules/tree-dp';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="tree-dp"
    :module="englishTreeDpModule"
    idea="Root the tree and define a small state for each parent-child constraint. For maximum independent set, one state selects the node and forces children out; the other leaves it out and frees each child."
    visualization="Rows follow postorder so child states are ready before their parent. The two columns expose the selected and unselected recurrences and their final root comparison."
    invariant="A completed node row is optimal for its entire subtree under each stated choice for that node."
    applications="Tree DP solves independent sets, vertex covers, subtree allocation, and many hierarchical selections. The key is choosing a state that makes child subproblems independent."
  />
</template>
