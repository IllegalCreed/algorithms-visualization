<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishRotatingCalipersModule } from '@/i18n/en/modules/rotating-calipers';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="rotating-calipers"
    :module="englishRotatingCalipersModule"
    idea="On a convex polygon, an antipodal support point moves monotonically as each hull edge advances. This rotating pair visits all diameter candidates without restarting a scan."
    visualization="One pointer selects the current hull edge and the other rotates while triangle area increases. Candidate endpoint distances update the best diameter pair."
    invariant="The opposite pointer never needs to move backward because support direction rotates monotonically around a convex polygon."
    applications="Rotating calipers finds convex diameter, width, bounding rectangles, and distances between convex polygons after a hull has already been built."
  />
</template>
