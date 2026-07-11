<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishSieveModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Sieve of Eratosthenes</h1>
    <p class="sub">Mark composite multiples to reveal every prime up to N</p>

    <h2>Find primes in one shared pass</h2>
    <p>
      Begin with every integer from 2 through <code>N</code> unmarked. The next unmarked value is
      prime. Mark all of its multiples as composite, then continue to the next unmarked value. The
      values never marked are exactly the primes.
    </p>

    <h2>Start at p squared</h2>
    <p>
      Multiples smaller than <code>p^2</code> already contain a smaller prime factor and were marked
      earlier. Once <code>p^2 &gt; N</code>, every composite at most <code>N</code> has already been
      reached through a factor at most <code>sqrt(N)</code>, so all remaining unmarked values can be
      confirmed together.
    </p>
    <p>
      The number grid runs to 30. Green cells are confirmed primes, gray cells are composite, amber
      marks the current prime, and newly crossed-out multiples flash red.
    </p>

    <AlgorithmPlayer :module="englishSieveModule" locale="en" />

    <h2>Near-linear preprocessing</h2>
    <p>
      The harmonic sum over prime multiples gives <code>O(N log log N)</code> time and the marking
      array uses <code>O(N)</code> space. The sieve is ideal when many later queries need the same
      bounded prime table.
    </p>

    <Callout>
      <b>Invariant:</b> before processing prime <code>p</code>, every composite below
      <code>p^2</code> has already been marked by a smaller prime factor.
    </Callout>

    <p>
      Continue the number-theory path with the remainder invariant in the
      <RouterLink :to="{ name: 'en-gcd' }">Euclidean Algorithm</RouterLink>.
    </p>
  </Article>
</template>
