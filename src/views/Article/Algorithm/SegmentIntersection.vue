<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { segIntModule } from '@/algorithms/segint.module';
</script>

<template>
  <Article>
    <h1>线段相交（跨立试验）</h1>
    <p class="sub">计算几何 · 叉积判定 · O(1) / 对</p>

    <h2>两条线段交不交？</h2>
    <p>
      判断两条线段是否相交，是几何里最基本的判定——扫描线求交、多边形裁剪、碰撞检测都由它一块块搭起来。直觉做法是解直线方程求交点再验范围，但除法带来精度陷阱。计算几何的答案还是那把刀：<router-link
        to="/docs/convex-hull"
        >叉积</router-link
      >——<strong>只用乘法和符号比较</strong>。
    </p>

    <h2>互相跨立</h2>
    <p>
      线段 AB 与 CD 相交，等价于<strong>互相跨立</strong>：<strong>A、B 分居直线 CD 两侧</strong
      >，同时 <strong>C、D 分居直线 AB 两侧</strong>。「在哪一侧」正是叉积的符号：算四个数
      <code>D1=cross(C,D,A)</code
      >、<code>D2=cross(C,D,B)</code>、<code>D3=cross(A,B,C)</code>、<code>D4=cross(A,B,D)</code>。若
      <code>D1·D2&lt;0</code> 且 <code>D3·D4&lt;0</code>（两两异号）→
      <strong>规范相交</strong>；若某个 D 为
      <strong>0</strong
      >，说明有端点落在对方所在直线上——再查它是否落在对方线段的<strong>包围框</strong>内，是则<strong>端点相触</strong>（也算相交）。任何一组同号即可提前判否。
    </p>
    <p>
      下面固定三对线段，正好覆盖三种结局。点<strong>「下一步」</strong>逐步看：当前对<strong>琥珀</strong>高亮并给出四个叉积；判定后<strong>绿色</strong>=相交、<strong>灰色虚线</strong>=不相交。第
      1 对两两异号规范相交；第 2 对 D1、D2 <strong>同号</strong>一步判否；第 3 对
      <code>D3=0</code>、端点
      <code>(7,1)</code> 恰落在对方线段上——<strong>相触</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="segIntModule" />

    <h2>四个叉积，零除法</h2>
    <Callout>
      <b>跨立</b>：AB、CD 相交 ⟺ 两端点互相分居对方直线两侧。<br />
      <b>判定</b>：D1·D2 &lt; 0 且 D3·D4 &lt; 0 → 规范相交；同号 → 不相交。<br />
      <b>边界</b>：D = 0（共线）时补包围框检查 → 端点相触。<br />
      <b>鲁棒</b>：全程乘法 + 比较，整数坐标下零精度误差。
    </Callout>
    <p>
      有了 O(1) 的相交判定，把 n 条线段的端点按 x
      排序、用一条竖直<strong>扫描线</strong>从左扫到右、动态维护「当前与扫描线相交的线段」的上下邻居关系，就得到求全部交点的
      <router-link to="/docs/bentley-ottmann"
        ><strong>Bentley-Ottmann 扫描线算法</strong></router-link
      >（O((n+k) log n)）。至此，叉积在本大类里判过<strong>转向</strong>（<router-link
        to="/docs/convex-hull"
        >凸包</router-link
      >）、量过<strong>远近</strong>（<router-link to="/docs/rotating-calipers">卡壳</router-link
      >）、断过<strong>相交</strong>——一把刀，整个计算几何。
    </p>
  </Article>
</template>
