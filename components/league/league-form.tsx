"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import type { League } from "@/lib/types"

// 리그 코드 검증: 소문자, 숫자, 하이픈, 언더스코어만 허용 (4-20자)
const leagueCodeRegex = /^[a-z][a-z0-9-_]{3,19}$/

// URL 검증
const urlRegex = /^https?:\/\/.+/

const formSchema = z.object({
  league: z.string()
    .min(4, "리그 코드는 최소 4자 이상이어야 합니다")
    .max(20, "리그 코드는 최대 20자까지 가능합니다")
    .regex(leagueCodeRegex, "소문자로 시작하며, 소문자/숫자/-/_ 만 사용 가능합니다"),
  title: z.string()
    .min(1, "리그 제목을 입력하세요")
    .max(64, "리그 제목은 최대 64자까지 가능합니다"),
  logo: z.string()
    .min(1, "로고 URL을 입력하세요")
    .max(256, "URL이 너무 깁니다")
    .regex(urlRegex, "올바른 URL을 입력하세요 (http:// 또는 https:// 포함)"),
})

type FormData = z.infer<typeof formSchema>

interface LeagueFormProps {
  league?: League
  mode?: 'create' | 'edit'
}

const defaultLogos = [
  'https://deepracer-logos.s3.ap-northeast-2.amazonaws.com/logo-league.png',
  'https://deepracer-logos.s3.ap-northeast-2.amazonaws.com/logo-community-races.png',
  'https://deepracer-logos.s3.ap-northeast-2.amazonaws.com/logo-underground.png',
]

export function LeagueForm({ league, mode = 'create' }: LeagueFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState(league?.logo || defaultLogos[0])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      league: league?.league || '',
      title: league?.title || '',
      logo: league?.logo || defaultLogos[0],
    },
  })

  const currentLogo = watch('logo')

  // 로고 URL 변경 시 미리보기 업데이트
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLogoPreview(value)
  }

  // 기본 로고 선택
  const handleSelectLogo = (url: string) => {
    setValue('logo', url, { shouldValidate: true })
    setLogoPreview(url)
  }

  // 리그 코드 입력 처리 (소문자, 숫자, -, _ 만 허용)
  const handleLeagueCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-z0-9-_]/g, '')
    setValue('league', value, { shouldValidate: true })
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leagues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '리그 저장에 실패했습니다')
      }

      toast({
        title: mode === 'create' ? '리그 생성 완료' : '리그 수정 완료',
        description: `${data.title} 리그가 저장되었습니다.`,
      })

      // 생성 모드일 경우 수정 페이지로 이동
      if (mode === 'create') {
        router.push(`/manage/league/${data.league}`)
      } else {
        router.refresh()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: error instanceof Error ? error.message : '리그 저장에 실패했습니다',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="league-form">
      {/* 로고 미리보기 */}
      <div className="form-preview">
        <div className="logo-preview-container">
          <img
            src={logoPreview}
            alt="League Logo Preview"
            className="logo-preview-image"
            onError={(e) => {
              e.currentTarget.src = defaultLogos[0]
            }}
          />
          {watch('title') && (
            <p className="logo-preview-title">{watch('title')}</p>
          )}
        </div>
      </div>

      {/* Logo URL */}
      <div className="form-field">
        <label htmlFor="logo" className="form-label">로고 URL</label>
        <input
          id="logo"
          type="text"
          {...register('logo')}
          onChange={(e) => {
            register('logo').onChange(e)
            handleLogoChange(e)
          }}
          placeholder="https://example.com/logo.png"
          className={`form-input ${errors.logo ? 'form-input-error' : ''}`}
        />
        {errors.logo && (
          <p className="form-error">{errors.logo.message}</p>
        )}

        {/* 기본 로고 선택 */}
        <div className="logo-options">
          {defaultLogos.map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectLogo(url)}
              className={`logo-option ${currentLogo === url ? 'logo-option-active' : ''}`}
            >
              <img
                src={url}
                alt={`Default logo ${index + 1}`}
                className="logo-option-image"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="form-field">
        <label htmlFor="title" className="form-label">리그 제목</label>
        <input
          id="title"
          type="text"
          {...register('title')}
          placeholder="2024 Winter Championship"
          maxLength={64}
          className={`form-input ${errors.title ? 'form-input-error' : ''}`}
        />
        {errors.title && (
          <p className="form-error">{errors.title.message}</p>
        )}
      </div>

      {/* League Code */}
      <div className="form-field">
        <label htmlFor="league" className="form-label">리그 코드</label>
        <input
          id="league"
          type="text"
          {...register('league')}
          onChange={handleLeagueCodeChange}
          placeholder="2024-winter-cup"
          maxLength={20}
          readOnly={mode === 'edit'}
          disabled={mode === 'edit'}
          className={`form-input ${errors.league ? 'form-input-error' : ''} ${mode === 'edit' ? 'form-input-disabled' : ''}`}
        />
        {errors.league && (
          <p className="form-error">{errors.league.message}</p>
        )}
        <p className="form-hint">
          소문자로 시작, 소문자/숫자/-/_ 만 사용 가능 (4-20자)
          {mode === 'edit' && ' - 리그 코드는 수정할 수 없습니다'}
        </p>
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-link btn-primary btn-submit"
        >
          {isSubmitting ? '저장 중...' : mode === 'create' ? '리그 생성' : '수정 저장'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-link btn-secondary"
        >
          취소
        </button>
      </div>
    </form>
  )
}
