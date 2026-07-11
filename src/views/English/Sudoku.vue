<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishSudokuModule } from '@/i18n/en/modules/sudoku';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="sudoku"
    :module="englishSudokuModule"
    idea="Select an empty cell, try digits that do not appear in its row, column, or box, and recurse. A contradiction proves the latest choice must be undone."
    visualization="The active cell highlights every rejected digit and accepted placement. Backtracking removes a tentative value, while fixed clues remain visually distinct throughout the search."
    invariant="Every placed digit satisfies all three local constraint sets, so only future cells can make a partial board impossible."
    applications="Sudoku is a compact constraint-satisfaction example. Bit masks, most-constrained-cell ordering, and exact cover dramatically reduce the practical search."
  />
</template>
