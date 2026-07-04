<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { convexHullModule } from '@/algorithms/convexhull.module';
</script>

<template>
  <Article>
    <h1>凸包（Convex Hull）</h1>
    <p class="sub">计算几何 · Andrew 单调链 · O(n log n)</p>

    <h2>用橡皮筋套住一堆点</h2>
    <p>
      平面上撒了一堆点，<strong>凸包</strong>就是能把它们全都套住的<strong>最小凸多边形</strong>——想象拿一根橡皮筋绷开、松手让它收紧，最后贴住的那圈外围的点就是凸包的顶点，里面的点被包在内部。凸包是计算几何的地基：碰撞检测、最远点对、最小外接形状、路径规划的第一步，往往都从求凸包开始。
    </p>

    <h2>叉积：一次判断左转还是右转</h2>
    <p>
      核心工具是<strong>叉积</strong>。对三个点
      <code>O, A, B</code>，<code>cross(O,A,B) = (A−O)×(B−O)</code> 的符号告诉你从
      <code>OA</code> 到 <code>OB</code> 是往哪拐：<strong>大于 0</strong>
      是<strong>左转</strong>（逆时针）、<strong>小于 0</strong>
      是<strong>右转</strong>（顺时针）、等于 0
      是三点共线。凸多边形（逆时针）的每个拐角都应该是<strong>左转</strong>；一旦出现右转，说明中间那个点是<strong>凹</strong>的，不该在凸包上。
    </p>

    <h2>单调链：下凸壳 + 上凸壳</h2>
    <p>
      <strong>Andrew 单调链</strong>先把所有点按
      <code>(x, y)</code>
      排序，然后分两趟。<strong>下凸壳</strong>从左到右扫描：维护一个栈，每加入一个点，就看栈顶两点到新点是不是<strong>非左转</strong>（叉积
      ≤
      0）——是就<strong>弹栈</strong>（那个点是凹的），直到左转再把新点压入。<strong>上凸壳</strong>从右到左同样来一遍。两条链拼起来就是完整凸包，复杂度由排序决定，<code
        >O(n log n)</code
      >。
    </p>
    <p>
      下面固定 7
      个点。点<strong>「下一步」</strong>逐步看：<strong>琥珀</strong>是当前正在加入的点、<strong>红色</strong>是这一步因右转被<strong>弹出</strong>的点、灰色折线是当前的凸壳链。先构下凸壳、再构上凸壳，走到底两条链合成一圈<strong>绿色凸包多边形</strong>，中间的点
      <code>(3,3)</code> 被留在里面。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="convexHullModule" />

    <h2>为什么单调链这么优雅</h2>
    <Callout>
      <b>叉积定转向</b>：<code>cross(O,A,B) &gt; 0</code> 左转、<code>&lt; 0</code> 右转、<code
        >= 0</code
      >
      共线。<br />
      <b>排序</b>：按 <code>(x, y)</code> 排好，保证扫描单调、每个点只进出栈常数次。<br />
      <b>弹栈</b>：非左转（叉积 ≤ 0）就弹掉栈顶的凹点，栈里永远是凸的。<br />
      <b>复杂度</b>：排序 <code>O(n log n)</code> 主导，两趟扫描各 <code>O(n)</code>。
    </Callout>
    <p>
      凸包只是计算几何的起点。有了它，<strong>旋转卡壳</strong>能在凸包上 O(n)
      求出最远点对（直径）与最小外接矩形；<strong>Graham 扫描</strong>、<strong
        >礼品包裹（Jarvis 步进）</strong
      >是求凸包的其它经典思路；再往上还有半平面交、最近点对、扫描线等一整套「用叉积和排序处理几何」的方法。
    </p>
  </Article>
</template>
