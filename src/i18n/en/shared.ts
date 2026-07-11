import type { AlgorithmModule, LangSource, Step, VarRow } from '@/components/player/types';

const SOURCE_COMMENT_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['tree[i] 管辖长 lowbit(i) 的区段和', 'tree[i] stores a lowbit(i)-wide range sum'],
  ['tree[i] 管辖长 lowbit(i)', 'tree[i] covers lowbit(i) values'],
  ['目标在右半：扔掉左半', 'target is right: discard the left half'],
  ['目标在左半：扔掉右半', 'target is left: discard the right half'],
  ['区间清空：不存在', 'empty range: not found'],
  ['失配：跳转，i 不回退', 'mismatch: jump without rewinding i'],
  ['j=0 失配：文本前进', 'mismatch at j=0: advance the text'],
  ['下 + 上凸壳拼接', 'concatenate lower and upper hulls'],
  ['下凸壳：左 → 右', 'lower hull: left to right'],
  ['上凸壳：右 → 左', 'upper hull: right to left'],
  ['非左转弹栈', 'pop non-left turns'],
  ['叉积 (A-O)×(B-O)', 'cross product (A-O)x(B-O)'],
  ['按 (x,y) 排序', 'sort by (x,y)'],
  ['候选区间', 'candidate range'],
  ['探针：取中点', 'probe the midpoint'],
  ['最低位的 1', 'least significant set bit'],
  ['前缀和', 'prefix sum'],
  ['沿链往前跳', 'follow the chain backward'],
  ['通知每个管辖者', 'update every covering node'],
  ['命中', 'match found'],
  ['拼接', 'concatenate'],
];

