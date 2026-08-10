/**
 * Small shared helpers for the mobile navigation surfaces.  Header stays mounted
 * while Docs is swapped by the router, so a reference-counted lock prevents one
 * surface from unlocking the body while the other is still open.
 */
let bodyLockCount = 0;
let previousBodyOverflow = '';
let appInertCount = 0;
let appWasInert = false;
let inertAppRoot: HTMLElement | null = null;

export function lockBodyScroll(): void {
  if (typeof document === 'undefined') return;

  if (bodyLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  bodyLockCount += 1;
}

export function unlockBodyScroll(): void {
  if (typeof document === 'undefined' || bodyLockCount === 0) return;

  bodyLockCount -= 1;
  if (bodyLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = '';
  }
}

/** Keep the page behind a teleported mobile dialog out of the accessibility tree. */
export function lockAppBackground(): void {
  if (typeof document === 'undefined') return;
  if (appInertCount === 0) {
    inertAppRoot = document.getElementById('app');
    if (inertAppRoot) {
      appWasInert = inertAppRoot.hasAttribute('inert');
      inertAppRoot.setAttribute('inert', '');
    }
  }
  appInertCount += 1;
}

export function unlockAppBackground(): void {
  if (typeof document === 'undefined' || appInertCount === 0) return;
  appInertCount -= 1;
  if (appInertCount > 0) return;
  if (inertAppRoot && !appWasInert) inertAppRoot.removeAttribute('inert');
  inertAppRoot = null;
  appWasInert = false;
}

export function focusableElements(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];

  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => {
    if (element.getAttribute('aria-hidden') === 'true' || element.hidden) return false;
    const style = typeof window !== 'undefined' ? window.getComputedStyle(element) : null;
    return style?.display !== 'none' && style?.visibility !== 'hidden';
  });
}

export function focusVisibleElement(element: HTMLElement | null): boolean {
  if (!element || !element.isConnected || element.hidden || element.hasAttribute('disabled')) {
    return false;
  }
  const style = typeof window !== 'undefined' ? window.getComputedStyle(element) : null;
  if (style?.display === 'none' || style?.visibility === 'hidden') return false;
  element.focus();
  return document.activeElement === element;
}
