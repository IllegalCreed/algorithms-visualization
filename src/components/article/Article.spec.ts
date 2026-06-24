import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Article from './Article.vue';

describe('Article', () => {
  it('TC-VIZ-ARTICLE-01 渲染 .article 容器', () => {
    const w = mount(Article);
    expect(w.find('.article').exists()).toBe(true);
  });
  it('TC-VIZ-ARTICLE-02 slot 内容透传', () => {
    const w = mount(Article, { slots: { default: '<h2>什么是栈</h2><p>后进先出</p>' } });
    expect(w.find('h2').text()).toBe('什么是栈');
    expect(w.text()).toContain('后进先出');
  });
});
