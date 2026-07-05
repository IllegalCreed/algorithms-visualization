// src/algorithms/zfunc.ts —— Z 函数 oracle（C-106）：Z-box 轨迹 + 朴素逐位对拍
/** 固定实例：三剧情齐全——box 外暴力 / 镜像达界后真扩展（i=4）/ 镜像直接抄零比较 */
export const Z_S = 'aabaaab';

export interface ZEvent {
  i: number;
  mode: 'brute' | 'mirror-copy' | 'mirror-capped';
  mirrored: number; // 镜像抄来的初值（brute 为 0）
  ext: number; // 右扩成功次数
  zi: number; // 最终 z[i]
  boxUpd: boolean;
  prevBox: [number, number]; // 进入本 i 时的 [l, r)（mirror 步展示用）
  box: [number, number]; // 本步结束后的 [l, r)
}

export interface ZTrace {
  s: string;
  z: number[];
  events: ZEvent[];
}

/** Z-box 法：box 内抄镜像 z[i-l]（截断 r−i），达界才继续右扩；r 只增不减 → O(n) */
export function zTrace(): ZTrace {
  const s = Z_S;
  const n = s.length;
  const z = new Array(n).fill(0);
  z[0] = n;
  let l = 0;
  let r = 0;
  const events: ZEvent[] = [];
  for (let i = 1; i < n; i++) {
    const prevBox: [number, number] = [l, r];
    let mode: ZEvent['mode'] = 'brute';
    let mirrored = 0;
    if (i < r) {
      mirrored = Math.min(r - i, z[i - l]);
      z[i] = mirrored;
      mode = z[i - l] >= r - i ? 'mirror-capped' : 'mirror-copy';
    }
    let ext = 0;
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
      z[i]++;
      ext++;
    }
    let boxUpd = false;
    if (i + z[i] > r) {
      l = i;
      r = i + z[i];
      boxUpd = true;
    }
    events.push({ i, mode, mirrored, ext, zi: z[i], boxUpd, prevBox, box: [l, r] });
  }
  return { s, z, events };
}

/** 独立真值：每个 i 从零开始老实逐位比 */
export function zBrute(): number[] {
  const s = Z_S;
  const n = s.length;
  const z = new Array(n).fill(0);
  z[0] = n;
  for (let i = 1; i < n; i++) {
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
  }
  return z;
}