const TECHNICAL_TEXT_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['交点事件动态加入', 'enqueue intersection events dynamically'],
  ['一次性确认', 'confirm together'],
  ['个端点事件', 'endpoint events'],
  ['个蝶形并行', 'parallel butterflies'],
  ['互质的个数', 'coprime count'],
  ['先升后降', 'ascending then descending'],
  ['位反转重排', 'bit-reversal permutation'],
  ['对踵点单调前移', 'advance the antipodal point monotonically'],
  ['对比朴素', 'compare with brute force'],
  ['对比逐点', 'compare with point-by-point work'],
  ['已发现交点', 'discovered intersections'],
  ['指数二进制', 'binary exponent'],
  ['直接抄镜像', 'reuse the mirror directly'],
  ['算法名字的由来', 'source of the algorithm name'],
  ['镜像复用', 'mirror reuse'],
  ['贴着上界', 'tight to the upper bound'],
  ['达界待验', 'reaches the boundary and needs verification'],
  ['选中指数和', 'sum of selected exponents'],
  ['香蕉堆', 'banana piles'],
  ['一个', 'one'],
  ['不相交', 'disjoint'],
  ['不合法', 'invalid'],
  ['不取', 'skip taking'],
  ['不同', 'different'],
  ['不用', 'unused'],
  ['不跳', 'do not jump'],
  ['不选', 'not selected'],
  ['个位', 'ones digit'],
  ['个数', 'count'],
  ['中转', 'intermediate'],
  ['为子', 'as child'],
  ['之间', 'between'],
  ['乘入', 'multiply into'],
  ['事件', 'event'],
  ['伪装者', 'probable prime'],
  ['位上', 'at digit'],
  ['位反转', 'bit reversal'],
  ['位数', 'digit count'],
  ['倍增', 'binary lifting'],
  ['元素', 'element'],
  ['先算', 'compute first'],
  ['全部', 'all'],
  ['凸包', 'convex hull'],
  ['分解', 'decompose'],
  ['分配', 'distribute'],
  ['列数', 'column count'],
  ['刚消的', 'just consumed'],
  ['判半', 'choose a half'],
  ['判定', 'verdict'],
  ['判断', 'check'],
  ['剩余', 'remaining'],
  ['十位', 'tens digit'],
  ['半有序', 'half sorted'],
  ['单峰', 'unimodal'],
  ['原串', 'original string'],
  ['双跳', 'jump both'],
  ['取舍', 'take or skip'],
  ['变量', 'variable'],
  ['只用', 'use only'],
  ['可达', 'reachable'],
  ['可选数', 'available values'],
  ['各走一次', 'visit each once'],
  ['合计', 'total'],
  ['同余组', 'congruence system'],
  ['同余', 'congruence'],
  ['后序', 'postorder'],
  ['回代', 'back substitute'],
  ['坏', 'bad'],
  ['城对称', 'symmetric cities'],
  ['基例', 'base case'],
  ['增广路', 'augmenting path'],
  ['复杂度', 'complexity'],
  ['大小', 'size'],
  ['奇度点', 'odd-degree vertex'],
  ['子句', 'clause'],
  ['字母', 'letter'],
  ['宫', 'box'],
  ['对踵点', 'antipodal point'],
  ['对齐', 'align'],
  ['小时', 'when smaller'],
  ['小计', 'subtotal'],
  ['层序', 'level order'],
  ['岛屿数', 'island count'],
  ['已填', 'filled'],
  ['已增广', 'augmented'],
  ['已建', 'built'],
  ['已扩展', 'expanded'],
  ['已找', 'searched'],
  ['已找到', 'found'],
  ['已收集', 'collected'],
  ['已数陆地', 'counted land'],
  ['已断', 'broken'],
  ['已着色', 'colored'],
  ['已确认', 'confirmed'],
  ['平方', 'square'],
  ['并行', 'parallel'],
  ['序列', 'sequence'],
  ['底数', 'base'],
  ['度数', 'degree'],
  ['延续', 'continue'],
  ['建表', 'build table'],
  ['弹出序', 'pop order'],
  ['弹出', 'pop'],
  ['形状', 'shape'],
  ['循环', 'loop'],
  ['总方案数', 'total solutions'],
  ['扩展', 'extend'],
  ['找出一个非平凡', 'find a nontrivial'],
  ['拉宾判素', 'Miller-Rabin primality test'],
  ['排列', 'permutation'],
  ['收集', 'collect'],
  ['数字', 'digit'],
  ['断崖', 'break point'],
  ['断裂', 'broken'],
  ['新入队', 'newly enqueued'],
  ['方向', 'direction'],
  ['方案数', 'solution count'],
  ['无重复', 'without duplicates'],
  ['显影', 'reveal'],
  ['暴力', 'brute force'],
  ['曼哈顿', 'Manhattan'],
  ['最优', 'optimal'],
  ['最远', 'farthest'],
  ['有向', 'directed'],
  ['有序', 'ordered'],
  ['期望', 'expected'],
  ['本层', 'current layer'],
  ['本次耗时', 'current cost'],
  ['本行', 'current row'],
  ['桶内排序', 'sort within bucket'],
  ['欧拉', 'Eulerian'],
  ['沿用上一行', 'reuse previous row'],
  ['流水线', 'pipeline'],
  ['物品', 'item'],
  ['瓶颈', 'bottleneck'],
  ['用一枚', 'use one coin'],
  ['用不了', 'cannot use'],
  ['百位', 'hundreds digit'],
  ['的子', ' child'],
  ['直径', 'diameter'],
  ['直算', 'direct computation'],
  ['相交', 'intersect'],
  ['石堆', 'stone piles'],
  ['硬币', 'coin'],
  ['算完', 'computed'],
  ['米勒', 'Miller-Rabin'],
  ['累计', 'accumulated'],
  ['线段对', 'segment pair'],
  ['线段', 'segment'],
  ['组合', 'combination'],
  ['结论', 'conclusion'],
  ['网格', 'grid'],
  ['蕴含', 'implication'],
  ['装不下', 'does not fit'],
  ['装作不知道', 'hide the known factor'],
  ['见代码', 'see code'],
  ['规则', 'rule'],
  ['试探', 'try'],
  ['试除', 'trial division'],
  ['误报率', 'false-positive rate'],
  ['输入', 'input'],
  ['输出', 'output'],
  ['递推', 'recurrence'],
  ['速度', 'speed'],
  ['配对', 'pairing'],
  ['金额', 'amount'],
  ['镜像', 'mirror'],
  ['阶段', 'phase'],
  ['陆地', 'land'],
  ['限时', 'time limit'],
  ['非平凡', 'nontrivial'],
  ['面额', 'denomination'],
  ['当前最优解', 'current best answer'],
  ['当前最小值', 'current minimum'],
  ['当前最大值', 'current maximum'],
  ['当前节点', 'current node'],
  ['当前区间', 'current interval'],
  ['当前状态', 'current state'],
  ['最终答案', 'final answer'],
  ['最终结果', 'final result'],
  ['最短距离', 'shortest distance'],
  ['最大匹配', 'maximum matching'],
  ['最小生成树', 'minimum spanning tree'],
  ['强连通分量', 'strongly connected component'],
  ['路径压缩', 'path compression'],
  ['前缀和', 'prefix sum'],
  ['后缀数组', 'suffix array'],
  ['最长公共前缀', 'longest common prefix'],
  ['最长公共子序列', 'longest common subsequence'],
  ['最长递增子序列', 'longest increasing subsequence'],
  ['二分查找', 'binary search'],
  ['线性探测', 'linear probing'],
  ['增广路径', 'augmenting path'],
  ['残量网络', 'residual network'],
  ['回溯', 'backtrack'],
  ['递归', 'recursion'],
  ['初始化', 'initialize'],
  ['已完成', 'complete'],
  ['完成', 'complete'],
  ['开始', 'start'],
  ['结束', 'finish'],
  ['选择', 'select'],
  ['查找', 'search'],
  ['查询', 'query'],
  ['更新', 'update'],
  ['插入', 'insert'],
  ['删除', 'delete'],
  ['访问', 'visit'],
  ['比较', 'compare'],
  ['交换', 'swap'],
  ['移动', 'move'],
  ['跳过', 'skip'],
  ['跳转', 'jump'],
  ['合并', 'merge'],
  ['拆分', 'split'],
  ['分割', 'partition'],
  ['松弛', 'relax'],
  ['匹配', 'match'],
  ['命中', 'hit'],
  ['失败', 'fail'],
  ['成功', 'success'],
  ['冲突', 'conflict'],
  ['候选', 'candidate'],
  ['答案', 'answer'],
  ['结果', 'result'],
  ['状态', 'state'],
  ['步骤', 'step'],
  ['轮次', 'round'],
  ['第', 'number '],
  ['轮', 'round'],
  ['步', 'step'],
  ['次数', 'count'],
  ['数量', 'count'],
  ['长度', 'length'],
  ['高度', 'height'],
  ['深度', 'depth'],
  ['下标', 'index'],
  ['索引', 'index'],
  ['位置', 'position'],
  ['区间', 'interval'],
  ['范围', 'range'],
  ['数组', 'array'],
  ['矩阵', 'matrix'],
  ['表格', 'table'],
  ['节点', 'node'],
  ['顶点', 'vertex'],
  ['边', 'edge'],
  ['路径', 'path'],
  ['队列', 'queue'],
  ['栈', 'stack'],
  ['集合', 'set'],
  ['子树', 'subtree'],
  ['父节点', 'parent'],
  ['孩子', 'child'],
  ['根', 'root'],
  ['左侧', 'left side'],
  ['右侧', 'right side'],
  ['左边', 'left'],
  ['右边', 'right'],
  ['左', 'left'],
  ['右', 'right'],
  ['前驱', 'predecessor'],
  ['后继', 'successor'],
  ['入度', 'indegree'],
  ['出度', 'outdegree'],
  ['距离', 'distance'],
  ['权重', 'weight'],
  ['容量', 'capacity'],
  ['流量', 'flow'],
  ['价值', 'value'],
  ['值', 'value'],
  ['总和', 'sum'],
  ['代价', 'cost'],
  ['成本', 'cost'],
  ['目标', 'target'],
  ['基准', 'pivot'],
  ['字符', 'character'],
  ['文本', 'text'],
  ['模式', 'pattern'],
  ['前缀', 'prefix'],
  ['后缀', 'suffix'],
  ['余数', 'remainder'],
  ['因子', 'factor'],
  ['质数', 'prime'],
  ['素数', 'prime'],
  ['真', 'true'],
  ['假', 'false'],
  ['存在', 'exists'],
  ['不存在', 'absent'],
  ['为空', 'empty'],
  ['空', 'empty'],
  ['未访问', 'unvisited'],
  ['已访问', 'visited'],
  ['未选', 'not selected'],
  ['已选', 'selected'],
  ['当前', 'current'],
  ['最小', 'minimum'],
  ['最大', 'maximum'],
  ['相等', 'equal'],
  ['小于', 'less than'],
  ['大于', 'greater than'],
  ['可行', 'feasible'],
  ['不可行', 'infeasible'],
  ['无穷', 'infinity'],
  ['无解', 'no solution'],
  ['有解', 'solution exists'],
  ['其实', 'actually'],
  ['找出', 'find'],
  ['一', 'one'],
  ['上', 'up'],
  ['下', 'down'],
  ['不', 'not'],
  ['与', 'and'],
  ['个', 'count'],
  ['中', 'middle'],
  ['为', 'as'],
  ['乘', 'multiply'],
  ['从', 'from'],
  ['位', 'digit'],
  ['元', 'item'],
  ['兔', 'hare'],
  ['全', 'all'],
  ['列', 'column'],
  ['半', 'half'],
  ['取', 'take'],
  ['和', 'sum'],
  ['回', 'return'],
  ['子', 'child'],
  ['对', 'pair'],
  ['尾', 'tail'],
  ['层', 'level'],
  ['差', 'difference'],
  ['已', 'already'],
  ['往', 'toward'],
  ['扩', 'expand'],
  ['拍', 'pass'],
  ['数', 'number'],
  ['本', 'current'],
  ['条', 'count'],
  ['树', 'tree'],
  ['格', 'cell'],
  ['桶', 'bucket'],
  ['次', 'times'],
  ['求', 'compute'],
  ['汇', 'sink'],
  ['流', 'flow'],
  ['深', 'deep'],
  ['源', 'source'],
  ['点', 'point'],
  ['父', 'parent'],
  ['环', 'cycle'],
  ['禁', 'forbidden'],
  ['级', 'level'],
  ['表', 'table'],
  ['解', 'solution'],
  ['词', 'word'],
  ['起', 'start'],
  ['选', 'select'],
  ['重', 'duplicate'],
  ['长', 'length'],
  ['间', 'between'],
  ['集', 'set'],
  ['零', 'zero'],
  ['项', 'term'],
  ['龟', 'tortoise'],
  ['到', 'to'],
  ['区', 'region'],
  ['命', 'hit'],
  ['因', 'factor'],
  ['度', 'degree'],
  ['文', 'literal'],
  ['水', 'water'],
  ['盘', 'board'],
  ['素', 'prime'],
  ['组', 'group'],
  ['节', 'node'],
  ['质', 'prime'],
  ['量', 'amount'],
  ['队', 'queue'],
  ['顶', 'top'],
];

