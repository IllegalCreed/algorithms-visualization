<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { calipersModule } from '@/algorithms/calipers.module';
</script>

<template>
  <Article>
    <h1>旋转卡壳（凸包直径）</h1>
    <p class="sub">计算几何 · 最远点对 · O(n)</p>

    <h2>最远的两个点在哪</h2>
    <p>
      给一堆点，找<strong>相距最远的两个</strong>（点集的<strong>直径</strong>）。暴力枚举所有点对是
      O(n²)。第一个观察：最远点对的两端一定都在<router-link to="/docs/convex-hull">凸包</router-link
      >上——内部点到谁都不会比凸包顶点更远。但只在凸包顶点上枚举仍是 O(m²)。<strong
        >旋转卡壳（Rotating Calipers）</strong
      >把它压到 O(n)。
    </p>

    <h2>对踵点只会单调前移</h2>
    <p>
      想象拿两块<strong>平行卡板</strong>夹住凸包，然后让它们贴着凸包<strong>旋转一整圈</strong>。任一时刻两块板各贴着凸包的一条边或一个顶点——离一条边最远的那个顶点叫这条边的<strong>对踵点</strong>。关键性质：边沿凸包<strong>逆时针推进</strong>时，对踵点也只会<strong>朝同方向单调前移</strong>，绝不回头。于是用<strong>三角形面积</strong>比较（底边固定时面积越大点越远）：只要「下一个顶点」离当前边更远，对踵点就前移一格。每条边稳定后，检查<strong
        >边两端点 ↔ 对踵点</strong
      >两个候选距离即可。整圈下来边走 n 步、对踵点也最多走 n 步，<strong>O(n)</strong>。
    </p>
    <p>
      下面沿用<router-link to="/docs/convex-hull">凸包</router-link>页的 7 个点（凸包 6
      顶点，常显为绿多边形）。点<strong>「下一步」</strong>逐步看：<strong>琥珀粗线</strong>是当前推进到的凸包边、<strong>蓝色虚线</strong>是本步「边端点↔对踵点」的候选连线、<strong>绿色粗线</strong>是到目前为止的最远点对。转完一圈，直径
      = <strong>6</strong>（点对
      <code>(0,3)↔(6,3)</code>），与暴力枚举一致。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="calipersModule" />

    <h2>一圈搞定的对偶技巧</h2>
    <Callout>
      <b>直径在凸包上</b>：最远点对两端必为凸包顶点。<br />
      <b>对踵点</b>：离一条边最远的顶点；面积比较（叉积绝对值）判断远近。<br />
      <b>单调性</b>：边推进时对踵点只前移不回头 → 两指针各走一圈，O(n)。<br />
      <b>候选</b>：每条边只需检查「边两端 ↔ 对踵点」两个距离。
    </Callout>
    <p>
      同一套「卡板旋转」还能求<strong>最小外接矩形</strong>（面积最小的包围矩形一定有一条边贴着凸包的边）、凸包<strong>宽度</strong>（最窄方向）、两凸包间<strong>最近/最远距离</strong>——旋转卡壳是凸包之上最锋利的一把刀。
    </p>
  </Article>
</template>
