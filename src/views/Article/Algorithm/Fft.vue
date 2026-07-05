<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { fftModule } from '@/algorithms/fft.module';
</script>

<template>
  <Article>
    <h1>FFT（快速傅里叶变换）</h1>
    <p class="sub">数学与数论 · 蝶形网络 · 多项式乘法的加速器</p>

    <h2>乘法为什么会快</h2>
    <p>
      两个多项式相乘，系数表示下是卷积——每项两两相乘，<code>O(n²)</code>。 换个表示法：一个 n
      次多项式由 n+1 个<strong>点值</strong>唯一确定（两点定一线的推广），
      而点值表示下乘法只要<strong>逐点相乘</strong>，<code>O(n)</code>！ 于是乘法变成三部曲：<strong
        >取点值（DFT）→ 逐点相乘 → 变回系数（IDFT）</strong
      >。 瓶颈只剩「取点值」——随便取 n 个点各代入一次还是 O(n²)，好在取样点可以挑：FFT
      挑的是<strong>单位根</strong>。
    </p>

    <h2>单位根与蝶形</h2>
    <p>
      ω = e<sup>−2πi/n</sup> 的幂次均匀分布在单位圆上，自带对称：ω<sup>k+n/2</sup> =
      −ω<sup>k</sup>。 按<strong>奇偶次项</strong>把多项式劈成两半，n 点变换就折叠成两个 n/2
      点变换加 O(n) 次合并——递归 log n
      层。迭代版先做<strong>位反转重排</strong>（递归的偶奇分组层层展平后， 第 i
      个位置放的是下标「二进制倒着读」的元素），然后逐层跑<strong>蝶形</strong>：
    </p>
    <Callout>
      蝶形单元：<b>(u, v) → (u + ωv, u − ωv)</b>——一次乘法同时产出「和」「差」两个点值。<br />
      第 1 层相邻配对（跨度 1）、第 2 层跨度 2、第 3 层跨度 4……每层配对跨度翻倍、共 log n 层、每层
      n/2 个蝶形——总计
      <b>O(n log n)</b>。下图连线旁的 ×ω 就是该蝶形的旋转因子。
    </Callout>

    <AlgorithmPlayer :module="fftModule" />

    <h2>从 FFT 到 NTT</h2>
    <p>
      逆变换（IDFT）用同一套蝶形，只把 ω 换成共轭、结果除以 n——所以整条乘法流水线就是「两次 FFT +
      一次逐点乘」。浮点误差敏感的场景（大数乘法要精确整数）有孪生版
      <strong>NTT</strong>：在模素数域里用<strong>原根</strong>替代单位根，蝶形结构一模一样。
      与<router-link to="/docs/fast-power">快速幂</router-link>的「平方折半」、<router-link
        to="/docs/bitonic-sort"
        >双调排序</router-link
      >的比较器网络（本页画布正来自它）一样，都是「分治对折」的形状——把 n 的问题反复对折到 log n
      层，是这一族算法共同的骨架。
    </p>
  </Article>
</template>
