<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { mrModule } from '@/algorithms/mr.module';
</script>

<template>
  <Article>
    <h1>米勒-拉宾素性测试</h1>
    <p class="sub">数学与数论 · 概率判素 · RSA 选质数的引擎</p>

    <h2>费马测试有个漏洞</h2>
    <p>
      RSA 要挑几百位的大质数，试除到 √n 是天文数字。<strong>费马小定理</strong>给了快测：n
      是质数时对任意互质的 a 都有
      <code>a^(n−1) ≡ 1 (mod n)</code
      >——反过来不成立也就罢了，还有一族<strong>卡迈克尔数</strong>专门捣乱：<code
        >561 = 3·11·17</code
      >
      是合数，可 <code>2^560 ≡ 1 (mod 561)</code>，对<strong>所有</strong>互质底数都过费马测试。
    </p>

    <h2>在「开平方」处设卡</h2>
    <p>
      米勒-拉宾的加固点：质数模下 <code>x² ≡ 1</code> <strong>只有两个解 x ≡ ±1</strong>。把
      <code>n−1 = 2^s·d</code>（d 为奇数）拆开，从 <code>x₀ = a^d</code> 开始连续平方直到
      <code>a^(n−1)</code>：若质数，这条链要么一路是 1、要么某处先撞到 <strong>−1</strong> 再变
      1；若链<strong>从「既非 1 也非 −1」的数平方出 1</strong>——非平凡平方根现形，n 必是合数。
    </p>
    <p>
      下面两行试验（底数 a=2）：<strong>41</strong>（真质数）链 <code>32 → 40 = −1</code>
      撞 −1 通过；<strong>561</strong>（伪装者）链
      <code>263 → 166 → 67 → 1</code>，<code>67² ≡ 1</code> 而 67 ≠
      ±1——当场识破。点<strong>「下一步」</strong>逐格看平方链，判定步黄色高亮「作案证据」。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="mrModule" />

    <h2>概率界与工程实践</h2>
    <Callout>
      <b>单轮</b>：随机底数 a，合数通过测试的概率 ≤ 1/4（比费马强得多且无卡迈克尔死角）。<br />
      <b>k 轮</b>：误报 ≤ 4^(−k)——试 20 个底数就到 10^(−12) 量级。<br />
      <b>确定性</b>：对 64 位整数，试固定底数集 {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}
      即可给出确定答案。<br />
      <b>引擎</b>：a^d 与平方全是模幂——<router-link to="/docs/fast-power">快速幂</router-link
      >是它的发动机。
    </Callout>
    <p>
      OpenSSL 生成 RSA 密钥、各语言大数库的 <code>isProbablePrime</code>，跑的都是米勒-拉宾（常配合
      BPSW 组合测试）。数论线在此收官：<router-link to="/docs/sieve-of-eratosthenes"
        >筛法</router-link
      >管小质数、米勒-拉宾管大质数、<router-link to="/docs/euler-phi">φ(n)</router-link
      >与<router-link to="/docs/ext-gcd">扩欧</router-link>配钥匙、<router-link
        to="/docs/fast-power"
        >快速幂</router-link
      >与<router-link to="/docs/crt">CRT</router-link>跑加解密——一条 RSA 流水线全通了。
    </p>
  </Article>
</template>
