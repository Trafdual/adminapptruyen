import { DashBoardLayout } from '../Layout/DashBoardLayout'
import { UserLayout } from '../Layout/UserLayout'
import { CategoryLayout } from '../Layout/CategoryLayout'
import { MangaLayout } from '../Layout/MangaLayout'
import { ChapterLayout } from '../Layout/ChapterLayout'
import { BaiVietLayout } from '../Layout/BaiVietLayout'

const publicRoutes = [
  { path: '/dashboard', component: DashBoardLayout },
  { path: '/user', component: UserLayout },
  { path: '/category', component: CategoryLayout },
  { path: '/manga', component: MangaLayout },
  { path: '/chapter', component: ChapterLayout },
  { path: '/baiviet', component: BaiVietLayout }
]
const privateRoutes = []
export { publicRoutes, privateRoutes }
