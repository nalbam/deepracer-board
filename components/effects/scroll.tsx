"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

interface ScrollProps {
  items: number
  interval?: number
  timeout?: number
}

export interface ScrollRef {
  scroll: (dir: string | number) => void
}

export const Scroll = forwardRef<ScrollRef, ScrollProps>(function Scroll(
  { items, interval = 200, timeout = 10 * 60 * 1000 },
  ref
) {
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
    const min = 5
    const max = 100
    let scrollTop = 0
    let duration = 1000
    const bottomDelay = 8000 // 하단 도달 후 8초 대기

    if (dir === 'down') {
      const targetRank = items
      if (targetRank <= min) {
        return
      }

      const rank = targetRank > max ? max : targetRank
      const element = document.querySelector(`.lb-rank${rank}`)

      if (element) {
        scrollTop = element.getBoundingClientRect().top + window.scrollY
        // 레이서 수에 비례한 천천히 스크롤 (레이서당 800ms)
        duration = rank * 800
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
      // 이벤트 발생 시 빠르게 스크롤
      duration = 800
    }

    // 커스텀 스크롤 애니메이션 (천천히)
    if (scrollTop === 0) {
      // 상단으로 빠르게 복귀
      smoothScrollTo(scrollTop, 1000)
    } else {
      // 하단으로 천천히 스크롤
      smoothScrollTo(scrollTop, duration)

      // 스크롤 완료 후 하단에서 대기, 그 후 상단으로 빠르게 복귀
      setTimeout(() => {
        smoothScrollTo(0, 1500)
      }, duration + bottomDelay)
    }
  }

  // 커스텀 smooth scroll 함수
  const smoothScrollTo = (targetY: number, duration: number) => {
    const startY = window.scrollY
    const distance = targetY - startY
    const startTime = performance.now()

    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = easeInOutCubic(progress)

      window.scrollTo(0, startY + distance * easeProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  // Expose scroll method to parent
  useImperativeHandle(ref, () => ({
    scroll,
  }))

  return null
})
