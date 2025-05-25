import { FolderHeartIcon, LayoutDashboardIcon } from 'lucide-react'
import { useLocation } from 'react-router'
import { SearchForm } from '~/components/search-form'
import { Separator } from '~/components/ui/separator'
import { Sidebar, SidebarContent, SidebarHeader } from '~/components/ui/sidebar'
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
  const location = useLocation()

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      {location.pathname === '/' && (
        <SidebarContent>
          <Separator />
          <SearchForm />
        </SidebarContent>
      )}
    </Sidebar>
  )
}
