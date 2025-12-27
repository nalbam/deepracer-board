import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { LeagueForm } from "@/components/league/league-form"
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

export async function generateMetadata({ params }: PageProps) {
  const { league: leagueCode } = await params
  const league = await getLeague(leagueCode)

  if (!league) {
    return {
      title: "리그를 찾을 수 없습니다",
    }
  }

  return {
    title: `${league.title} 수정 - DeepRacer Board`,
    description: `${league.title} 리그 정보를 수정하세요`,
  }
}

export default async function EditLeaguePage({ params }: PageProps) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const { league: leagueCode } = await params
  const league = await getLeague(leagueCode)

  if (!league) {
    notFound()
  }

  // 리그 소유자 확인
  if (league.userId !== session.user.id) {
    return (
      <>
        <ManageHeader />

        <div className="App-body">
          <div className="manage-container">
            <div className="manage-empty" style={{ marginTop: '40px' }}>
              <h1 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>권한이 없습니다</h1>
              <p style={{ color: '#aaa', marginBottom: '24px' }}>
                이 리그를 수정할 권한이 없습니다. 리그 생성자만 수정할 수 있습니다.
              </p>
              <Link href="/" className="btn-link btn-primary">
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ManageHeader />

      <div className="App-body">
        <div className="manage-container">
          {/* 헤더 */}
          <div className="manage-page-header">
            <Link href={`/league/${leagueCode}`} className="btn-link btn-secondary" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              <ArrowLeft className="w-4 h-4" />
              <span>리더보드로 돌아가기</span>
            </Link>
            <h1 className="manage-page-title">리그 수정</h1>
            <p className="manage-page-description">
              {league.title} 리그 정보를 수정하세요
            </p>
          </div>

          {/* 폼 */}
          <div className="manage-form-container">
            <LeagueForm league={league} mode="edit" />
          </div>
        </div>
      </div>
    </>
  )
}
