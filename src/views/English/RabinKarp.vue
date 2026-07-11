<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishRabinKarpModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Rabin-Karp String Matching</h1>
    <p class="sub">Rolling hashes for constant-time window screening</p>

    <h2>Compare fingerprints before characters</h2>
    <p>
      Rabin-Karp hashes the pattern and each text window of the same length. Unequal hashes prove
      the strings differ, so the window can be skipped immediately. Equal hashes are only a
      candidate match because different strings can collide.
    </p>

    <h2>Roll the hash as the window moves</h2>
    <p>
      A polynomial rolling hash removes the outgoing character's weighted contribution, shifts the
      remaining value by the base, and adds the incoming character. This updates the next window in
      <code>O(1)</code> time instead of hashing all <code>m</code> characters again.
    </p>
    <p>
      The player scans <code>abcabcab</code> for <code>cab</code>. It displays the current window
      and both hashes. Hash equality triggers a character verification; successful verification
      records the starting index in green.
    </p>

    <AlgorithmPlayer :module="englishRabinKarpModule" locale="en" />

    <h2>Expected linear time with a worst-case caveat</h2>
    <p>
      Initial hashes cost <code>O(m)</code> and the scan performs <code>O(n)</code> rolling updates.
      With rare collisions, expected time is <code>O(n + m)</code>. Repeated collisions can force
      <code>O(nm)</code> character verification, so robust implementations use large moduli,
      randomized bases, or double hashing.
    </p>

    <Callout>
      Hash equality is never accepted as proof. Character verification keeps the algorithm correct
      even when collisions occur.
    </Callout>

    <p>
      Compare hash-based screening with prefix reuse in
      <RouterLink :to="{ name: 'en-kmp' }">KMP String Matching</RouterLink>, then explore palindrome
      symmetry in <RouterLink :to="{ name: 'en-manacher' }">Manacher's algorithm</RouterLink>.
    </p>
  </Article>
</template>
