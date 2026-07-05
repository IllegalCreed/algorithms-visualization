<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { suffixArrayModule } from '@/algorithms/suffixarray.module';
</script>

<template>
  <Article>
    <h1>后缀数组</h1>
    <p class="sub">字符串 · 后缀结构 · 倍增 O(n log²n)</p>

    <h2>把所有后缀排个序</h2>
    <p>
      一个长度 n 的串有 n
      个<strong>后缀</strong>（从每个位置到末尾）。把它们按<strong>字典序</strong>排好，用一个数组
      <code>sa</code> 记下顺序（<code>sa[i]</code> = 排名第 i
      的后缀的<strong>起点下标</strong>），这就是<strong>后缀数组</strong>。别看它只是「排个序」，最长公共子串、不同子串计数、重复子串检测等一大批问题，都能站在它肩膀上快速解决——它是字符串的<strong>后缀结构</strong>基石。
    </p>
    <p>
      前四页 <router-link to="/docs/kmp">KMP</router-link> /
      <router-link to="/docs/rabin-karp">Rabin-Karp</router-link> /
      <router-link to="/docs/boyer-moore">Boyer-Moore</router-link> 是「找模式」、<router-link
        to="/docs/manacher"
        >Manacher</router-link
      >
      是「找回文」，后缀数组则是「<strong>把后缀组织起来</strong>」——字符串处理的另一大支柱。
    </p>

    <h2>倍增：每轮把比较长度翻倍</h2>
    <p>
      直接对 n 个后缀排序，每次比较两个后缀最坏要扫 O(n) 个字符，总共
      <code>O(n² log n)</code>，太慢。<strong>倍增法</strong>的巧思是：<strong
        >先按每个后缀的前 1 个字符排序、定一个 rank</strong
      >；然后<strong>用上一轮的 rank 拼出新关键字</strong>——后缀 i 的「前 2 位」可以表示成
      <code>(rank[i], rank[i+1])</code>，「前 4 位」表示成
      <code>(rank[i], rank[i+2])</code>……每轮<strong>比较长度翻倍</strong>，只需 O(log n)
      轮、每轮排序 O(n log n)，合计 <code>O(n log²n)</code>。
    </p>
    <p>
      关键在于<strong>不重复比较字符</strong>：这一轮的 rank 直接由上一轮拼出来，和
      <router-link to="/docs/kmp">KMP</router-link> 用部分匹配表、<router-link to="/docs/manacher"
        >Manacher</router-link
      >
      用回文对称性一样，都是「<strong>复用已算结果</strong>」。
    </p>
    <p>
      下面是 <code>banana</code>。点<strong>「下一步」</strong>逐轮看：每一轮先按关键字
      <strong>(前 k 位 rank, 后 k 位 rank)</strong>
      <strong class="hl-sort">重排</strong>（黄色高亮关键字列），再据相邻是否相等<strong
        class="hl-rank"
        >重编 rank</strong
      >（绿色高亮 rank 列），<code>k</code>
      随之翻倍。两轮后所有 rank 互不相同，后缀数组定型
      <strong>sa = [5,3,1,0,4,2]</strong>（a / ana / anana / banana / na /
      nana）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="suffixArrayModule" />

    <h2>后缀数组能做什么</h2>
    <Callout>
      <b>不同子串计数</b>：一个串的本质不同子串数 = 所有后缀长度之和 − 相邻后缀的 LCP 之和。<br />
      <b>最长重复子串 / 最长公共子串</b>：配合
      <b>height 数组</b>（相邻后缀的最长公共前缀）一趟扫出。<br />
      <b>模式匹配</b>：后缀数组上二分，O(m log n) 判断模式是否出现。
    </Callout>
    <p>
      本页只构造了后缀数组本身；再算一遍<strong>相邻后缀的最长公共前缀（height/LCP）</strong>，上面这些应用就都水到渠成——那是后缀结构的下一步。再往深处走一层是<strong>后缀自动机</strong>（SAM）：把所有子串压进一个
      O(n) 大小的自动机、在线逐字符构造，本质是「后缀们的合并版
      Trie」——数不同子串、最长公共子串等问题在它上面是线性一遍。后缀数组好写好想适合多数场景，SAM
      是学有余力时的下一座山。
    </p>
  </Article>
</template>

<style scoped lang="less">
.hl-sort {
  color: #7a5a00;
}
.hl-rank {
  color: #1f5e3a;
}
</style>
