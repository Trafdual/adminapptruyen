import { DashBoardLayout } from '../Layout/DashBoardLayout'
import { UserLayout } from '../Layout/UserLayout'
import { CategoryLayout } from '../Layout/CategoryLayout'

const publicRoutes = [
  { path: '/dashboard', component: DashBoardLayout },
  { path: '/user', component: UserLayout },
  { path: '/category', component: CategoryLayout }
]
const privateRoutes = []
export { publicRoutes, privateRoutes }
