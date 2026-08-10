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

  it('手机导航面板可打开、关闭和切换', () => {
    const s = useSystemStore();
    expect(s.isMobileMenuOpen).toBe(false);

    s.openMobileMenu();
    expect(s.isMobileMenuOpen).toBe(true);

    s.toggleMobileMenu();
    expect(s.isMobileMenuOpen).toBe(false);

    s.toggleMobileMenu();
    s.closeMobileMenu();
    expect(s.isMobileMenuOpen).toBe(false);
  });

  it('TC-RESPONSIVE-140-06 搜索与手机导航保持互斥', () => {
    const s = useSystemStore();

    s.openMobileMenu();
    s.openSearch();
    expect(s.isSearchOpen).toBe(true);
    expect(s.isMobileMenuOpen).toBe(false);

    s.openMobileMenu();
    expect(s.isMobileMenuOpen).toBe(true);
    expect(s.isSearchOpen).toBe(false);

    s.openSearch();
    s.toggleMobileMenu();
    expect(s.isMobileMenuOpen).toBe(true);
    expect(s.isSearchOpen).toBe(false);
  });
});
