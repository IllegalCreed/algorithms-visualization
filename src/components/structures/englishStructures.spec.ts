import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { Component } from 'vue';
import ArrayGrowViz from './ArrayGrowViz.vue';
import ArrayViz from './ArrayViz.vue';
import BTreeViz from './BTreeViz.vue';
import BalanceViz from './BalanceViz.vue';
import BloomViz from './BloomViz.vue';
import DequeViz from './DequeViz.vue';
import DlinkViz from './DlinkViz.vue';
import GraphViz from './GraphViz.vue';
import HashProbeViz from './HashProbeViz.vue';
import HashViz from './HashViz.vue';
import HeapViz from './HeapViz.vue';
import LinkViz from './LinkViz.vue';
import LruViz from './LruViz.vue';
import QueueViz from './QueueViz.vue';
import SegTreeViz from './SegTreeViz.vue';
import SkipListViz from './SkipListViz.vue';
import StackViz from './StackViz.vue';
import TreeViz from './TreeViz.vue';
import TrieViz from './TrieViz.vue';
import UnionFindViz from './UnionFindViz.vue';

const HAN = /[\u3400-\u9fff]/;

const batchAComponents: ReadonlyArray<{ name: string; component: Component }> = [
  { name: 'array', component: ArrayViz },
  { name: 'array growth', component: ArrayGrowViz },
  { name: 'singly linked list', component: LinkViz },
  { name: 'doubly linked list', component: DlinkViz },
  { name: 'stack', component: StackViz },
  { name: 'queue', component: QueueViz },
  { name: 'deque', component: DequeViz },
  { name: 'binary search tree', component: TreeViz },
  { name: 'balanced tree comparison', component: BalanceViz },
];

const batchBComponents: ReadonlyArray<{ name: string; component: Component }> = [
  { name: 'heap', component: HeapViz },
  { name: 'separate-chaining hash table', component: HashViz },
  { name: 'open-addressed hash table', component: HashProbeViz },
  { name: 'graph traversal', component: GraphViz },
  { name: 'trie', component: TrieViz },
  { name: 'disjoint set union', component: UnionFindViz },
];

const batchCComponents: ReadonlyArray<{ name: string; component: Component }> = [
  { name: 'LRU cache', component: LruViz },
  { name: 'skip list', component: SkipListViz },
  { name: 'segment tree', component: SegTreeViz },
  { name: 'B+ tree', component: BTreeViz },
  { name: 'Bloom filter', component: BloomViz },
];

const components = [...batchAComponents, ...batchBComponents, ...batchCComponents];

describe('English data-structure visualizations, batch A', () => {
  it('TC-I18N-STRUCT-131-A01: nine visualizations render English-only initial controls and status', () => {
    for (const item of components) {
      const wrapper = mount(item.component, { props: { locale: 'en' } });
      expect(wrapper.text(), item.name).not.toMatch(HAN);
      wrapper.unmount();
    }
  });

  it('TC-I18N-STRUCT-131-A02: a representative action keeps every visualization English-only', async () => {
    for (const item of components) {
      const wrapper = mount(item.component, { props: { locale: 'en' } });
      const action = wrapper.findAll('button').find((button) => !button.attributes('disabled'));
      expect(action, item.name).toBeDefined();
      await action!.trigger('click');
      expect(wrapper.text(), item.name).not.toMatch(HAN);
      wrapper.unmount();
    }
  });

  it('TC-I18N-STRUCT-131-A03: omitted locale preserves the existing Chinese presentation', () => {
    for (const item of components) {
      const wrapper = mount(item.component);
      expect(wrapper.text(), item.name).toMatch(HAN);
      wrapper.unmount();
    }
  });
});
