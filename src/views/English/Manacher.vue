<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishManacherModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Manacher's Longest Palindromic Substring</h1>
    <p class="sub">Linear-time palindrome radii through mirror symmetry</p>

    <h2>Give odd and even palindromes one representation</h2>
    <p>
      Insert a separator before, after, and between all original characters. Both odd-length and
      even-length palindromes then have a single center in the transformed string. Let
      <code>p[i]</code> be the radius around transformed center <code>i</code>.
    </p>

    <h2>Reuse a mirror inside the rightmost palindrome</h2>
    <p>
      Maintain center <code>C</code> and right boundary <code>R</code> of the palindrome reaching
      farthest right. When <code>i &lt; R</code>, its mirror is <code>2C - i</code>. Start
      <code>p[i]</code> from the smaller of the mirror radius and <code>R - i</code>, then compare
      only characters beyond the known boundary.
    </p>
    <p>
      The player transforms <code>babad</code> into <code>#b#a#b#a#d#</code>. It marks the active
      center, mirror, current rightmost box, radius values, and longest palindrome found so far.
    </p>

    <AlgorithmPlayer :module="englishManacherModule" locale="en" />

    <h2>Why all expansions remain linear</h2>
    <p>
      Work copied from a mirror costs constant time. Any successful comparison beyond the known box
      advances <code>R</code>, which can move right only across the transformed string once. Total
      time and radius storage are therefore <code>O(n)</code>.
    </p>

    <Callout>
      <b>Invariant:</b> every radius left of the current index is final, and
      <code>[C - p[C], R]</code>
      is the computed palindrome with the greatest right boundary.
    </Callout>

    <p>
      Contrast palindrome symmetry with rolling windows in
      <RouterLink :to="{ name: 'en-rabin-karp' }">Rabin-Karp</RouterLink> and prefix fallback in
      <RouterLink :to="{ name: 'en-kmp' }">KMP</RouterLink>.
    </p>
  </Article>
</template>
