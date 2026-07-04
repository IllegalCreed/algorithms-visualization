<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { extGcdModule } from '@/algorithms/extgcd.module';
</script>

<template>
  <Article>
    <h1>扩展欧几里得（Bézout 系数）</h1>
    <p class="sub">数学与数论 · ax + by = gcd · 模逆元的钥匙</p>

    <h2>不只求 gcd，还要找到 x 和 y</h2>
    <p>
      <router-link to="/docs/gcd">欧几里得算法</router-link>告诉我们
      <code>gcd(30, 18) = 6</code>。<strong>Bézout 定理</strong>说得更多：一定存在整数
      <code>x, y</code> 使 <strong><code>30x + 18y = 6</code></strong
      >。扩展欧几里得就是把这对系数<strong>顺手算出来</strong>——不多花一分复杂度，只是在辗转相除的<strong>回程</strong>上带点货。
    </p>

    <h2>下行照旧，回程带货</h2>
    <p>
      <strong>下行</strong>：照常做除法链 <code>a = q·b + r</code>，一路到
      <code>b = 0</code>。<strong>基例</strong>：此时 <code>gcd = a</code>，恒等式
      <code>a·1 + 0·0 = a</code> 白送一组系数
      <code>(x, y) = (1, 0)</code>。<strong>回代</strong>：假设下一层已给出
      <code>b·x′ + r·y′ = g</code>，把 <code>r = a − q·b</code> 代进去整理：<code
        >a·y′ + b·(x′ − q·y′) = g</code
      >——所以本层 <strong><code>(x, y) = (y′, x′ − q·y′)</code></strong
      >。一层层带上来，到顶层就是答案。
    </p>
    <p>
      下面沿用
      <code>30, 18</code
      >。点<strong>「下一步」</strong>逐步看这张<strong>回代表</strong>：先自上而下填好每层的
      <code>a, b, q</code>；到基例行写下 <code>(1, 0)</code>；然后<strong>自底向上</strong>填
      <code>x, y</code>（黄色高亮是引用的下一层系数），每层字幕都验证
      <code>a·x + b·y = 6</code>。走到顶：<strong>x = −1、y = 2</strong>，即
      <code>30·(−1) + 18·2 = 6</code>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="extGcdModule" />

    <h2>它真正的用途：模逆元</h2>
    <Callout>
      <b>Bézout</b>：gcd(a,b) 总能写成 ax + by；扩展欧几里得顺路求出 x, y。<br />
      <b>回代</b>：基例 (1, 0)；每层 (x, y) = (y′, x′ − q·y′)。<br />
      <b>模逆元</b>：gcd(a, m) = 1 时 ax + my = 1 → <code>a·x ≡ 1 (mod m)</code>，x mod m 即
      a⁻¹。<br />
      <b>例</b>：extgcd(3, 7) 给 x = −2 → 3 的逆是 <code>−2 mod 7 = 5</code>（3·5 = 15 ≡ 1）。
    </Callout>
    <p>
      模逆元让「除法」在模运算里成为可能：解同余方程
      <code>ax ≡ c (mod m)</code>、中国剩余定理合并同余组、以及 <strong>RSA</strong> 里由加密指数 e
      反解解密指数 <code>d ≡ e⁻¹ (mod φ(n))</code>——配合<router-link to="/docs/fast-power"
        >快速幂</router-link
      >做模幂，这两页合起来就是 RSA 数学核心的完整拼图。
    </p>
  </Article>
</template>
