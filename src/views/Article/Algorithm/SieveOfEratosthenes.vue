<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { sieveModule } from '@/algorithms/sieve.module';
</script>

<template>
  <Article>
    <h1>埃拉托斯特尼筛</h1>
    <p class="sub">数学与数论 · 素数筛 · O(N log log N)</p>

    <h2>一次筛出所有素数</h2>
    <p>
      判断一个数是不是<strong>素数</strong>（只能被 1 和自己整除），最朴素的办法是拿它去试除
      <code>2..√x</code>。但如果要找出 <code>1..N</code>
      里<strong>所有</strong>素数，一个个试除就慢了。<strong>埃拉托斯特尼筛</strong>（公元前 3
      世纪的古老算法）换了个思路——不去判断谁是素数，而是<strong>划掉</strong>谁一定不是：把 2..N
      排开，从最小的开始，每遇到一个还没被划掉的数，它就是素数，然后把它的<strong>所有倍数</strong>都划掉（它们都是合数）。
    </p>

    <h2>两个关键优化</h2>
    <p>
      划倍数时，从 <strong><code>p²</code></strong> 开始就够了——因为
      <code>2p, 3p, …, (p−1)p</code> 这些更小的倍数，早在处理
      <code>2, 3, …, p−1</code> 时就被划掉了。而且外层只要跑到
      <strong><code>p² > N</code></strong> 就能停：任何 <code>≤ N</code> 的合数，必有一个
      <code>≤ √N</code> 的质因子，所以走到
      <code>√N</code> 时所有合数都已被划完，剩下没划掉的<strong>全是素数</strong>。整体复杂度
      <code>O(N log log N)</code>，几乎线性。
    </p>
    <p>
      下面固定
      <code>N = 30</code
      >。点<strong>「下一步」</strong>逐步看：<strong>绿色</strong>是确认的素数、<strong>灰色划掉</strong>是合数、<strong>琥珀环</strong>是当前正在处理的素数
      <code>p</code>、<strong>红色</strong>是这一步正在划掉的 <code>p</code> 的倍数。处理完 2、3、5
      后，<code>7² = 49 > 30</code> 就停了，剩下
      <code>7, 11, …, 29</code> 一次性确认为素数。走到底，<code>1..30</code> 共
      <strong>10</strong> 个素数。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="sieveModule" />

    <h2>为什么这么快</h2>
    <Callout>
      <b>不判断、只划掉</b>：每个素数把自己的倍数标成合数，剩下的自然是素数。<br />
      <b>从 p² 起</b>：更小的倍数已被更小的素数划过，不用重复。<br />
      <b>筛到 √N 即停</b>：合数必有 ≤√N 的质因子，走到 √N 就全划完了。<br />
      <b>复杂度</b>：<code>O(N log log N)</code>，比逐个试除的 O(N√N) 快得多。
    </Callout>
    <p>
      埃氏筛是数论算法的基石：预处理出素数表后，<strong>质因数分解</strong>、<strong>欧拉函数</strong>、<strong>莫比乌斯函数</strong>等都能批量算。它的进阶版<strong
        ><router-link to="/docs/linear-sieve">线性筛（欧拉筛）</router-link></strong
      >让每个合数只被它的<strong>最小质因子</strong>划一次，把复杂度压到严格
      <code>O(N)</code>——那是这条线的下一站。
    </p>
  </Article>
</template>
