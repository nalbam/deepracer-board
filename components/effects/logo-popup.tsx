"use client"

import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import Image from 'next/image'

interface LogoPopupProps {
  logoUrl?: string
  leagueTitle?: string
}

export interface LogoPopupRef {
  start: (timeout?: number) => void
}

export const LogoPopup = forwardRef<LogoPopupRef, LogoPopupProps>(function LogoPopup(
  { logoUrl, leagueTitle },
  ref
) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useImperativeHandle(ref, () => ({
    start(timeout = 3000) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setVisible(true)
      timeoutRef.current = setTimeout(() => {
        setVisible(false)
      }, timeout)
    },
  }))

  if (!visible || !logoUrl) return null

  return (
    <div className="logo-popup-layer">
      <div className="logo-popup-bg"></div>
      <div className="logo-popup-container">
        <Image
          src={logoUrl}
          alt={leagueTitle || 'League Logo'}
          width={600}
          height={600}
          className="logo-popup-image"
          unoptimized
        />
      </div>
    </div>
  )
})
