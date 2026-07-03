<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { rabinKarpModule } from '@/algorithms/rabinkarp.module';
</script>

<template>
  <Article>
    <h1>Rabin-Karp 字符串匹配</h1>
    <p class="sub">字符串 · 滚动哈希</p>

    <h2>用一个「哈希」代替逐字符比</h2>
    <p>
      在文本
      <code>abcabcab</code> 里找模式 <code>cab</code>。<router-link to="/docs/kmp">KMP</router-link>
      靠部分匹配表跳过冗余比较，<strong>Rabin-Karp</strong>
      则换个思路：给每个长度
      <code>m</code>
      的<strong>窗口</strong>算一个<strong>哈希值</strong>（把这段字符压成一个数），拿它和<strong>模式的哈希</strong>比。哈希不等，这段绝不可能匹配，直接跳过；只有哈希<strong>相等</strong>时，才逐字符<strong>验证</strong>一次。
    </p>

    <h2>滚动哈希：O(1) 更新</h2>
    <p>
      把字符看成数字（<code>a=1, b=2, c=3</code>），用<strong>多项式哈希</strong>：<code
        >hash = (…(s₀·B + s₁)·B + … + sₘ₋₁) mod M</code
      >（这里 <code>B=10, M=997</code>）。模式 <code>cab</code> 的哈希是
      <code>3·100 + 1·10 + 2 = 312</code
      >。关键在<strong>滚动</strong>：窗口右移一格时，不用重算整段——<strong
        >去掉最左字符的贡献、乘上 B、加上新进来的字符</strong
      >，一步 <code>O(1)</code> 就得到新窗口的哈希。于是整趟扫描只花 <code>O(n + m)</code>（平均）。
    </p>
    <p>
      下面是 T=<code>abcabcab</code>、P=<code>cab</code>（哈希
      <code>312</code
      >）。点<strong>「下一步」</strong>逐步看：<strong>浅蓝色</strong>是当前窗口，变量面板显示<strong
        >窗口哈希 vs 模式哈希</strong
      >。哈希<strong>不等就跳过</strong>（很快）；哈希<strong>相等</strong>（下标 2、5 处都是
      312）就<strong>逐字符验证</strong>，通过则<strong>命中</strong>、整段标绿。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="rabinKarpModule" />

    <h2>哈希会「撞车」，所以要验证</h2>
    <Callout>
      两段不同的字符<b>可能算出同一个哈希</b>（哈希冲突）——所以哈希相等只是「可能匹配」，<b>必须逐字符验证</b>才能确认，否则会误报。<br />
      用<b>大素数模 + 随机基</b
      >能把冲突概率压到极低；工程里也常用<b>双哈希</b>（两个独立哈希都相等才验证）。<br />
      本页用小模数 <code>997</code> 是为了让哈希是好读的三位数；此例恰好没有冲突。
    </Callout>
    <p>
      滚动哈希不止用于单模式匹配：它是<strong>多模式匹配</strong>、<strong>最长重复子串</strong>、<strong>文件/文本指纹去重</strong>的通用工具。与
      <router-link to="/docs/kmp">KMP</router-link>
      对比——KMP 用「模式的结构」（部分匹配表）省比较，Rabin-Karp
      用「哈希」把比较压成比一个数，两条不同的加速路。
    </p>
  </Article>
</template>
