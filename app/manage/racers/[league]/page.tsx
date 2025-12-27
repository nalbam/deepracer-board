import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { RacerForm } from "@/components/racer/racer-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ManageHeader } from "@/components/manage/manage-header"

interface PageProps {
  params: {
    league: string
  }
}

async function getLeague(leagueCode: string) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/leagues/${leagueCode}`,
    {
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    return null
  }

  const result = await response.json()
  return result.data
}

async function getRacers(leagueCode: string) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/racers/${leagueCode}`,
    {
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    return []
  }

  const result = await response.json()
  return result.data || []
}

export async function generateMetadata({ params }: PageProps) {
  const league = await getLeague(params.league)

  if (!league) {
    return {
      title: "리그를 찾을 수 없습니다",
    }
  }

  return {
    title: `${league.title} 레이서 관리 - DeepRacer Board`,
    description: `${league.title} 리그의 레이서를 관리하세요`,
  }
}

export default async function ManageRacersPage({ params }: PageProps) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const league = await getLeague(params.league)

  if (!league) {
    notFound()
  }

  const racers = await getRacers(params.league)

  return (
    <>
      <ManageHeader />

      <div className="App-body">
        <div className="manage-container">
          {/* 헤더 */}
          <div className="manage-page-header">
            <Link href={`/league/${params.league}`} className="btn-link btn-secondary" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              <ArrowLeft className="w-4 h-4" />
              <span>리더보드로 돌아가기</span>
            </Link>
            <h1 className="manage-page-title">레이서 관리</h1>
            <p className="manage-page-description">
              {league.title} 리그의 레이서를 추가, 수정, 삭제할 수 있습니다
            </p>
          </div>

          <div className="racer-manage-grid">
            {/* 레이서 폼 */}
            <div className="racer-form-section">
              <h2 className="racer-section-title">레이서 추가/수정</h2>
              <RacerForm league={params.league} />
            </div>

            {/* 현재 레이서 목록 */}
            <div className="racer-list-section">
              <h2 className="racer-section-title">
                현재 레이서 ({racers.length}명)
              </h2>
              {racers.length === 0 ? (
                <div className="racer-empty">
                  등록된 레이서가 없습니다
                </div>
              ) : (
                <div className="racer-list">
                  {racers
                    .sort((a: any, b: any) => {
                      if (!a.laptime) return 1
                      if (!b.laptime) return -1
                      return a.laptime - b.laptime
                    })
                    .map((racer: any, index: number) => (
                      <div key={racer.email} className="racer-item">
                        <div className="racer-item-info">
                          <span className="racer-rank">#{index + 1}</span>
                          <div className="racer-details">
                            <div className="racer-name">{racer.racerName}</div>
                            <div className="racer-email">{racer.email}</div>
                          </div>
                        </div>
                        <div className="racer-laptime">
                          {racer.laptime ? (
                            <span className="laptime">{formatLaptime(racer.laptime)}</span>
                          ) : (
                            <span className="no-record">기록 없음</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="manage-help">
            <h3 className="manage-help-title">사용 방법</h3>
            <ul className="manage-help-list">
              <li>
                <strong>레이서 추가</strong>: 이메일, 이름, 랩타임을 입력하고 저장하세요
              </li>
              <li>
                <strong>레이서 수정</strong>: 동일한 이메일로 다시 입력하면 기록이 업데이트됩니다 (더 빠른 기록만 저장)
              </li>
              <li>
                <strong>강제 업데이트</strong>: 체크하면 기존 기록보다 느려도 업데이트됩니다
              </li>
              <li>
                <strong>레이서 삭제</strong>: 강제 삭제를 체크하고 이메일만 입력하면 레이서를 완전히 제거합니다
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

function formatLaptime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.floor((milliseconds % 60000) / 1000)
  const ms = milliseconds % 1000

  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
}
