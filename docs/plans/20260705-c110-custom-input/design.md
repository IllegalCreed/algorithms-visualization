# 设计：播放器自定义输入 + ?input= 分享（C-20260705-110，M10-P1）

> Status: verified
> Stable ID: C-20260705-110
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 分层设计

**types.ts（additive）**：

```ts
export interface InputSpec {
  hint: string; // 输入条占位说明
  lenMin: number; lenMax: number;
  valMin: number; valMax: number;
}
export interface AlgorithmModule<P> {
  …
  inputSpec?: InputSpec; // 纯加法：不设 = 播放器不渲染输入条
}
```

**player/inputSpec.ts（新，纯函数 + 常量）**：`parseInputArray(text, spec): {ok:true, value:number[]} | {ok:false, error:string}`——按 `/[,，\s]+/` 切分、Number 化、整数校验、长度/值域校验（错误消息中文具体）；`SORT_INPUT_SPEC` 常量（hint「2~12 个 1..99 的整数，用逗号分隔」）。

**usePlayer**：签名 `steps: Step[] | Ref<Step[]>`，内部 `isRef ? steps : shallowRef(steps)`，全部读 `.value`——既有数组调用零破坏（L3 usePlayer.spec 原样绿）。

**InputBar.vue（新）**：props `{spec, modelText}`；文本框 + 应用（emit 'apply' 带解析结果）+ 恢复默认（emit 'restore'）+ `.input-error` 行内提示；样式沿用 neumorphism 混入。

**AlgorithmPlayer**：

```ts
const initialFromUrl = readInputFromUrl(module.inputSpec); // ?input= 合法才用
const input = shallowRef(initialFromUrl ?? module.initialInput());
const steps = shallowRef(module.buildSteps(input.value));
const player = usePlayer(steps);
function applyInput(arr) { input.value = arr; steps.value = module.buildSteps(arr); player.reset(); writeInputToUrl(arr); }
function restoreInput() { …initialInput()…; clearInputFromUrl(); }
```

模板：`<InputBar v-if="module.inputSpec" …/>` 一行（同可插拔轨惯例）。URL 读写用 `URLSearchParams` + `history.replaceState`（不碰 vue-router；与 404.html 编码互不影响——replaceState 仅改 query）。

**模块层**：12 个排序 module 各 +`inputSpec: SORT_INPUT_SPEC`（import 自 player/inputSpec）。

## 测试

L3 解析纯函数 6 例；L4 InputBar 4 例 + AlgorithmPlayer 集成 5 例（含「无 inputSpec 不渲染」回归）+ 12 模块聚合断言 1 例；L5 e2e 1 例（quick-sort 改输入全链路 + URL）。

## 零回归论证

inputSpec 可选——53 个固定剧本 + 10 个未开放输入模块不设，播放器行为与 UI 完全不变；usePlayer 兼容层保持数组签名可用；URL 无 `?input=` 时路径与旧版全等。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致（less 混入带必选参数 (2px, 8px)）。
