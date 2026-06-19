import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VariablePanel from './VariablePanel.vue';
import type { VarRow } from './types';

const vars: VarRow[] = [
  { name: 'j', value: 2 },
  { name: 'a[j]', value: 9 },
];

describe('VariablePanel', () => {
  it('渲染每个变量的名与值', () => {
    const w = mount(VariablePanel, { props: { vars } });
    expect(w.findAll('.var-row')).toHaveLength(2);
    expect(w.text()).toContain('j');
    expect(w.text()).toContain('9');
  });

  it('与上一步比较，变化的行加 changed', () => {
    const prev: VarRow[] = [
      { name: 'j', value: 1 },
      { name: 'a[j]', value: 9 },
    ];
    const w = mount(VariablePanel, { props: { vars, prev } });
    const rows = w.findAll('.var-row');
    expect(rows[0].classes()).toContain('changed'); // j 1→2
    expect(rows[1].classes()).not.toContain('changed'); // a[j] 不变
  });

  it('无 prev 时都不高亮', () => {
    const w = mount(VariablePanel, { props: { vars } });
    expect(w.findAll('.var-row.changed')).toHaveLength(0);
  });
});
