<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { kmpModule } from '@/algorithms/kmp.module';
</script>

<template>
  <Article>
    <h1>KMP 字符串匹配</h1>
    <p class="sub">字符串 · 失配跳转不回退</p>

    <h2>在文本里找模式串</h2>
    <p>
      在一段<strong>文本 T</strong>（<code>abababcab</code>）里找<strong>模式串 P</strong
      >（<code>ababc</code>）第一次出现的位置——这是编辑器「查找」、<code>grep</code>、DNA
      比对的基本操作。<strong>朴素</strong>做法：把 P 对齐到 T 的每个位置逐字符比，一旦失配就把 P
      整体右移一格、<strong>从头再比</strong>——最坏
      <code>O(n·m)</code>，因为每次失配都白白丢掉了已经比对成功的信息。
    </p>

    <h2>KMP：失配时「跳」而不是「重来」</h2>
    <p>
      <strong>KMP</strong>
      的洞见：失配时，已经匹配的那段前缀<strong>我们是知道的</strong>，不必从头再比。它预先算出模式串的<strong>部分匹配表</strong>（<code>lps</code>，又叫失败函数
      <code>π</code>）：<code>lps[k]</code> 是
      <code>P[0..k]</code> 里<strong>「既是真前缀又是真后缀」的最长长度</strong>。
    </p>
    <p>
      匹配时用两个指针：<code>i</code> 扫文本、<code>j</code> 扫模式。字符相等，<code>i、j</code>
      一起前进；<strong>失配</strong>时，<strong>文本指针 <code>i</code> 绝不回退</strong>，只把
      <code>j</code> 跳到
      <code>lps[j-1]</code
      >——相当于把模式串向右滑动，让「已匹配前缀的最长可复用后缀」接着比。这样每个文本字符最多被看常数次，总复杂度降到
      <code>O(n + m)</code>。
    </p>
    <p>
      下面是 T=<code>abababcab</code>、P=<code>ababc</code>（其
      <code>π</code> = <code>[0,0,1,2,0]</code>）。点<strong>「下一步」</strong>逐步看：<strong
        >T 行</strong
      >在上、<strong>P 行</strong>按对齐位置滑动、<strong>π 行</strong
      >是部分匹配表。当前比较的两格<strong>琥珀高亮</strong>，已匹配的前缀<strong>变绿</strong>；比到
      <code>abab</code> 后
      <code>a≠c</code>
      失配，<strong>j 用 π 跳回、模式右滑</strong>（留意
      <code>i</code>
      没动！），接着一路匹配到
      <code>ababc</code>——<strong>命中于下标 2</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="kmpModule" />

    <h2>为什么快</h2>
    <Callout>
      朴素匹配失配后 <b>i 回退</b>、模式从头比，同一段文本被反复扫描。<br />
      KMP 靠部分匹配表让
      <b>i 永不回退</b>，模式串「聪明地滑动」，跳过注定失配的对齐——<b>O(n+m)</b>。<br />
      部分匹配表本身也用「模式串和自己匹配」的方式
      <code>O(m)</code> 算出（本页预置展示，构建过程同样精巧）。
    </Callout>
    <p>
      KMP
      是字符串匹配的基石。同一族里还有：<strong>Rabin-Karp</strong>（滚动哈希）、<strong>Boyer-Moore</strong>（从右往左比
      + 坏字符/好后缀跳更远）、以及多模式的
      <strong>AC 自动机</strong>——都是「用预处理换匹配时的跳跃」这一思想的不同展开。
    </p>
  </Article>
</template>
