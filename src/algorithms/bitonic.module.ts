import type {
  AlgorithmModule,
  NetworkExecPoint,
  NetworkTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { BS_INPUT, buildComparators, runNetwork } from './bitonic';
import { bitonicSources } from './bitonic.sources';

/** 固定 [5,2,7,1,8,3,6,4] 双调排序网络逐列重走，产出比较器网络轨胖步骤（NetworkView）。
 *  网络与数据无关；每列一步（同列比较器并行执行），列 2 后双调成形，列 5 后有序。 */
export function buildBitonicSteps(): Step<NetworkExecPoint>[] {
  const input = BS_INPUT;
  const n = input.length;
  const { comparators, cols } = buildComparators(n);
  const snapshots = runNetwork(input);
  const steps: Step<NetworkExecPoint>[] = [];

  const emit = (
    point: NetworkExecPoint,
    wires: number[],
    currentCol: number | null,
    done: boolean,
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const network: NetworkTrack = {
      wires: [...wires],
      comparators,
      cols,
      currentCol,
      done,
    };
    const vars: VarRow[] = [
      { name: 'n / 列数', value: `${n} / ${cols}` },
      { name: '并行深度', value: `log²n 级 = ${cols} 拍` },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, network, caption });
  };

  emit(
    'init',
    snapshots[0],
    null,
    false,
    `这是一张固定的「排序网络」：${comparators.length} 个比较器排成 ${cols} 列，位置与数据无关——同一列的比较器互不相干，可以并行执行`,
  );

  const colNote = (c: number): string => {
    const group = comparators.filter((cp) => cp.col === c);
    const dirs = group.map((cp) => (cp.dir === 'asc' ? '↑' : '↓')).join('');
    if (c <= 2) {
      const base = `列 ${c}（构造阶段，方向 ${dirs}）：4 个比较器并行比较交换`;
      return c === 2 ? `${base}——至此前半升、后半降，完美双调序列成形！` : base;
    }
    const dist = c === 3 ? 4 : c === 4 ? 2 : 1;
    return `列 ${c}（双调合并，距离 ${dist}，全 ↑）：4 个比较器并行，把双调序列裂成有序的两半`;
  };

  for (let c = 0; c < cols; c++) {
    emit('column', snapshots[c + 1], c, false, colNote(c), [
      { name: '当前列', value: `${c + 1} / ${cols}` },
    ]);
  }

  emit(
    'done',
    snapshots[cols],
    null,
    true,
    `${cols} 拍完成排序：[${snapshots[cols].join(', ')}]。串行算比较总数 O(n log²n) 不占优，但每列并行、墙钟深度只有 O(log²n)——这正是 GPU / 硬件排序的思想`,
    [{ name: '结果', value: '有序 ✓' }],
  );
  return steps;
}

export const bitonicModule: AlgorithmModule<NetworkExecPoint> = {
  title: '双调排序（排序网络）',
  initialInput: () => [...BS_INPUT],
  buildSteps: () => buildBitonicSteps(),
  sources: bitonicSources,
};
