<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { gcdModule } from '@/algorithms/gcd.module';
</script>

<template>
  <Article>
    <h1>欧几里得算法（最大公约数）</h1>
    <p class="sub">数学与数论 · 辗转相除 · O(log min(a, b))</p>

    <h2>两千年前的取模递推</h2>
    <p>
      求两个数的<strong>最大公约数 gcd(a, b)</strong
      >（能同时整除它俩的最大整数），最古老也最快的办法是<strong>欧几里得算法</strong>（辗转相除）。它基于一个简单的事实：<strong
        ><code>gcd(a, b) = gcd(b, a mod b)</code></strong
      >——a 和 b 的公约数，跟 b 和「a 除以 b 的余数」的公约数<strong>完全一样</strong>。于是不断用
      <code>(b, a mod b)</code> 替换 <code>(a, b)</code>，数越缩越小，直到余数变
      <strong>0</strong>，此时的被除数就是答案。因为每两步余数至少减半，只需
      <code>O(log min(a, b))</code> 步。
    </p>

    <h2>为什么？把它铺成正方形</h2>
    <p>
      有一个特别漂亮的几何解释：<strong
        >gcd(a, b) 等于能把一个 a×b 的矩形无缝铺满的最大正方形的边长</strong
      >。想铺满矩形，先尽量塞进边长等于<strong>短边</strong>的大正方形（能塞
      <code>⌊a/b⌋</code> 个），塞完剩下一个更扁的小矩形
      <code>(a mod b) × b</code
      >；再对这个小矩形做同样的事……每一步「切正方形」正好对应算术里的「取模」。切到某个正方形<strong>正好把矩形铺满、没有零头</strong>，那个<strong>最小正方形的边长</strong>就是
      gcd。如果最小正方形是 <code>1×1</code>，就说明两数<strong>互质</strong>。
    </p>
    <p>
      下面固定
      <code>gcd(30, 18)</code
      >。点<strong>「下一步」</strong>逐步看：<strong>琥珀描边</strong>是这一步刚切下的正方形（格子里标着边长）、<strong>虚线框</strong>是还没铺的剩余小矩形。走过三步——<code
        >30÷18=1 余 12</code
      >、<code>18÷12=1 余 6</code>、<code>12÷6=2 余 0</code>——矩形被 18、12、6、6
      四个正方形恰好铺满，最小的正方形边长 <strong>6</strong> 就是答案。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="gcdModule" />

    <h2>又快又是基石</h2>
    <Callout>
      <b>递推</b>：<code>gcd(a, b) = gcd(b, a mod b)</code>，余数为 0 时被除数即答案。<br />
      <b>几何</b>：能铺满 a×b 矩形的最大正方形边长 = gcd；最小正方形 = 1 ⟺ 互质。<br />
      <b>复杂度</b>：<code>O(log min(a, b))</code
      >，最坏情况是相邻<strong>斐波那契数</strong>。<br />
      <b>延伸</b>：<strong>扩展欧几里得</strong>在求 gcd 的同时解出
      <code>ax + by = gcd</code>，是模逆元、解同余方程的基础。
    </Callout>
    <p>
      欧几里得算法是数论与密码学的地基：约分、通分、求<strong>模逆元</strong>（RSA
      解密的一步）、中国剩余定理都离不开它。它的<strong
        ><router-link to="/docs/ext-gcd">扩展版</router-link></strong
      >还能一并算出让 <code>ax + by = gcd(a, b)</code> 成立的整数 <code>x, y</code>（Bézout
      系数）——那是这条线自然的下一站。
    </p>
  </Article>
</template>