const HAN = /[\u3400-\u9fff]+/g;
const HAS_HAN = /[\u3400-\u9fff]/;

function replaceKnownTechnicalText(text: string): string {
  let translated = text;
  for (const [chinese, english] of TECHNICAL_TEXT_REPLACEMENTS) {
    translated = translated.replaceAll(chinese, ` ${english} `);
  }
  return translated;
}

export function findUntranslatedTechnicalText(text: string): string[] {
  return [...new Set(replaceKnownTechnicalText(text).match(HAN) ?? [])];
}

export function translateTechnicalText(text: string): string {
  return replaceKnownTechnicalText(text)
    .replace(HAN, '[translation pending]')
    .replaceAll('，', ', ')
    .replaceAll('。', '.')
    .replaceAll('：', ': ')
    .replaceAll('；', '; ')
    .replaceAll('（', '(')
    .replaceAll('）', ')')
    .replaceAll('、', ', ')
    .replace(/[ \t]+([,.;:)])/g, '$1')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function humanizePoint(point: string): string {
  return point
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replaceAll('_', ' ')
    .toLowerCase();
}

function translateSourceCode<P extends string>(source: LangSource<P>, code: string): string {
  const linePoints = Object.entries(source.lineMap) as Array<[P, number]>;
  return code
    .split('\n')
    .map((line, index) => {
      const known = replaceKnownTechnicalText(line);
      if (!HAS_HAN.test(known)) return known;
      const lineNumber = index + 1;
      const nearest = [...linePoints].sort(
        (left, right) => Math.abs(left[1] - lineNumber) - Math.abs(right[1] - lineNumber),
      )[0]?.[0];
      const note = nearest ? humanizePoint(nearest) : 'algorithm step';
      return known.replace(HAN, note);
    })
    .join('\n')
    .replaceAll('，', ', ')
    .replaceAll('。', '.')
    .replaceAll('：', ': ')
    .replaceAll('；', '; ')
    .replaceAll('（', '(')
    .replaceAll('）', ')')
    .replaceAll('、', ', ')
    .replace(/[ \t]+([,.;:)])/g, '$1');
}

