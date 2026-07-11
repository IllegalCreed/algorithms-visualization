<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishNQueensModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>N-Queens</h1>
    <p class="sub">Constraint search through place, prune, and backtrack</p>

    <h2>Place one queen in every column</h2>
    <p>
      The N-Queens problem asks for <code>N</code> queens on an <code>N x N</code> board with no two
      sharing a row, column, or diagonal. Placing exactly one queen per column removes the column
      constraint and turns each recursive level into a choice of row.
    </p>

    <h2>Reject conflicts before recursing</h2>
    <p>
      Try rows from top to bottom in the current column. A square is safe when no earlier queen
      shares its row or diagonal. Place a queen and recurse when safe; if later columns become
      impossible, remove that queen and continue with the next row.
    </p>
    <p>
      Amber marks the square under consideration, red identifies queens that attack a rejected
      square, and placed queens remain on the board. The trace stops after finding one solution for
      the 4 by 4 instance.
    </p>

    <AlgorithmPlayer :module="englishNQueensModule" locale="en" />

    <h2>Search cost depends on pruning</h2>
    <p>
      The worst-case search is commonly bounded by <code>O(N!)</code> after enforcing one queen per
      row and column, with <code>O(N)</code> recursion depth. Constant-time row and diagonal sets
      make conflict checks faster for larger boards.
    </p>

    <Callout>
      Backtracking maintains one partial assignment, rejects impossible extensions early, and
      restores the previous state before trying another choice.
    </Callout>

    <p>
      See the same depth-first choose-and-undo pattern without constraints in
      <RouterLink :to="{ name: 'en-subsets' }">Subsets</RouterLink>.
    </p>
  </Article>
</template>
