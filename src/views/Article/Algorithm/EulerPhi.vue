<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { phiModule } from '@/algorithms/phi.module';
</script>

<template>
  <Article>
    <h1>欧拉函数 φ(n)</h1>
    <p class="sub">数学与数论 · 互质计数 · 欧拉定理的钥匙</p>

    <h2>数一数：谁和 n 互质</h2>
    <p>
      <strong>欧拉函数</strong> <code>φ(n)</code> = 1..n 中与 n <strong>互质</strong>的个数（1
      也算）。比如 <code>φ(12)</code>：12 = 2²·3，凡是含质因子 2 或 3 的数都和 12
      有公因子——把它们划掉，幸存者 <code>{1, 5, 7, 11}</code> 就是答案，<code>φ(12) = 4</code>。
    </p>

    <h2>按比例划掉：公式的筛法直观</h2>
    <p>
      2 的倍数<strong>每 2 个占 1 个</strong>——划掉后剩 <code>n·(1−1/2)</code>；3 的倍数每 3 个占 1
      个，但其中一半已被 2 划过，<strong>新划的按比例正好再乘 (1−1/3)</strong
      >。每个不同质因子各打一次折，就是 <strong><code>φ(n) = n·∏(1−1/p)</code></strong
      >：12·(1/2)·(2/3) = 4。点<strong>「下一步」</strong>看网格逐质因子划格（红闪 →
      灰）、幸存者变绿，vars 里同步 res 记账。右侧代码是试除版
      <code>phi(n)</code>，随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="phiModule" />

    <h2>它解锁了什么</h2>
    <Callout>
      <b>性质</b>：φ(p) = p−1；φ(p^k) = p^k − p^(k−1)；gcd(a,b)=1 时 φ(ab) = φ(a)·φ(b)（积性）。<br />
      <b>欧拉定理</b>：gcd(a,n)=1 ⟹ <code>a^φ(n) ≡ 1 (mod n)</code>——费马小定理（n 为质数时
      φ=n−1）的推广。<br />
      <b>指数打折</b>：算 a^k mod n 时指数可先对 φ(n) 取模，再交给快速幂。<br />
      <b>批量求 φ</b>：线性筛可顺路算出 1..N 的全部 φ 值，O(N)。
    </Callout>
    <p>
      <strong>RSA</strong> 里它是真正的主角：n = p·q 公开，<code>φ(n) = (p−1)(q−1)</code>
      只有知道分解的人才算得出——私钥 <code>d ≡ e⁻¹ (mod φ(n))</code>（<router-link
        to="/docs/ext-gcd"
        >扩展欧几里得</router-link
      >求逆），加解密是<router-link to="/docs/fast-power">快速幂</router-link>的模幂，<router-link
        to="/docs/crt"
        >CRT</router-link
      >再把运算拆到 mod p、mod q
      提速四倍。数论这条线的角色到齐了：筛法产质数、gcd/扩欧管互质与逆元、快速幂做模幂、CRT
      合并、φ(n) 定周期。
    </p>
  </Article>
</template>
