# 修复：移动端播放器对齐、线性画布裁剪与 CSP 控制台噪声

> Status: verified
> Stable ID: C-20260810-143
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-10
> Last reviewed: 2026-08-10
> Progress: 100%
> Blocked by: none
> Next action: 观察真实 Safari/触控外观（非阻塞）；严格 CSP 另立项
> Replaces: none
> Replaced by: none
> Related plans: C-20260810-140, C-20260810-142
> Related tests: TC-PLAYER-143-01, TC-VIZ-143-02, TC-OPS-143-03

## 背景

C142 修复了手机播放器按钮被 grid 拉成长椭圆的问题，但 390px 以上的手机布局仍存在视觉不平衡：速度选择框固定 96px，右侧进度计数却占满两列并右对齐，左右重心与上方五个主按钮不一致。用户随后指出数组互动页的内部 panel 像被裁切；实测根因是数组画布固定 `448px`，初始 4 格也被放进横向滚动窗口。自托管域控制台还持续显示 AdSense 内部 `adtrafficquality.google` 触发的 CSP Report-Only 红条。

## 用户故事 / 使用场景

- 手机用户希望主播放按钮、倍率、步数和进度条形成清晰、对称的三行控制区，而不是左右重量失衡。
- 手机用户在数组初始状态下应看到完整 panel；只有数组增长到确实放不下时，才需要在组件内部横向拖动。
- 站点维护者希望控制台红色信息能代表真实异常，不被无拦截作用的第三方 CSP 记录淹没。

## 要做什么

- 速度选择与进度计数各占一个最大 120px 的次级控制区，分别居中于前两个和后两个主按钮下方；两者等宽、文字居中、共享对称边距。
- 保持五个主按钮 44×44、进度条整行以及既有播放/快捷键/ARIA 行为。
- 数组互动页手机画布改为按内容增长：初始 4 格不横滚，满载 8 格时才由 `.lane-wrap` 局部横滚。
- 移除自托管 Nginx 中没有上报端点、无法安全转强制的静态 CSP Report-Only 白名单；保留所有实际生效的安全头。
- 中英文共享同一组件行为；桌面播放器与桌面数组画布保持不变。

## 不做什么

- 不缩放树、图、堆等依赖固定坐标的画布；这些画布继续使用组件内部横滚。
- 不改变算法步骤、播放器状态机、结构数据或按钮事件。
- 不为消除 AdSense 动态域名日志而维护不断扩张的静态第三方白名单。
- 本次不实现需要逐响应 nonce 的严格 CSP；该能力需独立服务端 HTML/nonce 方案。

## 业务规则与边界

1. 主控制按钮触控目标仍至少 44×44 CSS px。
2. 倍率框和计数区域在 320、390、430、844px 窄布局下宽度差不超过 1px，左右外侧视觉 inset 差不超过 4px。
3. 数组 4 格时画布不得宽于 wrapper；8 格时 wrapper 必须可滚到最后一格，且页面自身无横向溢出。
4. 移除的 CSP 仅为 `Report-Only`，从未拦截资源；HSTS、nosniff、Referrer-Policy、Permissions-Policy、X-Frame-Options 必须继续返回。
5. Chrome Built-in AI 的 `LanguageDetector` 信息来自浏览器内容脚本，不属于站点错误，也不通过站点代码屏蔽。

## 验收口径

- `TC-PLAYER-143-01` 在 320×800、390×844、430×844、844×390 全绿。
- `TC-VIZ-143-02` 在 320×800、390×844 全绿，并证明初始自适应、满载内部横滚。
- 既有 C140-C142 移动 E2E、播放器/数组组件测试与全量门禁无回归。
- 自托管域响应不再包含 `Content-Security-Policy-Report-Only`，其余五项安全头仍存在，`nginx -t` 通过。
- 自托管域与 GitHub Pages 的代表页面返回 200，线上移动端几何与本地验收一致。

## 开放问题

严格 CSP 需要 nonce/`strict-dynamic`，不在本次静态 SPA 修复范围；后续若引入服务端 HTML 注入能力再单独立项。

## 变更历史

- 2026-08-10：根据移动播放器、数组 panel 与控制台截图建立 C143；播放器和数组均先写 L5 失败几何断言，再修改 CSS。
- 2026-08-10：核对 Google AdSense 官方 CSP 指南后，决定移除无上报端点的静态 Report-Only 白名单，不追逐动态广告域名。

## 验证与发布结果

- `pnpm verify`：通过；304 个测试文件 / 2178 个用例，190 个生产静态页面、SEO 与 bundle 门禁全绿。
- `pnpm coverage`：通过；Statements 93.25%、Branches 84.89%、Functions 90.31%、Lines 93.69%。
- `pnpm exec playwright test --reporter=line`：136/136 通过（chromium 125/125、mobile-chromium 11/11）。
- `pnpm audit --prod`：No known vulnerabilities found。
- `TC-PLAYER-143-01` 与 `TC-VIZ-143-02` 均完成先红后绿；线上自托管复核中速度/计数均 120px、外侧 inset 差 0.02px，数组初始 lane 318/318px，满载 464px 可滚到末格且页面无横溢出。
- 代码提交：`1a6fb1b`；自有域 `./scripts/deploy.sh` 已完成 190 页原子发布；Nginx 备份为 `/root/algo-nginx-c143-20260810142215`，`nginx -t` 与 reload 成功。
- 自有域与 GitHub Pages 首页、`/docs/array/` 均返回 200；五项强制安全头仍存在，`Content-Security-Policy-Report-Only` 已移除，两个域的真实 Chromium 冒烟均无 CSP 违规消息。GitHub Pages workflow `31361592140`、deployment `5827309207` 均为 success。
