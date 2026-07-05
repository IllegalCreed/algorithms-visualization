import type { LangSource, RhoExecPoint } from '@/components/player/types';

// Pollard's Rho（Floyd 龟兔版）：x←x²+1 伪随机序列 + 每步 gcd(|slow−fast|, n) 显影。
const ts = `function pollardRho(n: bigint): bigint {
  if (n % 2n === 0n) return 2n;
  const f = (x: bigint): bigint => (x * x + 1n) % n;   // 伪随机步进
  let slow = 2n;
  let fast = 2n;
  let d = 1n;
  while (d === 1n) {
    slow = f(slow);                       // 龟：1 步
    fast = f(f(fast));                    // 兔：2 步
    d = gcd(slow > fast ? slow - fast : fast - slow, n);  // 显影
  }
  return d === n ? retryWithNewC(n) : d;  // 命中因子（撞满环则换 c 重来）
}
// 判素交给米勒-拉宾；合数用 Rho 劈半后递归，即得完整分解`;

const python = `from math import gcd

def pollard_rho(n):
    if n % 2 == 0:
        return 2
    f = lambda x: (x * x + 1) % n   # 伪随机步进
    slow = fast = 2
    d = 1
    while d == 1:
        slow = f(slow)              # 龟：1 步
        fast = f(f(fast))           # 兔：2 步
        d = gcd(abs(slow - fast), n)   # 显影
    return d if d != n else pollard_rho_retry(n)  # 命中（撞满环换 c）
# 判素交给米勒-拉宾；合数劈半后递归，即得完整分解`;

const go = `func pollardRho(n *big.Int) *big.Int {
	if new(big.Int).Mod(n, two).Sign() == 0 {
		return two
	}
	f := func(x *big.Int) *big.Int {    // 伪随机步进
		y := new(big.Int).Mul(x, x)
		y.Add(y, one)
		return y.Mod(y, n)
	}
	slow, fast := big.NewInt(2), big.NewInt(2)
	d := big.NewInt(1)
	for d.Cmp(one) == 0 {
		slow = f(slow)                  // 龟：1 步
		fast = f(f(fast))               // 兔：2 步
		diff := new(big.Int).Sub(slow, fast)
		d.GCD(nil, nil, diff.Abs(diff), n)  // 显影
	}
	if d.Cmp(n) == 0 {
		return retryWithNewC(n)         // 撞满环则换 c 重来
	}
	return d                            // 命中因子
}`;

const rust = `fn pollard_rho(n: u64) -> u64 {
    if n % 2 == 0 {
        return 2;
    }
    let f = |x: u64| ((x as u128 * x as u128 + 1) % n as u128) as u64; // 伪随机步进
    let (mut slow, mut fast) = (2u64, 2u64);
    let mut d = 1u64;
    while d == 1 {
        slow = f(slow);                 // 龟：1 步
        fast = f(f(fast));              // 兔：2 步
        d = gcd(slow.abs_diff(fast), n);    // 显影
    }
    if d == n { retry_with_new_c(n) } else { d }  // 命中因子（撞满环换 c）
}
// 判素交给米勒-拉宾；合数劈半后递归，即得完整分解`;

export const rhoSources: LangSource<RhoExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 1, seed: 3, race: 10, hit: 12, reveal: 10, done: 14 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 3, seed: 6, race: 12, hit: 13, reveal: 12, done: 14 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 1, seed: 5, race: 16, hit: 21, reveal: 16, done: 21 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 1, seed: 5, race: 11, hit: 13, reveal: 11, done: 15 },
  },
];
