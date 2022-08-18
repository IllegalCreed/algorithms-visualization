import { onMounted, onUnmounted } from "vue";
import { useSystemStore } from '@/store/modules/system';

export function useControlHeaderShadow(): void {
  const system = useSystemStore();

  onMounted(() => {
    system.isShowHeaderShadow = true;
  })

  onUnmounted(() => {
    system.isShowHeaderShadow = false;
  })
}