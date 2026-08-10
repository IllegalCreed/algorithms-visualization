import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSystemStore } from '@/store/modules/system';
import {
  focusableElements,
  focusVisibleElement,
  lockAppBackground,
  lockBodyScroll,
  unlockAppBackground,
  unlockBodyScroll,
} from '@/hooks/mobileMenu';

export function useControlHeaderShadow(): void {
  const system = useSystemStore();

  onMounted(() => {
    system.isShowHeaderShadow = true;
  });

  onUnmounted(() => {
    system.isShowHeaderShadow = false;
  });
}

/** Shared mobile viewport state for the Docs shell. */
export function useDocsMobileViewport(): { isMobile: Ref<boolean> } {
  const isMobile = ref(false);

  function readViewport(): void {
    if (typeof window === 'undefined') return;
    isMobile.value =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(max-width: 899px)').matches
        : window.innerWidth < 900;
  }

  onMounted(() => {
    readViewport();
    window.addEventListener('resize', readViewport);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', readViewport);
  });

  return { isMobile };
}

interface MobileDrawerOptions {
  isMobile: Ref<boolean>;
  drawerRef: Ref<HTMLElement | null>;
  triggerId?: string;
}

/**
 * Keyboard/focus and body-scroll behavior shared by the mobile Docs drawer.
 * The Pinia flag remains the single source of truth for Header and Docs.
 */
export function useDocsMobileDrawer(options: MobileDrawerOptions): {
  drawerOpen: ComputedRef<boolean>;
  closeDrawer: () => void;
  onDrawerKeydown: (event: KeyboardEvent) => void;
} {
  const store = useSystemStore();
  const route = useRoute();
  const triggerId = options.triggerId ?? 'mobile-menu-trigger';
  let ownsBodyLock = false;
  let ownsAppBackground = false;
  let restoreTriggerOnClose = true;
  let focusFallbackOnClose = false;

  const drawerOpen = computed<boolean>(() =>
    Boolean(options.isMobile.value && store.isMobileMenuOpen),
  );

  function closeDrawer(): void {
    restoreTriggerOnClose = true;
    focusFallbackOnClose = false;
    store.closeMobileMenu();
  }

  function closeDrawerWithoutFocusRestore(reason: 'route' | 'resize' = 'route'): void {
    restoreTriggerOnClose = false;
    focusFallbackOnClose = reason === 'resize';
    store.closeMobileMenu();
  }

  function onDrawerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDrawer();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusables = focusableElements(options.drawerRef.value);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onDrawerFocusIn(event: FocusEvent): void {
    if (!drawerOpen.value) return;
    const drawer = options.drawerRef.value;
    const target = event.target;
    if (drawer && target instanceof Node && drawer.contains(target)) return;
    event.preventDefault();
    focusablesFirst(drawer)?.focus();
  }

  watch(drawerOpen, async (open, wasOpen) => {
    if (open && !ownsBodyLock) {
      lockBodyScroll();
      ownsBodyLock = true;
      lockAppBackground();
      ownsAppBackground = true;
      await nextTick();
      document.addEventListener('focusin', onDrawerFocusIn, true);
      focusablesFirst(options.drawerRef.value)?.focus();
    } else if (!open && ownsBodyLock) {
      document.removeEventListener('focusin', onDrawerFocusIn, true);
      unlockBodyScroll();
      ownsBodyLock = false;
      if (ownsAppBackground) {
        unlockAppBackground();
        ownsAppBackground = false;
      }
      const shouldRestoreTrigger = restoreTriggerOnClose;
      const shouldFocusFallback = focusFallbackOnClose;
      restoreTriggerOnClose = true;
      focusFallbackOnClose = false;
      if (wasOpen && shouldRestoreTrigger) {
        await nextTick();
        if (!focusVisibleElement(document.getElementById(triggerId))) {
          focusVisibleElement(document.querySelector<HTMLElement>('.search-btn'));
        }
      } else if (wasOpen && shouldFocusFallback) {
        await nextTick();
        const heading = document.querySelector<HTMLElement>('#right .article h1, main .article h1');
        if (!focusVisibleElement(heading)) {
          focusVisibleElement(document.querySelector<HTMLElement>('.search-btn'));
        }
      }
    }
  });

  // Navigating to a different article should close the drawer before the next
  // page is painted, so stale navigation cannot cover the new article.
  watch(
    () => route.fullPath,
    () => {
      if (store.isMobileMenuOpen) closeDrawerWithoutFocusRestore('route');
    },
    { flush: 'sync' },
  );

  watch(options.isMobile, (mobile) => {
    if (!mobile && store.isMobileMenuOpen) closeDrawerWithoutFocusRestore('resize');
  });

  onBeforeUnmount(() => {
    document.removeEventListener('focusin', onDrawerFocusIn, true);
    if (ownsBodyLock) unlockBodyScroll();
    if (ownsAppBackground) unlockAppBackground();
  });

  return { drawerOpen, closeDrawer, onDrawerKeydown };
}

function focusablesFirst(root: HTMLElement | null): HTMLElement | undefined {
  return focusableElements(root)[0];
}
