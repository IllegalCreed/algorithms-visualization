import type { DigitDpExecPoint, LangSource } from '@/components/player/types';

// 数位 DP（迭代走位版）：每位自由分支记账 + tight 判定；上界位是禁数字则断裂。
const ts = `function countNoBan(n: number, ban: number): number {
  const ds = [...String(n)].map(Number);  // 上界数位（高位在前）
  let total = 0;
  let tight = true;                       // 还贴着上界吗
  for (let i = 0; i < ds.length && tight; i++) {
    const free = ds.length - i - 1;       // 后缀自由位数
    let cnt = 0;
    for (let x = 0; x < ds[i]; x++)       // 本位填小于上界位的数
      if (x !== ban) cnt++;
    total += cnt * 9 ** free;             // 每个分支后缀 9^free 种
    if (ds[i] === ban) tight = false;     // 上界位就是禁数字：断裂
  }
  if (tight) total += 1;                  // N 自身合法则计入
  return total - 1;                       // 去掉 0
}`;

const python = `def count_no_ban(n, ban):
    ds = [int(c) for c in str(n)]   # 上界数位（高位在前）
    total = 0
    tight = True                    # 还贴着上界吗
    for i, d in enumerate(ds):
        if not tight:
            break                   # 断裂后整段无路
        free = len(ds) - i - 1      # 后缀自由位数
        cnt = sum(1 for x in range(d) if x != ban)
        total += cnt * 9 ** free    # 自由分支记账
        if d == ban:
            tight = False           # 上界位就是禁数字：断裂
    if tight:
        total += 1                  # N 自身合法则计入
    return total - 1                # 去掉 0`;

const go = `func countNoBan(n, ban int) int {
\tds := []int{}
\tfor _, c := range strconv.Itoa(n) {
\t\tds = append(ds, int(c-'0')) // 上界数位
\t}
\ttotal := 0
\ttight := true // 还贴着上界吗
\tfor i := 0; i < len(ds) && tight; i++ {
\t\tfree := len(ds) - i - 1 // 后缀自由位数
\t\tcnt := 0
\t\tfor x := 0; x < ds[i]; x++ { // 本位填小于上界位的数
\t\t\tif x != ban {
\t\t\t\tcnt++
\t\t\t}
\t\t}
\t\ttotal += cnt * pow9(free) // 自由分支记账
\t\tif ds[i] == ban {
\t\t\ttight = false // 上界位就是禁数字：断裂
\t\t}
\t}
\tif tight {
\t\ttotal++ // N 自身合法则计入
\t}
\treturn total - 1 // 去掉 0
}`;

const rust = `fn count_no_ban(n: u64, ban: u32) -> u64 {
    let ds: Vec<u32> = n.to_string().chars()
        .map(|c| c.to_digit(10).unwrap()).collect(); // 上界数位
    let mut total: u64 = 0;
    let mut tight = true;                 // 还贴着上界吗
    for (i, &d) in ds.iter().enumerate() {
        if !tight {
            break;                        // 断裂后整段无路
        }
        let free = (ds.len() - i - 1) as u32;
        let cnt = (0..d).filter(|&x| x != ban).count() as u64;
        total += cnt * 9u64.pow(free);    // 自由分支记账
        if d == ban {
            tight = false;                // 上界位就是禁数字：断裂
        }
    }
    if tight {
        total += 1;                       // N 自身合法则计入
    }
    total - 1                             // 去掉 0
}`;

export const digitDpSources: LangSource<DigitDpExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=拆数位 / free=自由分支记账 / tight=断裂判定 / broken=同判定行 / sum=N 自身补偿 / done=去 0 返回
    lineMap: { init: 2, free: 10, tight: 11, broken: 11, sum: 13, done: 14 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, free: 10, tight: 12, broken: 7, sum: 14, done: 15 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 4, free: 16, tight: 17, broken: 17, sum: 22, done: 24 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, free: 12, tight: 13, broken: 8, sum: 18, done: 20 },
  },
];
