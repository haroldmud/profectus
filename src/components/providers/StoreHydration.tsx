'use client'

import { useEffect } from 'react'
import { useProgressStore } from '@/store/progress'

export function StoreHydration() {
  useEffect(() => {
    useProgressStore.persist.rehydrate()
  }, [])
  return null
}
