// src/algorithms/suffixarray.ts
// 后缀数组固定串 + 倍增法 oracle。字符串大类第 5 页（C-072，新建 SuffixArrayView）。
// sa[i] = 字典序排名第 i 的后缀的起点下标。

export const SA_STR = 'banana';

/** 各字符的 0 基 rank（按字符字典序）。banana → {a:0,b:1,n:2} */
export function charRanks(): number[] {
  const s = SA_STR;
  const uniq = [...new Set(s.split(''))].sort();
  const map: Record<string, number> = {};
  uniq.forEach((c, i) => (map[c] = i));
  return s.split('').map((c) => map[c]);
}

/** 倍增法求后缀数组（oracle）。banana → [5,3,1,0,4,2] */
export function suffixArray(): number[] {
  const s = SA_STR;
  const n = s.length;
  let rank = charRanks();
  const sa = [...Array(n).keys()];
  const key = (i: number, k: number): [number, number] => [rank[i], i + k < n ? rank[i + k] : -1];
  sa.sort((a, b) => rank[a] - rank[b]); // 先按首字符
  let k = 1;
  while (rank[sa[n - 1]] !== n - 1) {
    sa.sort((a, b) => {
      const ka = key(a, k);
      const kb = key(b, k);
      return ka[0] - kb[0] || ka[1] - kb[1];
    });
    const nr = new Array<number>(n).fill(0);
    for (let x = 1; x < n; x++) {
      const kp = key(sa[x - 1], k);
      const kq = key(sa[x], k);
      nr[sa[x]] = nr[sa[x - 1]] + (kp[0] !== kq[0] || kp[1] !== kq[1] ? 1 : 0);
    }
    rank = nr;
    k *= 2;
  }
  return sa;
}
