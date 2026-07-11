<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishBinaryBoundsModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Lower and Upper Bound</h1>
    <p class="sub">Binary Search templates for duplicate ranges and insertion positions</p>

    <h2>Search for a boundary, not an exact match</h2>
    <p>
      <code>lower_bound</code> returns the first position whose value is at least the target.
      <code>upper_bound</code> returns the first position whose value is greater. Their half-open
      range <code>[lo, hi)</code> allows <code>hi = n</code>, so insertion after the final value
      needs no special case.
    </p>

    <h2>One comparison changes the meaning</h2>
    <p>
      Lower bound moves right while <code>a[mid] &lt; target</code>. Upper bound also moves right on
      equality, using <code>a[mid] &lt;= target</code>. The player runs both searches over the same
      duplicate-heavy array, then highlights the equal range <code>[lower, upper)</code>.
    </p>

    <AlgorithmPlayer :module="englishBinaryBoundsModule" locale="en" />

    <h2>Reliable library semantics</h2>
    <p>
      Each boundary takes <code>O(log n)</code> time and <code>O(1)</code> space. If the target is
      absent, lower and upper meet at the same insertion position and the count is zero. This is the
      behavior behind C++ <code>lower_bound</code>, Python <code>bisect</code>, and equivalent
      standard-library APIs.
    </p>

    <Callout>
      <b>Invariant:</b> indices before <code>lo</code> are known to fail the boundary predicate,
      while indices at or after <code>hi</code> are known to satisfy it.
    </Callout>

    <p>
      Review exact-match behavior first in
      <RouterLink :to="{ name: 'en-binary-search' }">Binary Search</RouterLink>.
    </p>
  </Article>
</template>
