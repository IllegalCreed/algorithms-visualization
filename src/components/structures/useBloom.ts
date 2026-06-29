import { ref, type Ref } from 'vue';

/** 固定布隆过滤器：m=16 位、k=3 个确定性哈希 */
export const BLOOM_SIZE = 16; // m 位
export const BLOOM_K = 3; // k 个哈希

export interface BloomQuery {
  positions: number[]; // k 个哈希位
  mightExist: boolean; // k 位全 1 → 可能存在
  actuallyAdded: boolean; // 真实加入过（教学标注，不参与布隆判断）
  falsePositive: boolean; // mightExist && !actuallyAdded —— 误判（假阳性）
}
export interface UseBloom {
  bits: Ref<boolean[]>; // 16 位
  size: number;
  k: number;
  hashes: (x: number) => number[];
  add: (x: number) => { positions: number[] };
  query: (x: number) => BloomQuery;
  reset: () => void;
}

/** 三个确定性哈希：h1=x%16、h2=7x%16、h3=(11x+5)%16 */
function bloomHashes(x: number): number[] {
  return [x % BLOOM_SIZE, (7 * x) % BLOOM_SIZE, (11 * x + 5) % BLOOM_SIZE];
}

export function useBloom(): UseBloom {
  const bits = ref<boolean[]>(Array.from({ length: BLOOM_SIZE }, () => false));
  const added = new Set<number>(); // 真实加入集合，仅用于教学点破误判，不参与存在性判断

  const hashes = (x: number) => bloomHashes(x);

  const add = (x: number) => {
    const positions = bloomHashes(x);
    for (const p of positions) bits.value[p] = true;
    added.add(x);
    return { positions };
  };

  const query = (x: number): BloomQuery => {
    const positions = bloomHashes(x);
    const mightExist = positions.every((p) => bits.value[p]);
    const actuallyAdded = added.has(x);
    return { positions, mightExist, actuallyAdded, falsePositive: mightExist && !actuallyAdded };
  };

  const reset = () => {
    bits.value = Array.from({ length: BLOOM_SIZE }, () => false);
    added.clear();
  };

  return { bits, size: BLOOM_SIZE, k: BLOOM_K, hashes, add, query, reset };
}
