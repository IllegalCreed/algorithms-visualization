<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { crtModule } from '@/algorithms/crt.module';
</script>

<template>
  <Article>
    <h1>中国剩余定理（CRT）</h1>
    <p class="sub">数学与数论 · 孙子算经 · 合并同余组</p>

    <h2>今有物不知其数</h2>
    <p>
      《孙子算经》：「今有物不知其数，三三数之剩二，五五数之剩三，七七数之剩二，问物几何？」翻译成同余组：<code
        >x ≡ 2 (mod 3)</code
      >、<code>x ≡ 3 (mod 5)</code>、<code>x ≡ 2 (mod 7)</code
      >。<strong>中国剩余定理</strong>断言：只要模<strong>两两互质</strong>，这样的同余组在
      <code>mod M</code>（<code>M = 3·5·7 = 105</code
      >）意义下<strong>必有唯一解</strong>——而且解可以直接<strong>构造</strong>出来。
    </p>

    <h2>给每条同余造一个「专属项」</h2>
    <p>
      三步走。<strong>①有声音</strong>：取
      <code>Mᵢ = M / mᵢ</code>（其余模之积），它对别的模取模都是 0、只在第 i
      条同余里「有声音」。<strong>②校准成 1</strong>：声音大小是 <code>Mᵢ mod mᵢ</code>，未必是
      1——用<router-link to="/docs/ext-gcd">扩展欧几里得</router-link>求逆元
      <code>tᵢ = Mᵢ⁻¹ (mod mᵢ)</code> 把它校准成 1。<strong>③点菜</strong>：要余数 rᵢ，就乘
      rᵢ——专属项 <code>rᵢ·Mᵢ·tᵢ</code> 在第 i 条同余下 ≡ rᵢ、其余同余下 ≡
      0。三项相加，每条同余各取所需互不打扰，再 <code>mod M</code> 收进最小非负解。
    </p>
    <p>
      点<strong>「下一步」</strong>看这张<strong>构造表</strong>逐行填出
      <code>Mᵢ → tᵢ → 项</code>（黄色高亮是每一步引用的格子），最后合计 <code>233</code>、归约得
      <strong>x = 23</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="crtModule" />

    <h2>为什么唯一，用在哪里</h2>
    <Callout>
      <b>前提</b>：模两两互质（否则要用扩展 CRT 合并）。<br />
      <b>构造</b>：x = Σ rᵢ·Mᵢ·tᵢ (mod M)，其中 Mᵢ = M/mᵢ、tᵢ = Mᵢ⁻¹ (mod mᵢ)。<br />
      <b>唯一性</b>：两个解之差被每个 mᵢ 整除 → 被 M 整除，故 mod M 内唯一，通解 x + k·M。<br />
      <b>例</b>：23、128、233… 都满足孙子问题，mod 105 下同一个解。
    </Callout>
    <p>
      工程里 CRT 是「<strong>拆大为小</strong>」的合并器：<strong>RSA-CRT</strong> 把 mod n=p·q
      的解密幂运算拆到 mod p、mod q 里各自用<router-link to="/docs/fast-power">快速幂</router-link
      >算（指数还能先对 φ 取模），再用 CRT 合并，约四倍提速；竞赛里则用多个小质数模各自计算、CRT
      拼回大答案，避开大数运算。数论这条线到此闭环：筛法找质数 → gcd/扩欧给逆元 → 快速幂做模幂 → CRT
      合并同余。
    </p>
  </Article>
</template>
