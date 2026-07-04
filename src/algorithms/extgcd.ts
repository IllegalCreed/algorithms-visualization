// src/algorithms/extgcd.ts
// 扩展欧几里得 oracle。数学与数论第 5 页（C-086，纯复用 MatrixView 回代表）。
// 30,18 → gcd=6、x=−1、y=2（30·(−1)+18·2=6）；每层回代满足 a·x+b·y=g。

export const EG_A = 30;
export const EG_B = 18;

/** 递归扩展欧几里得：返回 {g, x, y} 使 a·x + b·y = g = gcd(a,b)。 */
export function extGcd(a: number, b: number): { g: number; x: number; y: number } {
  if (b === 0) return { g: a, x: 1, y: 0 };
  const r = extGcd(b, a % b);
  return { g: r.g, x: r.y, y: r.x - Math.floor(a / b) * r.y };
}

export interface EgRow {
  a: number;
  b: number;
  q: number | null; // 基例行无商
  x: number;
  y: number;
}

/** 回代表：下行除法链每层一行 + 基例行；x,y 为回代结果（与递归对拍）。 */
export function egRows(): EgRow[] {
  const rows: { a: number; b: number; q: number | null }[] = [];
  let a = EG_A;
  let b = EG_B;
  while (b !== 0) {
    rows.push({ a, b, q: Math.floor(a / b) });
    const r = a % b;
    a = b;
    b = r;
  }
  rows.push({ a, b: 0, q: null }); // 基例：gcd = a
  // 回代
  const out: EgRow[] = rows.map((r) => ({ ...r, x: 0, y: 0 }));
  out[out.length - 1].x = 1;
  out[out.length - 1].y = 0;
  for (let i = out.length - 2; i >= 0; i--) {
    const nx = out[i + 1].x;
    const ny = out[i + 1].y;
    out[i].x = ny;
    out[i].y = nx - (out[i].q as number) * ny;
  }
  return out;
}
