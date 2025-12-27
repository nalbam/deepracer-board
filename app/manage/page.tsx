import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { ManageHeader } from "@/components/manage/manage-header"
import { MyLeagues } from "@/components/league/my-leagues"

export default async function ManagePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <>
      <ManageHeader />

      <div className="App-body">
        <div className="manage-container">
          {/* 페이지 제목 */}
          <div className="manage-page-header">
            <h1 className="manage-page-title">관리 대시보드</h1>
            <p className="manage-page-description">
              리그와 레이서를 관리하세요
            </p>
          </div>

          {/* 새 리그 생성 */}
          <div className="manage-card">
            <div className="manage-card-content">
              <div className="manage-card-icon">
                <PlusCircle className="w-8 h-8" />
              </div>
              <div className="manage-card-body">
                <h2 className="manage-card-title">새 리그 생성</h2>
                <p className="manage-card-description">
                  새로운 DeepRacer 리그를 생성하고 참가자를 모집하세요
                </p>
                <Link href="/manage/league" className="btn-link btn-primary">
                  리그 생성하기
                </Link>
              </div>
            </div>
          </div>

          {/* 내 리그 목록 */}
          <div className="manage-section">
            <h2 className="manage-section-title">내 리그 목록</h2>
            <MyLeagues />
          </div>

          {/* 안내 메시지 */}
          <div className="manage-help">
            <h3 className="manage-help-title">사용 방법</h3>
            <ul className="manage-help-list">
              <li>
                <strong>새 리그 생성</strong>: 리그 이름, 코드, 로고를 설정하여 새 대회를 만드세요
              </li>
              <li>
                <strong>레이서 관리</strong>: 내 리그 목록에서 "레이서 관리" 버튼을 클릭하여 참가자와 기록을 관리하세요
              </li>
              <li>
                <strong>리그 수정</strong>: 내 리그 목록에서 "리그 수정" 버튼을 클릭하여 리그 정보를 변경하세요
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
