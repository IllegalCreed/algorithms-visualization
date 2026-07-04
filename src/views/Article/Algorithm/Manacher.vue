<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { manacherModule } from '@/algorithms/manacher.module';
</script>

<template>
  <Article>
    <h1>Manacher 最长回文子串</h1>
    <p class="sub">字符串 · 回文 · O(n)</p>

    <h2>换个方向：分析一个串自己的回文结构</h2>
    <p>
      前三页 <router-link to="/docs/kmp">KMP</router-link> /
      <router-link to="/docs/rabin-karp">Rabin-Karp</router-link> /
      <router-link to="/docs/boyer-moore">Boyer-Moore</router-link>
      都在解决「在文本里找模式」。<strong>Manacher</strong>
      换一个方向——分析<strong>单个串自己</strong>的结构，求它最长的<strong>回文子串</strong>（正着读反着读一样，如
      <code>bab</code>）。朴素做法是枚举每个中心向两边扩展，<code>O(n²)</code>；Manacher
      用两个技巧做到 <strong><code>O(n)</code></strong
      >。
    </p>

    <h2>技巧一：插 # 统一奇偶</h2>
    <p>
      回文分奇（<code>aba</code>）偶（<code>abba</code>）两种，中心一个在字符上、一个在缝隙里，很烦。办法是在每个字符两侧都插入分隔符
      <code>#</code>：<code>babad</code> →
      <code>#b#a#b#a#d#</code
      >。这样<strong>任何回文都变成奇数长、以某个下标为中心</strong>，只需统一处理「以 i
      为中心的回文半径 <code>p[i]</code>」。原串里的回文长度恰好等于 <code>p[i]</code>。
    </p>

    <h2>技巧二：利用对称性复用</h2>
    <p>
      关键在于：维护「目前<strong>向右探到最远</strong>的那个回文」的中心
      <code>C</code> 和右边界 <code>R</code>。当处理新中心 <code>i</code> 且
      <code>i &lt; R</code> 时，<code>i</code> 关于 <code>C</code> 有一个<strong>镜像点</strong>
      <code>2C−i</code>。因为 <code>[.., R]</code> 是回文，<code>i</code>
      附近的情况和镜像点<strong>对称</strong>——于是 <code>p[i]</code> 可以<strong>直接复用</strong>
      <code>min(R−i, p[2C−i])</code>（取 <code>R−i</code> 是因为超出
      <code>R</code> 的部分未知、不能照搬），只需再尝试<strong>扩展超出 R 的那一点点</strong
      >。已经算过的对称信息不重复算，这就是 O(n) 的来源——和
      <router-link to="/docs/kmp">KMP</router-link> 用部分匹配表避免回退是同一种智慧。
    </p>
    <p>
      下面是 <code>babad</code>（转换串
      <code>#b#a#b#a#d#</code
      >）。点<strong>「下一步」</strong>逐中心看：<strong>琥珀环</strong>是当前中心
      <code>i</code>、<strong>蓝环</strong>是镜像点、<strong>浅蓝带</strong>是当前最右回文
      <code>[C,R]</code>、<strong>绿色</strong>是目前最长回文。留意
      <strong>i=5</strong>（复用镜像半径 1 后又扩展到 3）和 <strong>i=7</strong>（被
      <code>R−i</code> 截断）两种情形。走到底，最长回文 = <strong>"bab"</strong>（长
      3）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="manacherModule" />

    <h2>回文问题的基石</h2>
    <Callout>
      <b>最长回文子串 / 子串计数</b>：Manacher 一趟 O(n) 全搞定。<br />
      <b>对照三种匹配</b>：KMP/Rabin-Karp/Boyer-Moore 是「文本里找模式」，Manacher
      是「单串的回文结构」——都靠<b>复用已算信息</b>避免重复劳动。<br />
      <b>更进一步</b>：回文树（PAM）能在线维护一个串的全部回文子串，是回文问题的终极武器。
    </Callout>
    <p>
      至此字符串大类四页：三种<strong>模式匹配</strong>（KMP / Rabin-Karp / Boyer-Moore）+
      一种<strong>回文结构分析</strong>（Manacher）。它们共同的主题是——<strong>用预处理和已知结果，把暴力的重复比较省下来</strong>。
    </p>
  </Article>
</template>
