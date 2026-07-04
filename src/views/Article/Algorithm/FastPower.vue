<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { fastPowModule } from '@/algorithms/fastpower.module';
</script>

<template>
  <Article>
    <h1>快速幂（二进制取幂）</h1>
    <p class="sub">数学与数论 · 二进制拆分 · O(log n)</p>

    <h2>把指数拆成二进制</h2>
    <p>
      求 <code>aⁿ</code>，一个一个乘要乘 <code>n</code> 次，太慢。快速幂的关键观察是：任何指数
      <code>n</code> 都能写成<strong>二进制</strong>，也就是若干个 <code>2ᵏ</code> 之和。比如
      <code>13 = 8 + 4 + 1 = 1101₂</code>。于是 <strong><code>aⁿ = ∏ a^(2ᵏ)</code></strong
      >——把对应位为 1 的那些 <code>a^(2ᵏ)</code> 乘起来就行。而 <code>a^(2ᵏ)</code> 这一串（<code
        >a¹, a², a⁴, a⁸…</code
      >）只要让底数<strong>反复平方</strong>就能一路算出来，每次平方一步。
    </p>

    <h2>反复平方 + 位选累乘</h2>
    <p>
      算法从低位到高位扫描 <code>n</code> 的二进制：维护一个<strong>底数</strong>
      <code>base</code>（初值 <code>a</code>，每步<strong>平方</strong>成
      <code>a², a⁴, a⁸…</code>）和一个<strong>结果</strong>（初值 1）。看当前位：<strong
        >是 1</strong
      >
      就把当前的 <code>base</code> <strong>乘进结果</strong>；<strong>是 0</strong>
      就只平方、不乘。扫完 <code>log₂n</code> 个位就得到答案，一共只做
      <code>O(log n)</code> 次乘法。
    </p>
    <p>
      下面固定 <code>a=3, n=13</code>。点<strong>「下一步」</strong>逐步看：一行<strong
        >幂块</strong
      >
      <code>3¹=3, 3²=9, 3⁴=81, 3⁸=6561</code> 逐张出现（底数平方链），每块标着它对应的二进制位——位为
      1 的块<strong>选中</strong>（绿）、乘进结果，位为 0
      的块<strong>跳过</strong>（灰），当前块<strong>琥珀</strong>高亮。走到底，选中的
      <code>3¹·3⁴·3⁸ = 3×81×6561 = 1594323 = 3¹³</code>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="fastPowModule" />

    <h2>又快又是加密的引擎</h2>
    <Callout>
      <b>拆分</b>：<code>n = Σ 2ᵏ</code>（二进制），<code>aⁿ = ∏ a^(2ᵏ)</code>。<br />
      <b>平方链</b>：底数每步平方，<code>a → a² → a⁴ → a⁸</code>，一路算出各
      <code>a^(2ᵏ)</code>。<br />
      <b>位选</b>：当前位为 1 才乘进结果；共 <code>O(log n)</code> 次乘法。<br />
      <b>模幂</b>：每步再取一次模 <code>mod m</code>，就是 RSA / Diffie-Hellman 的
      <code>aⁿ mod m</code>。
    </Callout>
    <p>
      快速幂真正的舞台是<strong>模幂运算</strong>
      <code>aⁿ mod m</code>：只要在每次乘法后再取一次模，数值就永远不超过 <code>m²</code>，于是能在
      <code>n</code> 大到几百位时依然秒算——这正是 <strong>RSA 加解密</strong>、Diffie-Hellman
      密钥交换的计算核心。同样的「二分幂」思想换成矩阵乘法，就是<strong>矩阵快速幂</strong>，能把斐波那契等线性递推加速到
      <code>O(log n)</code>。
    </p>
  </Article>
</template>
