<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { zModule } from '@/algorithms/zfunc.module';
</script>

<template>
  <Article>
    <h1>Z 函数（扩展 KMP）</h1>
    <p class="sub">字符串 · Z-box · 每个后缀跟开头像多久</p>

    <h2>一个数组回答所有「像不像开头」</h2>
    <p>
      <strong>Z 函数</strong>：z[i] = 整串 s 与后缀 s[i..]
      的<strong>最长公共前缀</strong>（LCP）长度—— 「从 i 开始，跟串的开头能像多久」。它是
      <router-link to="/docs/kmp">KMP</router-link> 部分匹配表 π
      的孪生兄弟（一个看前缀多长的后缀、一个看后缀多像前缀，可互相推出），而且语义更直白。
      朴素做法每个 i 都从零比起，O(n²)。
    </p>

    <h2>Z-box：能抄就抄，出界才比</h2>
    <p>
      加速的抓手叫 <strong>Z-box</strong>：记住<strong>最右</strong>的一段匹配 [l, r)（它是某个 z
      的匹配段、也是串前缀的复制品）。i 落在 box 里时，i 在 box 中的相对位置 i−l
      处「开头怎样」早就算过——<strong>抄镜像</strong> z[i−l]（最多抄到 box 右缘 r−i）：
    </p>
    <Callout>
      <b>①box 外</b>：没得抄，老实逐位右扩。<br />
      <b>②镜像 &lt; 余量</b>：z[i−l] 在 box 里就断了，答案直接抄，<strong>零比较</strong>。<br />
      <b>③镜像达界</b>：抄到 box 右缘还在匹配——右缘外 box 管不着，<strong>继续右扩</strong>，
      扩多远算多远，然后把 box 刷新到这段新匹配。<br />
      O(n) 的账本：<strong>每次成功比较都推进 r，而 r 永不回退</strong>——总比较 ≤ n 次。
    </Callout>
    <p>
      下图上行是 s、下行是逐格点亮的 z 数组；浅蓝带 = 当前 Z-box，琥珀环 = 当前 i，蓝环 =
      镜像位置，绿 = 当前匹配段。右侧代码随步同步高亮。
    </p>

    <AlgorithmPlayer :module="zModule" />

    <h2>拿它做什么</h2>
    <p>
      最经典的用法是<strong>模式匹配</strong>：找 P 在 T 中的出现，对拼接串
      <code>P#T</code> 求 Z（# 是不出现的分隔符，挡住跨界匹配），凡 z[i] = |P| 处即一次命中——和 KMP
      同为 O(n+m)，但推导几乎零门槛。还有<strong>周期性判定</strong>（若 i + z[i] = n，则 s 以前 i
      个字符为周期循环——最小的这样的 i 就是最小周期）、字符串压缩、与 π 表互算。三兄弟各有绝活：π
      适合流式匹配（<router-link to="/docs/kmp">KMP</router-link>）、Z
      语义最直白、后缀数组（<router-link to="/docs/suffix-array">构造</router-link>·<router-link
        to="/docs/lcp-array"
        >LCP</router-link
      >）打持久战；而 Z-box 的「区间内抄镜像」和
      <router-link to="/docs/manacher">Manacher</router-link>
      的最右回文带是同一招——本页可视化直接复用了它的画布。
    </p>
  </Article>
</template>
