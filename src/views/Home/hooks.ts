import { onMounted, onUnmounted } from "vue";
import { useSystemStore } from '@/store/modules/system';

export function useControlHeaderShadow(): void {
  const system = useSystemStore();

  function onScroll(): void {
    if (window.scrollY === 0) {
      system.isShowHeaderShadow = false;
    } else {
      system.isShowHeaderShadow = true;
    }
  }

  onMounted(() => {
    window.addEventListener("scroll", onScroll);
  })

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
  })
}