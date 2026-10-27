import { useProgressStore } from '@/store/progress'

export function useHydrated() {
  return useProgressStore((s) => s._hasHydrated)
}
