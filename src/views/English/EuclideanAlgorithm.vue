<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { englishGcdModule } from '@/i18n/englishAlgorithmModules';
</script>

<template>
  <Article>
    <h1>Euclidean Algorithm</h1>
    <p class="sub">Greatest common divisors through repeated remainders</p>

    <h2>Replace a pair without changing its common divisors</h2>
    <p>
      The key identity is <code>gcd(a, b) = gcd(b, a mod b)</code>. Any number dividing both
      <code>a</code> and <code>b</code> also divides their remainder, and the converse follows from
      <code>a = qb + r</code>. Replacing the pair repeatedly makes the second value strictly
      smaller.
    </p>

    <h2>See remainders as leftover rectangles</h2>
    <p>
      A geometric interpretation asks for the largest square tile that can cover an
      <code>a x b</code> rectangle. Cutting as many short-side squares as possible leaves a
      rectangle whose side is <code>a mod b</code>. Repeating the tiling performs the same
      recurrence as the arithmetic algorithm.
    </p>
    <p>
      The player computes <code>gcd(30, 18)</code>. Amber outlines squares cut in the current
      division step, while the dashed rectangle is the remainder still to tile. The smallest final
      square has side 6.
    </p>

    <AlgorithmPlayer :module="englishGcdModule" locale="en" />

    <h2>Logarithmic convergence</h2>
    <p>
      The remainder sequence reaches zero in <code>O(log min(a, b))</code> steps and needs
      <code>O(1)</code> iterative space. Consecutive Fibonacci numbers produce the classic
      worst-case sequence because their remainders shrink as slowly as possible.
    </p>

    <Callout>
      The extended Euclidean algorithm carries coefficients through the same recurrence to solve
      <code>ax + by = gcd(a, b)</code>, which enables modular inverses.
    </Callout>

    <p>
      Start the number-theory path with batch prime generation in the
      <RouterLink :to="{ name: 'en-sieve-of-eratosthenes' }">Sieve of Eratosthenes</RouterLink>.
    </p>
  </Article>
</template>
