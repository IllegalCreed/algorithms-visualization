<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishSegmentIntersectionModule } from '@/i18n/en/modules/segment-intersection';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="segment-intersection"
    :module="englishSegmentIntersectionModule"
    idea="Orientation cross products tell which side of one directed line each endpoint of the other segment occupies. Opposite sides imply a proper crossing; zero orientations require on-segment checks."
    visualization="The plane highlights both segments, endpoint orientations, and bounding boxes before labeling a proper crossing, endpoint touch, collinear overlap, or disjoint result."
    invariant="The sign of each exact cross product consistently encodes left, right, or collinear orientation for its ordered point triple."
    applications="Segment intersection is a primitive for clipping, polygon validity, collision detection, and sweep-line algorithms. Integer coordinates help avoid floating-point sign errors."
  />
</template>
