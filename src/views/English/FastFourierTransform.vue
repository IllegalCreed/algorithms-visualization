<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishFftModule } from '@/i18n/en/modules/fft';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="fft"
    :module="englishFftModule"
    idea="Split a polynomial into even and odd coefficients, evaluate both at squared roots, and combine them with roots-of-unity rotations. Iterative FFT exposes the same recursion as butterfly layers."
    visualization="Bit reversal places recursive leaves in iterative order. Each network column doubles block size, and every butterfly transforms one pair with its twiddle factor."
    invariant="After layer s, each completed block contains the transform of a size 2 to the power s subproblem."
    applications="FFT reduces polynomial and large-integer convolution to transform, pointwise multiply, and inverse transform. Numerical implementations must round and control floating-point error."
  />
</template>
