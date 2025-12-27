import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LeagueForm } from "@/components/league/league-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ManageHeader } from "@/components/manage/manage-header"

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
      <ManageHeader />

      <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/manage">
              <ArrowLeft className="w-4 h-4 mr-2" />
              관리 대시보드로 돌아가기
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">새 리그 생성</h1>
          <p className="text-muted-foreground">
            새로운 DeepRacer 리그를 생성하세요
          </p>
        </div>

        {/* 폼 */}
        <LeagueForm mode="create" />
      </div>
    </div>
    </>
  )
}
