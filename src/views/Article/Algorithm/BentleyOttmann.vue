<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bentleyModule } from '@/algorithms/bentley.module';
</script>

<template>
  <Article>
    <h1>扫描线求交（Bentley-Ottmann）</h1>
    <p class="sub">计算几何 · 事件驱动 · n 条线段求所有交点</p>

    <h2>从「两条」到「n 条」</h2>
    <p>
      <router-link to="/docs/segment-intersection">线段相交</router-link
      >一页用叉积回答了「两条线段交不交」。现在 n 条线段要找<strong>所有交点</strong>：两两全查是
      <code>O(n²)</code>，可地图上千万条道路的交点远比 n² 稀疏——为「有几个交点就干几分活」，<strong
        >Bentley-Ottmann</strong
      >
      给出 <code>O((n + k) log n)</code>（k 为交点数）。
    </p>

    <h2>一条扫描线，两个数据结构</h2>
    <p>
      想象一条竖直<strong>扫描线</strong>从左往右扫过平面。<strong>事件队列</strong>按 x
      排序存三种事件：线段<strong>起点</strong>（入场）、<strong>终点</strong>（离场）、以及扫描中动态加入的<strong>交点</strong>事件。<strong>状态结构</strong>维护当前与扫描线相交的线段、按交点
      y
      有序。核心洞察：<strong>两条线段相交前，必先在状态结构中相邻</strong>——所以永远不用两两全查，只在插入/删除/交换时检查<strong>新相邻对</strong>，未来的交点丢回事件队列等着扫描线到达。
    </p>
    <p>
      下面三条线段 A、B、C 有 3
      个交点。点<strong>「下一步」</strong>看扫描线（紫虚线）逐事件右移：入场线段亮琥珀、交点事件亮绿并落下红标、离场变灰虚线；vars
      里同步展示状态结构（下 → 上）与新入队的交点。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="bentleyModule" />

    <h2>细节与应用</h2>
    <Callout>
      <b>事件</b>：起点入场 / 终点离场 / 交点报告 + 交换位置——三种都可能制造新相邻对。<br />
      <b>不变量</b>：状态结构始终 = 与扫描线相交的线段按 y 排序；交点事件按 x 先后被处理。<br />
      <b>复杂度</b>：每个事件一次 O(log n) 的队列/平衡树操作，共 2n + k 个事件 → O((n+k) log n)。<br />
      <b>退化</b>：竖直线段、三线共点、重合端点需要额外约定（本页固定实例规避）。
    </Callout>
    <p>
      这套「事件队列 + 扫描线状态」的范式在计算几何里随处可见：GIS 图层叠加、CAD
      布线检查、地图多边形布尔运算（求并/求交），乃至矩形面积并、最近点对的扫描线版本——都是同一个骨架换不同的状态结构。
    </p>
  </Article>
</template>
