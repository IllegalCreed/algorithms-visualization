<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { fenwickModule } from '@/algorithms/fenwick.module';
</script>

<template>
  <Article>
    <h1>树状数组（Fenwick / BIT）</h1>
    <p class="sub">数据结构 · lowbit 链 · 改查双 O(log n)</p>

    <h2>改与查的两难</h2>
    <p>
      要频繁地「单点加」和「求前缀和」：普通数组改 O(1) 查 O(n)；前缀和数组查 O(1) 改
      O(n)——两头总有一头是 O(n)。<strong>树状数组</strong>用一行位运算魔法两头兼得：<strong
        ><code>lowbit(i) = i &amp; -i</code></strong
      >（取出 i 二进制的最低位 1）。
    </p>

    <h2>管辖区间：每个格子管一段</h2>
    <p>
      <code>tree[i]</code> 存「以 i 结尾、长度 lowbit(i)」那段的和：tree[4]（100₂，lowbit=4）管
      a₁..a₄，tree[6]（110₂，lowbit=2）只管 a₅+a₆。<strong>query(6)</strong>：沿
      <code>i -= lowbit(i)</code> 往前跳（6 → 4 → 0），两块拼出前缀和；<strong>update(3, +2)</strong
      >：沿 <code>i += lowbit(i)</code> 往后跳（3 → 4 → 8），把每个「管到
      a₃」的区段都通知一遍——注意柱子<strong>当场长高</strong>。跳几步？i 的二进制位数——<strong
        >O(log n)</strong
      >。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="fenwickModule" />

    <h2>十行代码的性价比</h2>
    <Callout>
      <b>三方案对比</b>：数组（改 O(1)/查 O(n)）、前缀和（改 O(n)/查 O(1)）、BIT（双 O(log n)）。<br />
      <b>lowbit 直觉</b>：i 的二进制每去掉一个最低位 1，就吞并一段更靠前的区间。<br />
      <b>区间和</b>：query(r) − query(l−1)；区间加单点查用差分 BIT。<br />
      <b>经典应用</b>：逆序对计数、动态第 k 小（配倍增）、滑动统计。
    </Callout>
    <p>
      与<router-link to="/docs/segment-tree">线段树</router-link
      >相比：线段树全能（区间改/区间查/最值），BIT
      只做前缀可加信息——但十行代码、常数小一半，覆盖日常 90% 的场景。竞赛里「能 BIT
      不线段树」是常识；这也是数据结构大类的第 16 块拼图：数组结构从静态查询走到了动态统计。
    </p>
  </Article>
</template>
