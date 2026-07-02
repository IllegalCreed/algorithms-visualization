# 实现记录：老排序页全模板化（C-20260702-046，M8③）

> Status: verified
> Stable ID: C-20260702-046
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每页 spec 加 -03 跑红 → 视图补正文跑绿）

按算法族分批推进（每批：spec 加 -03 + 视图补正文 + e2e 扩断言 → 跑该批 spec）：

1. **交换族**：冒泡 / 选择 / 快速（Stack 轨）。
2. **插入族**：插入 / 希尔。
3. **归并+堆**：归并（Aux 轨）/ 堆（Tree 轨）。
4. **非比较族**：计数（Count 轨）/ 基数（Count 轨）。
5. 全门禁 → 真机抽查 → 回写（三索引 +9 L4 Case、roadmap M8③、backlog）→ 两提交 → 双轨部署。

## 关键实现笔记

- **纯视图层、零逻辑改动**：9 页各 3 处改动（.vue 补正文 + .spec 加 -03 + .e2e 扩 `.article h1`），不碰任何 algorithms/ 模块、轨道组件、播放器、类型、路由、菜单、图标。既有 -01/-02 视图 Case 与 9 e2e 既有断言全部零改动通过（Article 内嵌播放器，Bar 数/轨道/counter/scrub 选择器不变）。
- **各页正文取角**（算法特定、不套模板）：冒泡=气泡右侧渐绿/对照鸡尾酒；选择=每轮只换一次/对照堆排；插入=理牌 keyIndex/对照二分插入+希尔；希尔=大间隔分组 dimmed/前置插入；归并=自底向上 temp 轨/对照自顶向下；快速=Lomuto+区间栈+pivot 紫/对照三路+双轴；堆=大顶堆树轨深紫/对照数据结构堆+IntroSort；计数=萝卜一个坑空桶/对照基数+桶；基数=按位 10 桶/对照计数+桶。每页 Callout 用已建成的对照页织网。
- **播放器嵌正文中段**（「怎么做」段后、「复杂度」段前），同 C-040~C-045。演示数据引用各页 initialInput，描述可视化里真能看到的现象（渐绿/dimmed/pivot 紫/树轨/空桶）。
- **Case ID 延续既有前缀**：9 页视图 Case 本就是 TC-VIEW-{BUBBLE...RADIX}-01/02（原始变更所有），本变更加 -03 归 C-046。e2e 扩断言不新增 Case（增强既有 TC-E2E-\*）。
- **无坑**：一次跑通（补正文不改行为，既有断言天然兼容）；prettier 重排正文长行属无害。真机 5 页抽查（覆盖无轨/Stack/Aux/Tree/Count 全部轨型）三件套同屏、末步升序。

## 自测报告

- 见 [test-cases.md](./test-cases.md)：全门禁绿（单测 940、e2e 40、format/lint/type-check exit 0）；覆盖率 93.57%/91.86%/94.18%/94.4%；真机 5 页代表抽查通过。零回归。全站 15 排序页全模板，M8③ 达成。

## 变更历史

- 2026-07-02：创建（draft）。
