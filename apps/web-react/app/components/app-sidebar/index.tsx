import {
  BarChartIcon,
  FolderHeartIcon,
  FolderIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from 'lucide-react'
import { Sidebar, SidebarContent } from '~/components/ui/sidebar'
import { NavMain } from './nav-main'

const data = {
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Favorites',
      url: '/favorites',
      icon: FolderHeartIcon,
    },
  ],
}

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
