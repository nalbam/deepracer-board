"use client"

import { useEffect, useRef } from 'react'

interface ScrollProps {
  items: number
  interval?: number
  timeout?: number
}

export function Scroll({ items, interval = 200, timeout = 10 * 60 * 1000 }: ScrollProps) {
  const timeoutCountRef = useRef(0)
  const intervalIdRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const defaultTimeout = timeout / interval
    timeoutCountRef.current = defaultTimeout

    const countdown = () => {
      timeoutCountRef.current--

      if (timeoutCountRef.current <= 0) {
        scroll('down')
        timeoutCountRef.current = defaultTimeout
      }
    }

    intervalIdRef.current = setInterval(countdown, interval)

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [items, interval, timeout])

  const scroll = (dir: string | number) => {
    console.log(`scroll: ${dir}`)

    const min = 5
    const max = 100
    let scrollTop = 0
    let duration = 1000
    const delay = 5000

    if (dir === 'down') {
      const targetRank = items
      if (targetRank <= min) {
        return
      }

      const rank = targetRank > max ? max : targetRank
      const element = document.querySelector(`.lb-rank${rank}`)

      if (element) {
        scrollTop = element.getBoundingClientRect().top + window.scrollY
        duration = rank * 1000
      }
    } else {
      const rank = typeof dir === 'number' ? dir : parseInt(dir)
      if (rank <= min) {
        scrollTop = 0
      } else {
        const targetRank = rank - min
        const element = document.querySelector(`.lb-rank${targetRank}`)
        if (element) {
          scrollTop = element.getBoundingClientRect().top + window.scrollY
        }
      }
      duration = 1000
    }

    // 스크롤 애니메이션 (smooth 사용)
    if (scrollTop === 0) {
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      })
    } else {
      // 스크롤 다운 후 delay만큼 대기 후 상단으로 복귀
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      })

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }, delay)
    }
  }

  return null
}
