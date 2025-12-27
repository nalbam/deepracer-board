import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { RacerManager } from "@/components/racer/racer-manager"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ManageHeader } from "@/components/manage/manage-header"

interface PageProps {
  params: Promise<{
    league: string
  }>
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
  const { league: leagueCode } = await params
  const league = await getLeague(leagueCode)

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

  const { league: leagueCode } = await params
  const league = await getLeague(leagueCode)

  if (!league) {
    notFound()
  }

  const racers = await getRacers(leagueCode)

  return (
    <>
      <ManageHeader />

      <div className="App-body">
        <div className="manage-container">
          {/* 헤더 */}
          <div className="manage-page-header">
            <Link href="/manage" className="btn-link btn-secondary" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              <ArrowLeft className="w-4 h-4" />
              <span>관리 대시보드로 돌아가기</span>
            </Link>
            <h1 className="manage-page-title">레이서 관리</h1>
            <p className="manage-page-description">
              {league.title} 리그의 레이서를 추가, 수정, 삭제할 수 있습니다
            </p>
          </div>

          <RacerManager
            league={leagueCode}
            leagueTitle={league.title}
            initialRacers={racers}
          />

          {/* 안내 메시지 */}
          <div className="manage-help">
            <h3 className="manage-help-title">사용 방법</h3>
            <ul className="manage-help-list">
              <li>
                <strong>레이서 추가</strong>: 이메일, 이름, 랩타임을 입력하고 저장하세요
              </li>
              <li>
                <strong>레이서 수정</strong>: 레이서 목록에서 레이서를 클릭하면 해당 레이서의 정보를 수정할 수 있습니다
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
