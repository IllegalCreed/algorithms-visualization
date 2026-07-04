# 需求：扫描线求交 Bentley-Ottmann（C-20260705-088，计算几何第 5 页 · HullView additive）

> Status: verified
> Stable ID: C-20260705-088
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

C-084 线段相交解决了「两条线段是否相交」；n 条线段求**所有交点**若暴力两两判交是 O(n²)。**Bentley-Ottmann 扫描线**用 O((n+k) log n)（k 为交点数）：一条竖直扫描线从左往右扫，**事件队列**（按 x 排序：线段起点/终点/交点三种事件）驱动推进；**状态结构**维护当前与扫描线相交的线段（按 y 有序）。核心洞察：**两条线段相交前必先在状态结构中相邻**——所以只需在插入/删除/交换时检查新相邻对，而不是两两全查。

## 目标

计算几何第 5 页「扫描线求交」，接入播放器，**复用 HullView（第 5 消费者，additive 扩展）**：

1. **平面轨**：3 条线段（6 端点 + 3 边）；`divider` 紫竖线当扫描线随事件推进；`edgeClasses` 表线段状态（未入场/已离场灰虚线、状态中实线、start 主角琥珀、cross 双边绿）；**新增 `marks`（已发现交点红标）+ `markActive`（本步报告交点，放大）**——additive 可选字段，旧消费者不传零回归。
2. 固定实例（Python 已核验）：A(1,1)-(9,9)、B(2,8)-(8,2)、C(2.5,6)-(8.5,6)；交点 **(4,6) B×C、(5,5) A×B、(6,6) A×C**；事件序 x=1/2/2.5 start、4/5/6 cross、8/8.5/9 end；init + 9 事件 + done = 11 步。vars 展示事件队列与状态结构（下→上 y 序）。
3. 正文：暴力 O(n²) → 扫描线三种事件 → 「相交前必相邻」洞察 → 应用（GIS 叠加/CAD/地图布尔运算）；双向链接 C-084 线段相交（叉积判交是本页子程序）。

## 验收标准

- `/docs/bentley-ottmann` 新页：正文 + 播放器同屏，四语言随步高亮；扫描线随事件右移、交点逐个点亮；done 报 3 个交点。
- 菜单 + 首页「计算几何」第 5 项，新图标；改 TC-HOOK（计算几何 children +bentley-ottmann）；C-084 页尾双向链接。
- 全门禁 + 真机自检；HullView additive（凸包/卡壳/最近点对/线段相交 4 既有消费者零回归）。

## 非目标

- 不做退化处理（垂直线段/三线共点/重合端点——固定实例规避，正文点到）；不做平衡树实现细节（状态结构以有序列表呈现）。
- 不改 AlgorithmPlayer；HullView 仅 additive 加 2 可选字段。

## 变更历史

- 2026-07-05：创建（draft → approved）。扫描线 Bentley-Ottmann，HullView additive marks/markActive；3 线段 3 交点 11 步。
- 2026-07-05：交付验收（approved → verified）。18 Case 全绿 + 改 2 HOOK；真机 cross 步紫虚扫描线 + 双边绿 + 交点红标琥珀圈正落交叉处、末步 3 红标；HullView 4 既有消费者零回归（e2e 5/5）。
