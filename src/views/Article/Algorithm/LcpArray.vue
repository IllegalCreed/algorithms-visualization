<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { lcpArrayModule } from '@/algorithms/lcparray.module';
</script>

<template>
  <Article>
    <h1>LCP / height 数组</h1>
    <p class="sub">字符串 · 后缀结构 · Kasai O(n)</p>

    <h2>后缀数组的黄金搭档</h2>
    <p>
      <router-link to="/docs/suffix-array">后缀数组</router-link>
      把所有后缀排好了序，但只有顺序还不够——很多问题要知道<strong>相邻两个后缀有多「像」</strong>。<strong
        >LCP 数组（又叫 height）</strong
      >就补上这一环：<code>lcp[i]</code> = 排序后<strong
        >第 i-1 个和第 i 个后缀的最长公共前缀（Longest Common Prefix）长度</strong
      >。有了 <code>sa</code> + <code>lcp</code>，一大批字符串问题一趟就能算出来。
    </p>

    <h2>Kasai：h 只减 1 的妙处</h2>
    <p>
      直接对每对相邻后缀逐字符比较是 <code>O(n²)</code>。<strong>Kasai 算法</strong>做到
      <code>O(n)</code>，靠一个漂亮的单调性：<strong
        >按后缀在原串中的起点 <code>i = 0,1,2…</code> 的顺序处理</strong
      >（不是按排序顺序！），维护当前的公共前缀长度 <code>h</code>。关键观察——如果后缀
      <code>i</code> 和它的排序前驱有
      <code>h</code> 个公共字符，那么<strong>去掉首字符</strong>的后缀
      <code>i+1</code>，和它自己的排序前驱至少有 <code>h−1</code> 个公共字符。
    </p>
    <p>
      所以每处理一个后缀，<code>h</code> <strong>至多减 1</strong>，之后只增不重比——整个过程
      <code>h</code> 的总变化是 <code>O(n)</code>，字符不重复比较。代价是：LCP
      列会按<strong>原始下标顺序、跳着填</strong>（而非从上到下），这正是 Kasai 聪明的地方。
    </p>
    <p>
      下面复用
      <code>banana</code>
      的后缀数组（<code>sa=[5,3,1,0,4,2]</code>）。点<strong>「下一步」</strong>逐步看：当前处理的后缀行<strong>琥珀高亮</strong>、它的排序前驱行<strong>蓝高亮</strong>，<strong
        >LCP 列</strong
      >被填上；留意 <code>lcp</code> 不是从上往下顺序填的（Kasai 按原始下标跳）。走到底，<code
        >lcp = [0,1,3,0,0,2]</code
      >——<strong>最长重复子串</strong>就是
      <code>max(lcp)=3</code>（"ana"）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="lcpArrayModule" />

    <h2>sa + lcp 能一趟解决什么</h2>
    <Callout>
      <b>最长重复子串</b>：<code>max(lcp)</code>——出现两次以上的最长子串。<br />
      <b>本质不同子串数</b>：<code>n(n+1)/2 − Σlcp</code
      >（所有子串数减去重复计入的公共前缀）。banana → 21 − 6 = <b>15</b>。<br />
      <b>最长公共子串（两个串）</b>：拼接后建 sa + lcp，找分属两串的相邻后缀里最大的 lcp。
    </Callout>
    <p>
      至此字符串大类六页，后缀结构从<strong>构造</strong>（<router-link to="/docs/suffix-array"
        >后缀数组</router-link
      >）走到了<strong>应用</strong>（LCP）——它们和三种匹配、Manacher
      一起，共同的主题依然是<strong>用预处理和已算结果，把暴力比较省下来</strong>。
    </p>
  </Article>
</template>
