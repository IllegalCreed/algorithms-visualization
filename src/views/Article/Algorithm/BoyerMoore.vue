<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { boyerMooreModule } from '@/algorithms/boyermoore.module';
</script>

<template>
  <Article>
    <h1>Boyer-Moore 字符串匹配</h1>
    <p class="sub">字符串 · 坏字符规则</p>

    <h2>从右往左比，失配就大步跳</h2>
    <p>
      <strong>Boyer-Moore</strong> 是实践中最快的通用串匹配之一（编辑器查找、<code>grep</code>
      的默认多半是它的变体）。它反直觉的地方有两点：<strong>把模式对齐到文本后，从模式的<em>末尾</em>开始、从右往左比</strong>；一旦失配，就用<strong>坏字符规则</strong>把模式<strong>大步右移</strong>——常常一次跳过好几个位置，甚至跳过整段。
    </p>

    <h2>坏字符规则</h2>
    <p>
      预处理出<strong>坏字符表</strong>：每个字符在模式中<strong>最右</strong>出现的位置（不在模式里记
      <code>-1</code>）。P=<code>abc</code> → <code>{a:0, b:1, c:2}</code>。从右往左比时，若在
      <code>P[j]</code> 处失配，看看是哪个<strong>文本字符（坏字符）</strong>没对上：
    </p>
    <p>
      把模式右移，让坏字符对齐到它在模式里的<strong>最右出现处</strong>——右移量
      <code>= j − last[坏字符]</code
      >。如果坏字符<strong>根本不在模式里</strong>，那这一整段对齐都没戏，直接把模式<strong>移过它</strong>（相当于跳过整段）。这就是
      Boyer-Moore 能「跳着走」、平均亚线性的原因。
    </p>
    <p>
      下面是 T=<code>abcabxabc</code>、P=<code>abc</code>（坏字符表
      <code>{a:0,b:1,c:2}</code
      >）。点<strong>「下一步」</strong>逐步看：<strong>浅蓝色</strong>是当前对齐窗口，比较<strong>从右往左</strong>，已匹配的<strong>后缀</strong>标绿。留意两种跳：坏字符
      <code>a</code>（在模式里）<strong>小跳</strong>，坏字符
      <code>x</code>（不在模式里）<strong>大跳、跳过整段</strong>；最终命中于下标
      <code>0</code>、<code>6</code>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="boyerMooreModule" />

    <h2>还有「好后缀规则」</h2>
    <Callout>
      完整的 Boyer-Moore 有<b>两条</b>规则，每次失配取两者给出的<b>较大右移量</b>：<br />
      <b>坏字符规则</b>（本页）：让失配的文本字符对齐模式里它的最右出现处。<br />
      <b>好后缀规则</b>：已经匹配的那段后缀若在模式别处再次出现，就对齐过去（类似 KMP
      的部分匹配表，但针对后缀）。<br />
      只用坏字符规则已经很快；两条合用能保证最坏也不退化。
    </Callout>
    <p>
      至此字符串匹配「三巨头」齐了：<router-link to="/docs/kmp">KMP</router-link>（模式结构 /
      部分匹配表）、<router-link to="/docs/rabin-karp">Rabin-Karp</router-link
      >（滚动哈希）、Boyer-Moore（从右往左 + 坏字符跳）——三条不同的加速路，各有所长。
    </p>
  </Article>
</template>
