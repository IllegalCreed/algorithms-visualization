<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bitonicModule } from '@/algorithms/bitonic.module';
</script>

<template>
  <Article>
    <h1>双调排序（排序网络）</h1>
    <p class="sub">经典排序算法 · 比较器网络 · 深度 O(log²n)，可并行</p>

    <h2>一张写死的「排序电路」</h2>
    <p>
      前面 15
      个排序都是<strong>程序</strong>：看数据、做判断、决定下一步。双调排序是另一个物种——<strong>排序网络</strong>：一张固定的「电路图」，n
      条水平线（wire）上按固定位置放<strong>比较器</strong>（连接两条线，把小值送一端、大值送另一端）。<strong>比较器的位置与顺序在排序开始前就定死，与数据完全无关。</strong>正因如此，<strong>同一列的比较器互不相干、可以同时执行</strong>——这是
      GPU 和硬件排序的思想根基。
    </p>

    <h2>先造双调，再合并</h2>
    <p>
      <strong>双调序列</strong
      >指「先升后降」（或其循环移位）。网络分两阶段：<strong>构造</strong>——递归地把前半排成升序、后半排成降序，拼在一起就是双调；<strong>双调合并</strong>——对双调序列做一轮<strong
        >距离 n/2</strong
      >
      的成对比较交换，它会神奇地裂成两个双调半区、且前半整体 ≤ 后半，距离减半递归下去就全有序。n=8
      展开后是 <strong>6 列、24 个比较器</strong>：总比较次数 O(n log²n)
      比快排多，但每列并行，<strong>墙钟时间只有 6 拍</strong>。
    </p>
    <p>
      下面固定输入 <code>[5,2,7,1,8,3,6,4]</code>。点<strong>「下一步」</strong>逐列看：8
      条水平线左端标着当前值，比较器竖线上的<strong>小三角指着大值要去的方向</strong>；<strong>琥珀</strong>是正在执行的列（4
      个比较器同时动）、<strong>绿色</strong>是已执行的列。走完第 3 列（列 2），序列变成
      <code>[1,2,5,7,8,6,4,3]</code>——升到 8 再降，<strong>完美双调</strong>；后 3 列距离 4→2→1
      合并，第 6 拍全有序。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="bitonicModule" />

    <h2>为什么值得多做几次比较</h2>
    <Callout>
      <b>数据无关</b>：比较器序列固定 → 无分支、无随机访存，天生适合硬件/SIMD/GPU。<br />
      <b>并行深度</b>：同列并行，总深度 log n·(log n+1)/2 列 = O(log²n) 拍。<br />
      <b>双调合并</b>：距离 n/2 的一轮比较把双调裂成「有序的两个双调半区」。<br />
      <b>0-1 原理</b>：只要网络能排好所有 0/1 序列，就能排好任意序列——排序网络的正确性基石。
    </Callout>
    <p>
      对比一下：快排在 CPU 上无可匹敌，但它的分支和数据依赖让 GPU
      难受；双调排序多做常数倍比较，换来<strong>完全规整的并行结构</strong>，是显卡排序、外部归并预排序的常客。同族的还有
      <strong>Batcher 奇偶归并网络</strong>（比较器更少）与理论上 O(log n) 深度的 AKS
      网络（常数巨大，纸面冠军）——「排序」这件事，在并行世界里有一套自己的谱系。
    </p>
  </Article>
</template>
