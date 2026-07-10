<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishConvexHullModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Convex Hull</h1>
    <p class="sub">Andrew's monotone chain with cross-product turn tests</p>

    <h2>The tight boundary around a point set</h2>
    <p>
      The convex hull is the smallest convex polygon containing every input point. Imagine
      stretching a rubber band around the outermost points: when released, it touches the hull
      vertices and leaves all interior points enclosed.
    </p>

    <h2>Use cross products to keep only left turns</h2>
    <p>
      For points O, A, and B, the sign of <code>(A-O) x (B-O)</code> tells whether the path turns
      left or right. Andrew's algorithm sorts points by <code>(x, y)</code>, scans left to right for
      the lower hull, then right to left for the upper hull. A non-left turn pops the middle point
      because it cannot belong to the convex boundary.
    </p>

    <AlgorithmPlayer :module="englishConvexHullModule" locale="en" />

    <h2>Complexity and uses</h2>
    <p>
      Sorting costs <code>O(n log n)</code>; each point enters and leaves each scan stack at most
      once, so both scans are linear. Convex hulls are a foundation for collision tests,
      farthest-point pairs, minimum enclosing shapes, and geometric preprocessing.
    </p>

    <Callout>
      The stack invariant is simple: every consecutive triple currently on the chain makes a left
      turn. The moment a new point violates that invariant, pop until convexity is restored.
    </Callout>
  </Article>
</template>
