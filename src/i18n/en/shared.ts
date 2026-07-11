import type { LangSource, Step, VarRow } from '@/components/player/types';

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
