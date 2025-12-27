"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { Racer } from "@/lib/types"

// 이메일 검증
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 랩타임 형식 검증: MM:SS.mmm
const laptimeRegex = /^[0-9]{2}:[0-9]{2}\.[0-9]{3}$/

const formSchema = z.object({
  email: z.string()
    .min(1, "이메일을 입력하세요")
    .max(256, "이메일이 너무 깁니다")
    .regex(emailRegex, "올바른 이메일 형식이 아닙니다"),
  racerName: z.string()
    .min(1, "레이서 이름을 입력하세요")
    .max(32, "이름은 최대 32자까지 가능합니다"),
  laptime: z.string()
    .regex(laptimeRegex, "랩타임 형식: MM:SS.mmm (예: 01:23.456)")
    .optional()
    .or(z.literal('')),
  forceUpdate: z.boolean().optional(),
  forceDelete: z.boolean().optional(),
})

type FormData = z.infer<typeof formSchema>

interface RacerFormProps {
  league: string
  selectedRacer?: Racer | null
  onSuccess?: () => void
}

export function RacerForm({ league, selectedRacer, onSuccess }: RacerFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      racerName: '',
      laptime: '',
      forceUpdate: false,
      forceDelete: false,
    },
  })

  const forceDelete = watch('forceDelete')
  const forceUpdate = watch('forceUpdate')

  // 밀리초를 MM:SS.mmm 형식으로 변환
  const millisecondsToLaptime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    const ms = milliseconds % 1000

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
  }

  // 랩타임을 밀리초로 변환
  const laptimeToMilliseconds = (timeStr: string): number => {
    if (!timeStr || !laptimeRegex.test(timeStr)) return 0

    const [minutes, rest] = timeStr.split(':')
    const [seconds, milliseconds] = rest.split('.')

    return (
      parseInt(minutes) * 60 * 1000 +
      parseInt(seconds) * 1000 +
      parseInt(milliseconds)
    )
  }

  // 선택된 레이서가 변경되면 폼 필드 채우기
  useEffect(() => {
    if (selectedRacer) {
      setValue('email', selectedRacer.email)
      setValue('racerName', selectedRacer.racerName)
      setValue('laptime', selectedRacer.laptime ? millisecondsToLaptime(selectedRacer.laptime) : '')
      setValue('forceUpdate', false)
      setValue('forceDelete', false)
    }
  }, [selectedRacer, setValue])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // forceDelete가 true면 랩타임과 이름은 필요 없음
      if (data.forceDelete && !data.laptime && !data.racerName) {
        setValue('racerName', 'deleted')
        setValue('laptime', '00:00.000')
      }

      // 랩타임을 밀리초로 변환
      const laptimeMs = data.laptime ? laptimeToMilliseconds(data.laptime) : undefined

      console.log('=== RACER FORM SUBMIT ===')
      console.log('Form data:', data)
      console.log('Laptime string:', data.laptime)
      console.log('Laptime milliseconds:', laptimeMs)
      console.log('Force update:', data.forceUpdate)

      const payload = {
        league,
        email: data.email,
        racerName: data.racerName,
        laptime: laptimeMs,
        forceUpdate: data.forceUpdate,
        forceDelete: data.forceDelete,
      }

      console.log('API payload:', payload)

      const response = await fetch('/api/racers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '레이서 저장에 실패했습니다')
      }

      toast({
        title: data.forceDelete ? '레이서 삭제 완료' : '레이서 저장 완료',
        description: data.forceDelete
          ? `${data.email} 레이서가 삭제되었습니다.`
          : `${data.racerName} 레이서가 저장되었습니다.`,
      })

      // 폼 리셋
      reset()

      // 성공 콜백 실행 (페이지 새로고침 등)
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: error instanceof Error ? error.message : '레이서 저장에 실패했습니다',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="racer-form">
      {/* Email */}
      <div className="form-field">
        <label htmlFor="email" className="form-label">이메일</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          placeholder="racer@example.com"
          maxLength={256}
          className={`form-input ${errors.email ? 'form-input-error' : ''}`}
        />
        {errors.email && (
          <p className="form-error">{errors.email.message}</p>
        )}
      </div>

      {/* Racer Name */}
      <div className="form-field">
        <label htmlFor="racerName" className="form-label">레이서 이름</label>
        <input
          id="racerName"
          type="text"
          {...register('racerName')}
          placeholder="SpeedRacer"
          maxLength={32}
          disabled={forceDelete}
          className={`form-input ${errors.racerName ? 'form-input-error' : ''} ${forceDelete ? 'form-input-disabled' : ''}`}
        />
        {errors.racerName && (
          <p className="form-error">{errors.racerName.message}</p>
        )}
      </div>

      {/* Laptime */}
      <div className="form-field">
        <label htmlFor="laptime" className="form-label">랩타임</label>
        <input
          id="laptime"
          type="text"
          {...register('laptime')}
          placeholder="01:23.456"
          maxLength={9}
          disabled={forceDelete}
          className={`form-input ${errors.laptime ? 'form-input-error' : ''} ${forceDelete ? 'form-input-disabled' : ''}`}
        />
        {errors.laptime && (
          <p className="form-error">{errors.laptime.message}</p>
        )}
        <p className="form-hint">
          형식: MM:SS.mmm (예: 01:23.456)
        </p>
      </div>

      {/* Options */}
      <div className="form-field">
        <div className="form-checkbox-group">
          <label className="form-checkbox-label">
            <input
              id="forceUpdate"
              type="checkbox"
              checked={forceUpdate}
              onChange={(e) => setValue('forceUpdate', e.target.checked)}
              className="form-checkbox"
            />
            <span>강제 업데이트 (기존 최고 기록보다 느려도 업데이트)</span>
          </label>
        </div>

        <div className="form-checkbox-group">
          <label className="form-checkbox-label form-checkbox-label-danger">
            <input
              id="forceDelete"
              type="checkbox"
              checked={forceDelete}
              onChange={(e) => setValue('forceDelete', e.target.checked)}
              className="form-checkbox"
            />
            <span>강제 삭제 (레이서 완전히 제거)</span>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-link btn-submit ${forceDelete ? 'btn-danger' : 'btn-primary'}`}
        >
          {isSubmitting
            ? '처리 중...'
            : forceDelete
            ? '레이서 삭제'
            : '레이서 저장'}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="btn-link btn-secondary"
        >
          초기화
        </button>
      </div>
    </form>
  )
}
