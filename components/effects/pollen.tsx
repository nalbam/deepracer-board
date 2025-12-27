"use client"

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

interface Particle {
  color1: string
  color2: string
  diameter: number
  tilt: number
  tiltAngle: number
  tiltAngleIncrement: number
  x: number
  y: number
}

interface PollenConfig {
  alpha?: number
  count?: number
  frameInterval?: number
  gradient?: boolean
  speed?: number
  timeout?: number
}

export interface PollenRef {
  start: (timeout?: number) => void
  stop: () => void
}

const COLORS = [
  'rgba(30,144,255,',
  'rgba(107,142,35,',
  'rgba(255,215,0,',
  'rgba(255,192,203,',
  'rgba(106,90,205,',
  'rgba(173,216,230,',
  'rgba(238,130,238,',
  'rgba(152,251,152,',
  'rgba(70,130,180,',
  'rgba(244,164,96,',
  'rgba(210,105,30,',
  'rgba(220,20,60,'
]

const DEFAULT_CONFIG: Required<PollenConfig> = {
  alpha: 0.8,
  count: 300,
  frameInterval: 15,
  gradient: false,
  speed: 2,
  timeout: 1000,
}

export const Pollen = forwardRef<PollenRef, PollenConfig>(function Pollen(
  config,
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const streamingRef = useRef(false)
  const lastFrameTimeRef = useRef(Date.now())
  const animationFrameRef = useRef<number>()
  const timeoutRef = useRef<NodeJS.Timeout>()

  const cfg = { ...DEFAULT_CONFIG, ...config }

  useEffect(() => {
    // 캔버스 초기화
    let canvas = document.getElementById('pollen-canvas') as HTMLCanvasElement | null

    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.setAttribute('id', 'pollen-canvas')
      canvas.setAttribute(
        'style',
        'display:block;z-index:999999;pointer-events:none;position:fixed;top:0;left:0'
      )
      document.body.prepend(canvas)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const handleResize = () => {
        if (canvas) {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
        }
      }
      window.addEventListener('resize', handleResize, true)

      canvasRef.current = canvas
      contextRef.current = canvas.getContext('2d')

      return () => {
        window.removeEventListener('resize', handleResize, true)
      }
    } else if (!contextRef.current) {
      canvasRef.current = canvas
      contextRef.current = canvas.getContext('2d')
    }
  }, [])

  useEffect(() => {
    if (contextRef.current) {
      animate(contextRef.current)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const createParticle = (width: number, height: number): Particle => {
    return {
      color1: COLORS[Math.floor(Math.random() * COLORS.length)] + cfg.alpha + ')',
      color2: COLORS[Math.floor(Math.random() * COLORS.length)] + cfg.alpha + ')',
      diameter: Math.random() * 10 + 10,
      tilt: Math.random() * 10 - 10,
      tiltAngle: Math.random() * Math.PI,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05,
      x: Math.random() * width,
      y: Math.random() * height - height,
    }
  }

  const start = (timeout?: number) => {
    streamingRef.current = true

    const width = window.innerWidth
    const height = window.innerHeight

    while (particlesRef.current.length < cfg.count) {
      particlesRef.current.push(createParticle(width, height))
    }

    const duration = timeout ?? cfg.timeout
    timeoutRef.current = setTimeout(() => {
      stop()
    }, duration)
  }

  const stop = () => {
    streamingRef.current = false
  }

  const animate = (c: CanvasRenderingContext2D) => {
    if (particlesRef.current.length === 0) {
      c.clearRect(0, 0, window.innerWidth, window.innerHeight)
    } else {
      const now = Date.now()
      const delta = now - lastFrameTimeRef.current

      if (delta > cfg.frameInterval) {
        c.clearRect(0, 0, window.innerWidth, window.innerHeight)
        update()
        draw(c)
        lastFrameTimeRef.current = now - (delta % cfg.frameInterval)
      }
    }

    animationFrameRef.current = requestAnimationFrame(() => animate(c))
  }

  const update = () => {
    const w = window.innerWidth
    const h = window.innerHeight

    for (let i = 0; i < particlesRef.current.length; i++) {
      const particle = particlesRef.current[i]

      if (!streamingRef.current && particle.y < -15) {
        particle.y = h + 100
      } else {
        particle.y += (particle.diameter + cfg.speed) * 0.5
        particle.tiltAngle += particle.tiltAngleIncrement
        particle.tilt = Math.sin(particle.tiltAngle) * 15
      }

      if (particle.y > h) {
        if (streamingRef.current) {
          particlesRef.current[i] = createParticle(w, h)
        } else {
          particlesRef.current.splice(i, 1)
          i--
        }
      }
    }
  }

  const draw = (context: CanvasRenderingContext2D) => {
    for (let i = 0; i < particlesRef.current.length; i++) {
      const particle = particlesRef.current[i]
      context.beginPath()
      context.lineWidth = particle.diameter

      const x2 = particle.x + particle.tilt
      const x = x2 + particle.diameter / 2
      const y2 = particle.y + particle.tilt + particle.diameter / 2

      if (cfg.gradient) {
        const gradient = context.createLinearGradient(x, particle.y, x2, y2)
        gradient.addColorStop(0.0, particle.color1)
        gradient.addColorStop(1.0, particle.color2)
        context.strokeStyle = gradient
      } else {
        context.strokeStyle = particle.color1
      }

      context.moveTo(x, particle.y)
      context.lineTo(x2, y2)
      context.stroke()
    }
  }

  useImperativeHandle(ref, () => ({
    start,
    stop,
  }))

  return null
})
