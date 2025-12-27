import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LeagueForm } from "@/components/league/league-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AppHeader } from "@/components/common/app-header"

export const metadata = {
  title: "새 리그 생성 - DeepRacer Board",
  description: "새로운 DeepRacer 리그를 생성하세요",
}

export default async function CreateLeaguePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <>
      <AppHeader />

      <div className="App-body">
        <div className="manage-container">
          {/* 헤더 */}
          <div className="manage-page-header">
            <Link href="/manage" className="btn-link btn-secondary" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              <ArrowLeft className="w-4 h-4" />
              <span>관리 대시보드로 돌아가기</span>
            </Link>
            <h1 className="manage-page-title">새 리그 생성</h1>
            <p className="manage-page-description">
              새로운 DeepRacer 리그를 생성하세요
            </p>
          </div>

          {/* 폼 */}
          <div className="manage-form-container">
            <LeagueForm mode="create" />
          </div>
        </div>
      </div>
    </>
  )
}
