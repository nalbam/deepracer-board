import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { LeagueForm } from "@/components/league/league-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export async function generateMetadata({ params }: PageProps) {
  const league = await getLeague(params.league)

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

  const league = await getLeague(params.league)

  if (!league) {
    notFound()
  }

  // 리그 소유자 확인
  if (league.userId !== session.user.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">권한이 없습니다</h1>
          <p className="text-muted-foreground mb-6">
            이 리그를 수정할 권한이 없습니다. 리그 생성자만 수정할 수 있습니다.
          </p>
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/league/${params.league}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              리더보드로 돌아가기
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">리그 수정</h1>
          <p className="text-muted-foreground">
            {league.title} 리그 정보를 수정하세요
          </p>
        </div>

        {/* 폼 */}
        <LeagueForm league={league} mode="edit" />
      </div>
    </div>
  )
}
