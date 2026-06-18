import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSystemStore } from './system';

describe('useSystemStore', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('初始 isDarkMode=false、isShowHeaderShadow=false', () => {
    const s = useSystemStore();
    expect(s.isDarkMode).toBe(false);
    expect(s.isShowHeaderShadow).toBe(false);
  });

  it('changeDarkMode 切换暗色', () => {
    const s = useSystemStore();
    s.changeDarkMode();
    expect(s.isDarkMode).toBe(true);
    s.changeDarkMode();
    expect(s.isDarkMode).toBe(false);
  });

  it('changeHeaderShadowe 设置阴影开关', () => {
    const s = useSystemStore();
    s.changeHeaderShadowe(true);
    expect(s.isShowHeaderShadow).toBe(true);
  });

  it('colors 含 red/blue/yellow/green', () => {
    const s = useSystemStore();
    expect(s.colors).toEqual(['red', 'blue', 'yellow', 'green']);
  });
});
