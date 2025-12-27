import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, Settings, Users } from "lucide-react"

export default async function ManagePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">관리 대시보드</h1>
          <p className="text-muted-foreground">
            리그와 레이서를 관리하세요
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 새 리그 생성 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <PlusCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">새 리그 생성</h2>
                <p className="text-muted-foreground mb-4">
                  새로운 DeepRacer 리그를 생성하고 참가자를 모집하세요
                </p>
                <Button asChild>
                  <Link href="/manage/league">리그 생성하기</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* 내 리그 관리 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">내 리그 관리</h2>
                <p className="text-muted-foreground mb-4">
                  생성한 리그를 수정하거나 삭제할 수 있습니다
                </p>
                <Button asChild variant="outline">
                  <Link href="/">리그 목록 보기</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">사용 방법</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>1. <strong>새 리그 생성</strong>: 리그 이름, 코드, 로고를 설정하여 새 대회를 만드세요</li>
            <li>2. <strong>레이서 관리</strong>: 홈페이지에서 리그를 선택 후 "관리" 버튼을 클릭하여 참가자와 기록을 관리하세요</li>
            <li>3. <strong>리그 수정</strong>: 홈페이지에서 리그 카드의 "수정" 버튼을 클릭하여 리그 정보를 변경하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
