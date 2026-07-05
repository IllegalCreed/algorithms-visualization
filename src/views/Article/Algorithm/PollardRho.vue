<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { rhoModule } from '@/algorithms/rho.module';
</script>

<template>
  <Article>
    <h1>Pollard's Rho（大数因数分解）</h1>
    <p class="sub">数学与数论 · 生日悖论 · 让因子自己显影</p>

    <h2>试除的墙</h2>
    <p>
      分解 n 最朴素的办法是拿 2, 3, 5, … 一路试除到 √n——n 有几百位时这堵墙高到天上。<strong
        >Pollard's Rho</strong
      >
      换了个哲学：不去挨个「找」因子， 而是造一串伪随机数（x ← x² + 1 mod n），让 n 里藏着的因子 p
      在<strong>生日悖论</strong>的巧合中自己现形。
    </p>

    <h2>两个世界与 gcd 显影</h2>
    <p>
      关键的想象力：这串数同时活在<strong>两个世界</strong>里。在 mod n 的世界（你能看见的）它乱跳；
      在 mod p 的世界（p 是未知因子、你看不见）它也在游走——但那个世界只有 p 个位置，生日悖论说约 √p
      步就会撞车、进入循环，轨迹画出来是个 <strong>ρ 字形</strong>（尾巴 +
      环——算法名字的由来）。撞车意味着两个数 x ≡ y (mod p) 而 x ≠ y (mod n)——它们的差是 p
      的倍数但不是 n 的倍数，于是：
    </p>
    <Callout>
      <b>gcd(|x − y|, n) 就是显影液</b>——把看不见的 p 冲洗出来。<br />
      怎么高效制造「撞车对」？<b>Floyd 龟兔</b>：乌龟每次走 1 步、兔子走 2
      步，兔子在环上必追上乌龟；每走一步做一次 gcd，命中即得因子。期望 <b>O(n^¼)</b>（p ≤ √n，撞车要
      √p 步）。
    </Callout>
    <p>
      下图分解 n = 8051：节点是序列值、箭头是 x → x²+1 的走向，蓝环是龟兔当前位置；最后一步揭开 mod
      97 的世界——同色节点即「同一站台」，ρ 字形一目了然。
    </p>

    <AlgorithmPlayer :module="rhoModule" />

    <h2>完整的分解流水线</h2>
    <p>
      Rho 只负责「劈一刀」：拿到因子后两半各自递归。判断「还要不要劈」交给
      <router-link to="/docs/miller-rabin">米勒-拉宾</router-link>——先判素、合数才进
      Rho，配合<router-link to="/docs/fast-power">快速幂</router-link>与
      <router-link to="/docs/gcd">gcd</router-link>，一条大数分解流水线就齐了。工程上常用 Brent
      变体（批量累乘差值、gcd 次数减半）；反过来看，RSA 敢公开 2048 位的 n，正是笃定 n^¼ ≈ 2⁵¹²
      这个量级谁也啃不动——判素易、分解难这对不对称，就是现代密码学的地基。至此数论大类十页收官：从<router-link
        to="/docs/sieve-of-eratosthenes"
        >筛法</router-link
      >数素数、<router-link to="/docs/crt">CRT</router-link> 拆同余，到判素与分解，一条线走完。
    </p>
  </Article>
</template>
