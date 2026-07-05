import { SORT_INPUT_SPEC } from '@/components/player/inputSpec';
import type { AlgorithmModule, CocktailExecPoint, Step, VarRow } from '@/components/player/types';
import { cocktailSortSources } from './cocktail.sources';

const ID_A = '0'; // 红箭头：比较对左格
const ID_B = '1'; // 蓝箭头：比较对右格
const DASH = '-';

/** 插桩重走鸡尾酒排序（双向冒泡）：forward 冒最大→right--、backward 沉最小→left++，双端渐绿收缩，零交换提前收工 */
export function buildCocktailSortSteps(input: number[]): Step<CocktailExecPoint>[] {
  const steps: Step<CocktailExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;
  let left = 0;
  let right = n - 1;
  let sortedFrom = n; // 右端已就位边界（>= 为绿）
  let sortedUpTo = 0; // 左端已就位边界（< 为绿）
  let pass = 0;
  let swapCount = 0;

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));
  const vars = (
    dir: string,
    j: number | string,
    va: number | string,
    vb: number | string,
    swapped: boolean | string,
  ): VarRow[] => [
    { name: 'n', value: n },
    { name: 'left', value: left },
    { name: 'right', value: right },
    { name: '方向', value: dir },
    { name: 'j', value: j },
    { name: '左/右值', value: `${va} / ${vb}` },
    { name: 'swappedInPass', value: swapped },
    { name: 'swapCount', value: swapCount },
  ];

  const emit = (
    point: CocktailExecPoint,
    ptr: { a?: number; b?: number },
    v: VarRow[],
    emphasis: Step['emphasis'],
    caption?: string,
  ) => {
    const pointers = [];
    if (ptr.a !== undefined) pointers.push({ id: ID_A, index: clampIdx(ptr.a) });
    if (ptr.b !== undefined) pointers.push({ id: ID_B, index: clampIdx(ptr.b) });
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers,
      emphasis: { sortedFrom, sortedUpTo, ...emphasis },
      vars: v,
      point,
      caption,
    });
  };

  if (n <= 1) {
    sortedFrom = 0;
    emit('done', {}, vars(DASH, DASH, DASH, DASH, DASH), {}, '完成');
    return steps;
  }

  while (left < right) {
    // → forward 趟：把最大的冒到右端
    pass++;
    let swapped = false;
    emit(
      'forwardPass',
      { a: left, b: left + 1 },
      vars('→', left, work[left][1], work[left + 1][1], swapped),
      {},
      `第 ${pass} 趟（→）：从左到右，把最大的冒到右端`,
    );
    for (let j = left; j < right; j++) {
      const va = work[j][1];
      const vb = work[j + 1][1];
      const willSwap = va > vb;
      emit(
        'fCompare',
        { a: j, b: j + 1 },
        vars('→', j, va, vb, swapped),
        { comparing: [j, j + 1] },
        `${va} ${willSwap ? '>' : '≤'} ${vb}`,
      );
      if (willSwap) {
        [work[j], work[j + 1]] = [work[j + 1], work[j]];
        swapCount++;
        swapped = true;
        emit(
          'fSwap',
          { a: j, b: j + 1 },
          vars('→', j, work[j][1], work[j + 1][1], swapped),
          { comparing: [j, j + 1], swapped: true },
          `交换 ${va} 与 ${vb}`,
        );
      } else {
        emit(
          'fNoSwap',
          { a: j, b: j + 1 },
          vars('→', j, va, vb, swapped),
          { comparing: [j, j + 1], swapped: false },
          '不交换，继续右扫',
        );
      }
    }
    right--;
    sortedFrom = right + 1; // 右端最大值就位
    if (!swapped) break;

    // ← backward 趟：把最小的沉到左端
    pass++;
    swapped = false;
    emit(
      'backwardPass',
      { a: right - 1, b: right },
      vars('←', right, work[right - 1]?.[1] ?? DASH, work[right][1], swapped),
      {},
      `第 ${pass} 趟（←）：从右到左，把最小的沉到左端`,
    );
    for (let j = right; j > left; j--) {
      const va = work[j - 1][1];
      const vb = work[j][1];
      const willSwap = va > vb;
      emit(
        'bCompare',
        { a: j - 1, b: j },
        vars('←', j, va, vb, swapped),
        { comparing: [j - 1, j] },
        `${va} ${willSwap ? '>' : '≤'} ${vb}`,
      );
      if (willSwap) {
        [work[j - 1], work[j]] = [work[j], work[j - 1]];
        swapCount++;
        swapped = true;
        emit(
          'bSwap',
          { a: j - 1, b: j },
          vars('←', j, work[j - 1][1], work[j][1], swapped),
          { comparing: [j - 1, j], swapped: true },
          `交换 ${va} 与 ${vb}`,
        );
      } else {
        emit(
          'bNoSwap',
          { a: j - 1, b: j },
          vars('←', j, va, vb, swapped),
          { comparing: [j - 1, j], swapped: false },
          '不交换，继续左扫',
        );
      }
    }
    left++;
    sortedUpTo = left; // 左端最小值就位
    if (!swapped) break;
  }
  sortedFrom = 0; // 全部就位
  emit('done', {}, vars(DASH, DASH, DASH, DASH, DASH), {}, '完成，全部有序');
  return steps;
}

export const cocktailSortModule: AlgorithmModule<CocktailExecPoint> = {
  title: '鸡尾酒排序',
  initialInput: () => [4, 2, 6, 3, 8, 5, 7, 1],
  buildSteps: buildCocktailSortSteps,
  sources: cocktailSortSources,
  inputSpec: SORT_INPUT_SPEC, // C-110 第一批开放自定义输入
};
