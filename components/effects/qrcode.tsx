"use client"

import Image from 'next/image'

interface QRCodeProps {
  league?: string
  className?: string
}

export function QRCode({ league, className = '' }: QRCodeProps) {
  // QR 코드 URL 생성
  const baseUrl = 'https://deepracerboard.com'
  const targetUrl = league ? `${baseUrl}/league/${league}` : baseUrl
  const qrUrl = `https://qr.nalbam.com/qr.png?body=${encodeURIComponent(targetUrl)}`

  if (!league) {
    return null
  }

  return (
    <div className={`logo ${className}`}>
      <Image
        id="qr"
        src={qrUrl}
        alt={`QR Code for ${league}`}
        width={200}
        height={200}
        unoptimized // 외부 API이므로 Next.js 이미지 최적화 비활성화
      />
    </div>
  )
}
