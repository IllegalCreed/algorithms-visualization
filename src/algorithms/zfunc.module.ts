import type {
  AlgorithmModule,
  ManacherTrack,
  Step,
  VarRow,
  ZExecPoint,
} from '@/components/player/types';
import { zTrace } from './zfunc';
import { zSources } from './zfunc.sources';

/** 固定串 aabaaab 的 Z-box 重放，产出回文轨胖步骤（复用 ManacherView 第 2 消费者，additive 标签）。
 *  三剧情：box 外暴力 / 镜像达界后真扩展（i=4 拆两步）/ 镜像直接抄零比较。 */
export function buildZSteps(): Step<ZExecPoint>[] {
  const { s, z, events } = zTrace();
  const n = s.length;
  const steps: Step<ZExecPoint>[] = [];

  const p: (number | null)[] = new Array(n).fill(null);

  const emit = (
    point: ZExecPoint,
    o: {
      center?: number | null;
      mirror?: number | null;
      box?: [number, number] | null; // [l, r)
      best?: [number, number] | null;
      status?: 'mirror' | 'expand' | 'done' | null;
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const manacher: ManacherTrack = {
      s,
      p: [...p],
      center: o.center ?? null,
      mirror: o.mirror ?? null,
      boxL: o.box && o.box[1] > o.box[0] ? o.box[0] : null,
      boxR: o.box && o.box[1] > o.box[0] ? o.box[1] - 1 : null,
      best: o.best ?? null,
      status: o.status ?? null,
      labels: ['S', 'z'],
      statusLabels: { mirror: '🪞 镜像复用', expand: '→ 右扩比较', done: '🎯 完成' },
    };
    steps.push({ array: [], pointers: [], emphasis: {}, vars: extra, point, manacher, caption });
  };

  p[0] = n;
  emit(
    'init',
    {},
    `z[i] = 整串 s 与后缀 s[i..] 的最长公共前缀（LCP）长度——「每个后缀跟开头像多久」。朴素做法每个 i 从零比起 O(n²)；Z-box 记住最右匹配区间 [l, r)，能抄就抄。z[0] = 整串比自己 = ${n}`,
    [
      { name: 's', value: s },
      { name: '目标', value: 'z[1..6]，全部 O(n) 算完' },
    ],
  );

  for (const ev of events) {
    const { i } = ev;
    if (ev.mode === 'brute') {
      p[i] = ev.zi;
      emit(
        'brute',
        {
          center: i,
          box: ev.box,
          best: ev.zi > 0 ? [i, i + ev.zi - 1] : null,
          status: 'expand',
        },
        i === 1
          ? `i=1 不在任何 box 里——老实逐位比：s[0]=a 对上 s[1]=a（+1），s[1]=a 对 s[2]=b 断，z[1]=1。首个 Z-box [1, 2) 立起`
          : i === 2
            ? `i=2 在 box 外（r=2 已不罩它）：s[0]=a 对 s[2]=b 第一位就断——z[2]=0，box 不动`
            : `i=3 又在 box 外：a=a、a=a 连中两位，s[2]=b 对 s[5]=a 断——z[3]=2，Z-box 前进到 [3, 5)`,
        [{ name: `z[${i}]`, value: `${ev.zi}（暴力右扩 ${ev.ext} 次）` }],
      );
    } else if (ev.mode === 'mirror-capped') {
      p[i] = ev.mirrored;
      emit(
        'mirror',
        {
          center: i,
          mirror: i - ev.prevBox[0],
          box: ev.prevBox,
          best: ev.mirrored > 0 ? [i, i + ev.mirrored - 1] : null,
          status: 'mirror',
        },
        `i=4 在 box [3, 5) 内！镜像位置 i−l=1（蓝环）：z[1]=1、box 余量 r−i=1——抄 min(1, 1)=1。但这次抄到了 box 右缘：后面还像不像，box 管不着了——答案可能不止 1`,
        [{ name: '镜像', value: 'z[4] ≥ min(r−i, z[1]) = 1，达界待验' }],
      );
      p[i] = ev.zi;
      emit(
        'extend',
        {
          center: i,
          mirror: i - ev.prevBox[0],
          box: ev.box,
          best: [i, i + ev.zi - 1],
          status: 'expand',
        },
        `从 box 右缘接着比：s[1]=a 对 s[5]=a（+1）、s[2]=b 对 s[6]=b（+1）——真扩展 +2！z[4]=3，Z-box 大步刷新到 [4, 7)。每次成功比较都推进 r，而 r 永不回退——这就是 O(n) 的账本`,
        [{ name: 'z[4]', value: '1 + 2 = 3；box → [4, 7)' }],
      );
    } else {
      p[i] = ev.zi;
      emit(
        'mirror',
        {
          center: i,
          mirror: i - ev.prevBox[0],
          box: ev.box,
          best: ev.zi > 0 ? [i, i + ev.zi - 1] : null,
          status: 'mirror',
        },
        i === 5
          ? `i=5 在 box [4, 7) 内：镜像 z[1]=1 < 余量 r−i=2——镜像没到右缘，答案就是它：z[5]=1，一次比较都不用（零比较白捡）`
          : `i=6 同理：镜像 z[2]=0 < 余量 1——直接抄 0 收工。Z 数组 [${z.join(', ')}] 齐了`,
        [{ name: `z[${i}]`, value: `${ev.zi}（直接抄镜像，零比较）` }],
      );
    }
  }

  emit(
    'done',
    { status: 'done' },
    `z = [${z.join(', ')}]，总比较次数 O(n)——r 只增不减，每次成功比较都花在推进 r 上。最经典应用：找 P 在 T 里的出现——对拼接串 P#T 求 Z，z[i] = |P| 处即命中（# 挡住越界）；还有周期判定（n − z[i] 整除 n 即周期）与 KMP π 表互算`,
    [{ name: '复杂度', value: 'O(n)（对比朴素 O(n²)）' }],
  );
  return steps;
}

export const zModule: AlgorithmModule<ZExecPoint> = {
  title: 'Z 函数（扩展 KMP · Z-box）',
  initialInput: () => [],
  buildSteps: () => buildZSteps(),
  sources: zSources,
};
