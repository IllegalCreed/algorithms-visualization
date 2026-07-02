# 实现记录：二分插入排序 Binary Insertion Sort（C-20260702-044）

> Status: verified
> Stable ID: C-20260702-044
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0**：types.ts 加 `BinaryInsertionExecPoint`；图标 binary-insertion.svg。
2. **T1 module + oracle + sources**（L3）：先 spec（TC-BININS-MOD-01..14）跑红 → 实现三文件跑绿。
3. **T2 BinaryInsertionSort.vue**（L4 全模板）：先 spec 跑红 → 实现跑绿。
4. **T3 接线**：路由 + 菜单/首页「插入排序」后插入 + import 图标 + 改 TC-HOOK-02-4（13→14）。
5. **T4 e2e**（L5）。
6. 全门禁 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **折半三指针**：lo 绿(id'3')/mid 蓝(id'1')/hi 红(id'0')。probe 步三箭头齐 + comparing=[mid,keyIdx]；goLeft/goRight 步只留 lo/hi（mid 已消费）。lo 与 mid 同位时箭头重叠（如 mid=0），可接受。
- **comparing 被 sorted 覆盖**：BarsView stateOf 优先级 sorted > comparing——搜索发生在已排序前缀内，probe 的 comparing 黄不可见（前缀恒绿）。**区间收缩靠三箭头移动 + caption 表达**（设计开放问题预判过）；数据层 comparing 由 MOD-10 断言。不改 stateOf 优先级（会波及全部算法）。
- **shift 复用 C-008 相邻交换滑动**：`[work[k-1],work[k]]=[work[k],work[k-1]]`，key 元组逐格左滑 → FLIP；keyIndex 跟随。源码语义是赋值搬移 `a[k]=a[k-1]`，模块用元组交换实现同一重排（C-008 先例）。
- **≥ 走右保稳定**：`key < a[mid]` 才走左；相等走右半 → 等值新元素落在老元素后面。正文 + caption 都点了这一约束。
- **固定输入路径设计**：[5,2,9,4,7,1,8,3] 保证 goLeft(9)/goRight(6) 都有、零移动轮（key=9 定位即原位）与全移动轮（key=1 shift×5）成对比——正文引导读者对照这两轮。
- 图标 binary-insertion.svg：三柱 + 中央下插箭头（rotate(180) 复用上箭头 path）。

## 自测报告

- 见 [test-cases.md](./test-cases.md)：全门禁绿（单测 915、e2e 39、format/lint/type-check exit 0）；覆盖率 93.53%/90.94%/94.1%/94.37%；真机 probe 三箭头 + 末步升序自检通过。零回归。

## 变更历史

- 2026-07-02：创建（draft）。
