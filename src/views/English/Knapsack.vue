<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishKnapsackModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>0/1 Knapsack</h1>
    <p class="sub">Dynamic programming for choices under a capacity limit</p>

    <h2>Take an item or leave it</h2>
    <p>
      Each item has a weight and a value, and each item may be chosen at most once. Define
      <code>dp[i][w]</code> as the greatest value possible using the first <code>i</code> items with
      capacity <code>w</code>. This state turns an exponential collection of subsets into a table of
      reusable subproblems.
    </p>

    <h2>Read the two source cells</h2>
    <p>
      If an item is too heavy, copy the value from the row above. Otherwise compare skipping it with
      taking it: <code>dp[i-1][w]</code> versus <code>dp[i-1][w-weight] + value</code>. The
      highlighted cells show both sources for every decision. The bottom-right result is 7, produced
      by items A and B.
    </p>

    <AlgorithmPlayer :module="englishKnapsackModule" locale="en" />

    <h2>Complexity and variations</h2>
    <p>
      The table has <code>n * W</code> states, so time and full-table space are <code>O(nW)</code>.
      Because each row only depends on the previous row, a one-dimensional implementation can reduce
      space to <code>O(W)</code> by iterating capacities backward.
    </p>

    <Callout>
      The 0/1 restriction is encoded by reading from the previous row. Complete Knapsack changes
      that source so the current item can be reused. Subset Sum and many resource-allocation models
      are close relatives of the same recurrence.
    </Callout>
  </Article>
</template>
