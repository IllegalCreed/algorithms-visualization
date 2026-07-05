import type { FenwickExecPoint, LangSource } from '@/components/player/types';

// 树状数组：tree[i] 管辖长 lowbit(i)；query 往前跳拼前缀、update 往后跳通知管辖者。
const ts = `class BIT {
  tree: number[];                        // tree[i] 管辖长 lowbit(i) 的区段和
  constructor(n: number) { this.tree = new Array(n + 1).fill(0); }
  lowbit(i: number) { return i & -i; }   // 最低位的 1
  query(i: number): number {             // 前缀和 a[1..i]
    let s = 0;
    for (; i > 0; i -= this.lowbit(i))   // 沿链往前跳
      s += this.tree[i];
    return s;
  }
  update(i: number, d: number) {         // a[i] += d
    for (; i < this.tree.length; i += this.lowbit(i))
      this.tree[i] += d;                 // 通知每个管辖者
  }
}`;

const python = `class BIT:
    def __init__(self, n):
        self.tree = [0] * (n + 1)   # tree[i] 管辖长 lowbit(i)

    def lowbit(self, i):
        return i & -i               # 最低位的 1

    def query(self, i):             # 前缀和 a[1..i]
        s = 0
        while i > 0:
            s += self.tree[i]       # 沿链往前跳
            i -= self.lowbit(i)
        return s

    def update(self, i, d):         # a[i] += d
        while i < len(self.tree):
            self.tree[i] += d       # 通知每个管辖者
            i += self.lowbit(i)`;

const go = `type BIT struct {
\ttree []int // tree[i] 管辖长 lowbit(i) 的区段和
}

func lowbit(i int) int { return i & -i } // 最低位的 1

func (b *BIT) Query(i int) int { // 前缀和 a[1..i]
\ts := 0
\tfor ; i > 0; i -= lowbit(i) { // 沿链往前跳
\t\ts += b.tree[i]
\t}
\treturn s
}

func (b *BIT) Update(i, d int) { // a[i] += d
\tfor ; i < len(b.tree); i += lowbit(i) {
\t\tb.tree[i] += d // 通知每个管辖者
\t}
}`;

const rust = `struct Bit {
    tree: Vec<i64>, // tree[i] 管辖长 lowbit(i) 的区段和
}

fn lowbit(i: usize) -> usize {
    i & i.wrapping_neg() // 最低位的 1
}

impl Bit {
    fn query(&self, mut i: usize) -> i64 { // 前缀和 a[1..i]
        let mut s = 0;
        while i > 0 {
            s += self.tree[i];  // 沿链往前跳
            i -= lowbit(i);
        }
        s
    }
    fn update(&mut self, mut i: usize, d: i64) { // a[i] += d
        while i < self.tree.len() {
            self.tree[i] += d;  // 通知每个管辖者
            i += lowbit(i);
        }
    }
}`;

export const fenwickSources: LangSource<FenwickExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=管辖定义 / query=往前跳累加 / update=往后跳通知 / done=返回
    lineMap: { init: 2, query: 8, update: 13, done: 9 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 3, query: 11, update: 17, done: 13 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, query: 10, update: 17, done: 12 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, query: 13, update: 20, done: 16 },
  },
];
