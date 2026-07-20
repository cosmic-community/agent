'use client'

import { useEffect, useState } from 'react'
import CopyButton from '@/components/CopyButton'

export default function BaseUrlClient() {
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    const o = window.location.origin
    setOrigin(o)
    const el = document.getElementById('base-url-text')
    if (el) el.textContent = o
  }, [])

  return <CopyButton value={origin || ''} label="Copy" />
}