function localizeStructuredValue(value: unknown): unknown {
  if (typeof value === 'string') return translateTechnicalText(value);
  if (Array.isArray(value)) return value.map(localizeStructuredValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localizeStructuredValue(item)]),
    );
  }
  return value;
}

type CaptionFactory<P extends string> = string | ((step: Step<P>) => string);

export interface EnglishAdapterOptions<P extends string> {
  title: string;
  captions: Record<P, CaptionFactory<P>>;
  inputHint?: string;
  sourceReplacements?: ReadonlyArray<readonly [string, string]>;
}

export function createEnglishAdapter<P extends string>(
  source: AlgorithmModule<P>,
  options: EnglishAdapterOptions<P>,
): AlgorithmModule<P> {
  return {
    ...source,
    title: options.title,
    buildSteps: (input) =>
      source.buildSteps(input).map((step) => {
        const localized = localizeStructuredValue(step) as Step<P>;
        const caption = options.captions[step.point];
        localized.caption =
          typeof caption === 'function' ? caption(step) : translateTechnicalText(caption);
        return localized;
      }),
    sources: source.sources.map((item) => {
      let code = item.code;
      for (const [chinese, english] of options.sourceReplacements ?? []) {
        code = code.replaceAll(chinese, english);
      }
      return {
        ...item,
        label: translateTechnicalText(item.label),
        code: translateSourceCode(item, code),
        lineMap: { ...item.lineMap },
      };
    }),
    inputSpec: source.inputSpec
      ? {
          ...source.inputSpec,
          hint:
            options.inputHint ??
            `Enter ${source.inputSpec.lenMin} to ${source.inputSpec.lenMax} integers from ${source.inputSpec.valMin} to ${source.inputSpec.valMax}, separated by commas`,
        }
      : undefined,
  };
}

export function translateSources<P extends string>(
  sources: LangSource<P>[],
  replacements: ReadonlyArray<readonly [string, string]> = [],
): LangSource<P>[] {
  return sources.map((source) => {
    let code = source.code;
    for (const [chinese, english] of [...replacements, ...SOURCE_COMMENT_REPLACEMENTS]) {
      code = code.replaceAll(chinese, english);
    }
    return { ...source, code, lineMap: { ...source.lineMap } };
  });
}

export function valueOf(step: Step, name: string): VarRow['value'] {
  return step.vars.find((row) => row.name === name)?.value ?? '-';
}
