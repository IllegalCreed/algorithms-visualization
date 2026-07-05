import type { FftExecPoint, LangSource } from '@/components/player/types';

// FFT 迭代版（Cooley-Tukey DIT）：位反转重排 + log n 层蝶形 (u,v)→(u+ωv, u−ωv)。
const ts = `function fft(a: Complex[]): Complex[] {
  const n = a.length;                          // n 是 2 的幂
  const A = new Array(n);
  for (let i = 0; i < n; i++) A[i] = a[bitRev(i)];   // 位反转重排
  for (let L = 2; L <= n; L *= 2) {
    const half = L / 2;
    const w0 = expI(-2 * Math.PI / L);         // 本层单位根 ω_L
    for (let st = 0; st < n; st += L) {
      let w = ONE;
      for (let k = 0; k < half; k++) {
        const u = A[st + k];
        const v = mul(A[st + k + half], w);
        A[st + k] = add(u, v);                 // 蝶形：和
        A[st + k + half] = sub(u, v);          // 蝶形：差
        w = mul(w, w0);
      }
    }
  }
  return A;                                    // O(n log n)
}`;

const python = `import cmath

def fft(a):
    n = len(a)                     # n 是 2 的幂
    A = [a[bit_rev(i)] for i in range(n)]   # 位反转重排
    L = 2
    while L <= n:
        half = L // 2
        w0 = cmath.exp(-2j * cmath.pi / L)  # 本层单位根 ω_L
        for st in range(0, n, L):
            w = 1
            for k in range(half):
                u = A[st + k]
                v = A[st + k + half] * w
                A[st + k] = u + v           # 蝶形：和
                A[st + k + half] = u - v    # 蝶形：差
                w *= w0
        L *= 2
    return A                       # O(n log n)`;

const go = `func fft(a []complex128) []complex128 {
	n := len(a)                     // n 是 2 的幂
	A := make([]complex128, n)
	for i := 0; i < n; i++ {
		A[i] = a[bitRev(i)]         // 位反转重排
	}
	for L := 2; L <= n; L *= 2 {
		half := L / 2
		ang := -2 * math.Pi / float64(L)
		w0 := cmplx.Exp(complex(0, ang)) // 本层单位根 ω_L
		for st := 0; st < n; st += L {
			w := complex(1, 0)
			for k := 0; k < half; k++ {
				u := A[st+k]
				v := A[st+k+half] * w
				A[st+k] = u + v         // 蝶形：和
				A[st+k+half] = u - v    // 蝶形：差
				w *= w0
			}
		}
	}
	return A                        // O(n log n)
}`;

const rust = `fn fft(a: &[Complex<f64>]) -> Vec<Complex<f64>> {
    let n = a.len();                // n 是 2 的幂
    let mut arr: Vec<Complex<f64>> = (0..n).map(|i| a[bit_rev(i)]).collect(); // 位反转重排
    let mut l = 2;
    while l <= n {
        let half = l / 2;
        let w0 = Complex::from_polar(1.0, -2.0 * PI / l as f64); // 本层单位根 ω_L
        for st in (0..n).step_by(l) {
            let mut w = Complex::new(1.0, 0.0);
            for k in 0..half {
                let u = arr[st + k];
                let v = arr[st + k + half] * w;
                arr[st + k] = u + v;          // 蝶形：和
                arr[st + k + half] = u - v;   // 蝶形：差
                w *= w0;
            }
        }
        l *= 2;
    }
    arr                             // O(n log n)
}`;

export const fftSources: LangSource<FftExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 1, bitrev: 4, twiddle: 7, butterfly: 13, done: 19 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 3, bitrev: 5, twiddle: 9, butterfly: 15, done: 19 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 1, bitrev: 5, twiddle: 10, butterfly: 16, done: 22 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 1, bitrev: 3, twiddle: 7, butterfly: 13, done: 20 },
  },
];
