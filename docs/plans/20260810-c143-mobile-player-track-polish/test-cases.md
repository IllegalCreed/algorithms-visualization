# 测试用例：移动端播放器、数组画布与 CSP 收口

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
> Related requirement: requirements.md

| Case ID          | 标题                         | 层级       | 类型       | 前置条件              | 步骤                                                         | 期望                                            | 自动化路径                     | 状态     |
| ---------------- | ---------------------------- | ---------- | ---------- | --------------------- | ------------------------------------------------------------ | ----------------------------------------------- | ------------------------------ | -------- |
| TC-PLAYER-143-01 | 移动倍率与计数双列重心对齐   | L5         | regression | `/docs/binary-answer` | 在 320×800、390×844、430×844、844×390 读取两组几何和对齐样式 | 两组等宽、居中，外侧 inset 差≤4px               | `e2e/responsive.mobile.e2e.ts` | verified |
| TC-VIZ-143-02    | 数组短内容完整、满载内部横滚 | L5         | regression | `/docs/array`         | 读取初始 4 格边界；追加到 8 格并滚到末端                     | 初始 panel 不裁切；满载末格可达；页面无横溢出   | `e2e/responsive.mobile.e2e.ts` | verified |
| TC-OPS-143-03    | 自托管安全头与控制台冒烟     | ops/manual | regression | 新 snippet 已上传     | `nginx -t` + reload；curl header；真实浏览器打开代表页       | 无 CSP Report-Only；五项强制头存在；无 CSP 红条 | manual + deployment log        | verified |

## 执行结果

三条 Case 均已验证：两条 L5 先红后绿，随后 304/2178 单测、coverage、136/136 E2E、双 base 构建、自有域部署与 Nginx/线上响应头冒烟全部通过。Pages workflow `31361592140`、deployment `5827309207` 均 success；两个域的代表页和移动端几何均已复核。
