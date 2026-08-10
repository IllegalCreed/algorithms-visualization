# 需求：修复固定 Header 的图层遮挡

> Status: verified
> Stable ID: C-20260810-141
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-10
> Last reviewed: 2026-08-10
> Progress: 100%
> Blocked by: none
> Next action: 观察真实 Safari/触控设备的固定壳表现
> Replaces: none
> Replaced by: none
> Related plans: C-20260810-140, C-20260809-139, C-20260809-138
> Related tests: TC-HEADER-141-01

## 背景

移动端滚动算法文章时，文章内的 Playground 标签、结构节点或播放器箭头可能进入固定 Header 的区域并覆盖 Logo/标题。根因是 Header 使用 `position: fixed`，但没有建立明确的层叠层级。

## 要做什么

- 为共享固定 Header 设置高于普通文章定位装饰层的基础 `z-index`。
- 保持 consent、目录抽屉、首页 Sheet 和搜索等模态层高于 Header。
- 增加真实移动视口回归，覆盖内容装饰滚入 Header 区域的场景。

## 不做什么

- 不修改算法步骤、可视化数据、文章内容或播放器布局。
- 不提高模态层级，不改变 Header 的尺寸、导航或焦点交互。

## 验收

- 390×844 手机视口滚动 `/docs/queue` 后，`.playground .tag` 与 Header 重叠区域的命中元素仍属于 `#header`。
- 既有移动端抽屉、搜索、播放器和无横溢回归保持通过。
- 格式、lint、类型、单测、构建/SEO/Bundle 和 Pages 双轨部署通过。
