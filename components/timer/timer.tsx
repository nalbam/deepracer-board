"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimerProps {
  limitMinutes?: number
}

export function Timer({ limitMinutes = 4 }: TimerProps) {
  // 상태 관리
  const [display, setDisplay] = useState('00:00.000')
  const [limiter, setLimiter] = useState('00:00')
  const [bestLap, setBestLap] = useState('')
  const [lastLap, setLastLap] = useState('')
  const [results, setResults] = useState<number[][]>([])
  const [limiterClass, setLimiterClass] = useState('text-foreground')

  // refs
  const runningRef = useRef(false)
  const timeRef = useRef<number | null>(null)
  const timesRef = useRef([0, 0, 0]) // [minutes, seconds, milliseconds]
  const limitRef = useRef([limitMinutes, 0, 0])
  const recordsRef = useRef<number[][]>([])
  const animationFrameRef = useRef<number>()

  // 오디오
  const ding1Ref = useRef<HTMLAudioElement>()
  const ding2Ref = useRef<HTMLAudioElement>()

  useEffect(() => {
    // 오디오 초기화
    ding1Ref.current = new Audio('/sounds/ding1.mp3')
    ding2Ref.current = new Audio('/sounds/ding2.mp3')

    // 초기화
    clear()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: () => void } = {
        'q': start,
        'w': pause,
        'e': passed,
        'r': reset,
        't': clear,
        'd': drop,
        'f': reject,
      }

      const action = keyMap[e.key.toLowerCase()]
      if (action) {
        e.preventDefault()
        action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const lpad = (value: number, count: number) => {
    const result = '000' + value
    return result.substr(result.length - count)
  }

  const format = (times: number[], type: 'short' | 'long' = 'long') => {
    if (type === 'short') {
      return `${lpad(times[0], 2)}:${lpad(times[1], 2)}`
    }
    return `${lpad(times[0], 2)}:${lpad(times[1], 2)}.${lpad(Math.floor(times[2]), 3)}`
  }

  const compare = (a: number[], b: number[]) => {
    for (let i = 0; i < 3; i++) {
      if (a[i] < b[i]) return -1
      if (a[i] > b[i]) return 1
    }
    return 0
  }

  const print = useCallback(() => {
    setLimiter(format(limitRef.current, 'short'))
    setDisplay(format(timesRef.current))

    // 리미터 색상 업데이트
    if (limitRef.current[0] <= 0 && limitRef.current[1] <= 30) {
      setLimiterClass('text-red-500')
    } else if (limitRef.current[0] <= 0 && limitRef.current[1] <= 60) {
      setLimiterClass('text-yellow-500')
    } else {
      setLimiterClass('text-foreground')
    }
  }, [])

  const calculate = (timestamp: number) => {
    if (timeRef.current === null) return

    const diff = timestamp - timeRef.current

    // times 업데이트
    timesRef.current[2] += diff
    if (timesRef.current[2] >= 1000) {
      timesRef.current[2] -= 1000
      timesRef.current[1] += 1
    }
    if (timesRef.current[1] >= 60) {
      timesRef.current[1] -= 60
      timesRef.current[0] += 1
    }
    if (timesRef.current[0] >= 60) {
      timesRef.current[0] -= 60
    }
    if (timesRef.current[2] < 0) {
      timesRef.current[2] = 0
    }
    if (timesRef.current[0] === limitMinutes) {
      timesRef.current[1] = 0
      timesRef.current[2] = 0
    }

    // limit 업데이트
    limitRef.current[2] -= diff
    if (limitRef.current[2] < 0) {
      limitRef.current[2] += 1000
      limitRef.current[1] -= 1
    }
    if (limitRef.current[1] < 0) {
      limitRef.current[1] += 60
      limitRef.current[0] -= 1
    }
    if (limitRef.current[0] < 0) {
      limitRef.current[2] = 0
      limitRef.current[1] = 0
      limitRef.current[0] = 0
      pause()
    }
  }

  const step = (timestamp: number) => {
    if (!runningRef.current) return

    calculate(timestamp)
    timeRef.current = timestamp
    print()
    animationFrameRef.current = requestAnimationFrame(step)
  }

  const start = () => {
    if (!timeRef.current) {
      timeRef.current = performance.now()
    }
    if (!runningRef.current) {
      runningRef.current = true
      animationFrameRef.current = requestAnimationFrame(step)
    }
  }

  const pause = () => {
    timeRef.current = null
    runningRef.current = false
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const passed = () => {
    if (!runningRef.current) {
      start()
    } else if (timesRef.current[0] > 0 || timesRef.current[1] > 2) {
      record()
    }
  }

  const reset = () => {
    timesRef.current = [0, 0, 0]
    print()
    pause()
  }

  const clear = () => {
    if (runningRef.current) return

    recordsRef.current = []
    limitRef.current = [limitMinutes, 0, 0]
    reset()

    setBestLap('')
    setLastLap('')
    setResults([])
  }

  const record = () => {
    console.log(`record ${format(timesRef.current)}`)

    // 랩타임 저장
    recordsRef.current.push([...timesRef.current])
    timesRef.current = [0, 0, 0]

    findBest()
  }

  const drop = () => {
    if (recordsRef.current.length === 0) return

    const latest = recordsRef.current[recordsRef.current.length - 1]
    console.log(`drop ${format(latest)}`)

    // 마지막 랩타임 취소
    recordsRef.current.splice(recordsRef.current.length - 1, 1)
    findBest()
  }

  const reject = () => {
    if (recordsRef.current.length === 0) return

    const latest = recordsRef.current[recordsRef.current.length - 1]
    console.log(`reject ${format(latest)}`)

    pause()

    // 마지막 랩타임을 타이머에 합산
    timesRef.current[2] += latest[2]
    timesRef.current[1] += latest[1]
    timesRef.current[0] += latest[0]

    if (timesRef.current[2] >= 1000) {
      timesRef.current[2] -= 1000
      timesRef.current[1] += 1
    }
    if (timesRef.current[1] >= 60) {
      timesRef.current[1] -= 60
      timesRef.current[0] += 1
    }
    if (timesRef.current[0] >= 60) {
      timesRef.current[0] -= 60
    }
    if (timesRef.current[2] < 0) {
      timesRef.current[2] = 0
    }

    // 마지막 랩타임 취소
    recordsRef.current.splice(recordsRef.current.length - 1, 1)
    findBest()

    start()
  }

  const findBest = () => {
    if (recordsRef.current.length === 0) return

    const sorted = [...recordsRef.current].sort(compare)
    setResults([...recordsRef.current])

    const prevBest = bestLap
    const nowBest = `Best: ${format(sorted[0])}`

    setBestLap(nowBest)
    setLastLap(`Last: ${format(recordsRef.current[recordsRef.current.length - 1])}`)

    // 사운드 재생
    if (prevBest !== nowBest) {
      if (ding1Ref.current) {
        ding1Ref.current.loop = false
        ding1Ref.current.play()
      }
    } else {
      if (ding2Ref.current) {
        ding2Ref.current.loop = false
        ding2Ref.current.play()
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* 컨트롤 버튼 */}
      <nav className="flex flex-wrap gap-2 mb-8 justify-center">
        <Button onClick={start} variant="default" size="lg">
          Start (Q)
        </Button>
        <Button onClick={pause} variant="secondary" size="lg">
          Pause (W)
        </Button>
        <Button onClick={passed} variant="default" size="lg">
          Passed (E)
        </Button>
        <Button onClick={reset} variant="outline" size="lg">
          Reset (R)
        </Button>
        <Button onClick={clear} variant="outline" size="lg">
          Clear (T)
        </Button>
        <Button onClick={drop} variant="destructive" size="lg">
          Drop (D)
        </Button>
        <Button onClick={reject} variant="destructive" size="lg">
          Reject (F)
        </Button>
      </nav>

      {/* 리미터 */}
      <div className={cn("text-6xl font-mono mb-4", limiterClass)}>
        {limiter}
      </div>

      {/* 메인 디스플레이 */}
      <div className="text-9xl font-mono font-bold mb-8 tabular-nums">
        {display}
      </div>

      {/* 최고/최근 랩타임 */}
      <div className="text-center space-y-2 mb-8">
        {bestLap && (
          <div className="text-3xl font-mono text-green-500 transition-all duration-300">
            {bestLap}
          </div>
        )}
        {lastLap && (
          <div className="text-2xl font-mono text-blue-500 transition-all duration-300">
            {lastLap}
          </div>
        )}
      </div>

      {/* 결과 목록 */}
      {results.length > 0 && (
        <ul className="space-y-1 text-xl font-mono max-h-64 overflow-y-auto">
          {results.map((time, index) => (
            <li key={index} className="text-muted-foreground">
              {index + 1}. {format(time)}
            </li>
          ))}
        </ul>
      )}

      {/* 사용 안내 */}
      <div className="mt-8 text-sm text-muted-foreground text-center">
        <p>키보드 단축키: Q-시작, W-정지, E-통과, R-리셋, T-초기화, D-취소, F-거부</p>
      </div>
    </div>
  )
}
