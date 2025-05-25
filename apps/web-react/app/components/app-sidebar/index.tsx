import { FolderHeartIcon, LayoutDashboardIcon } from 'lucide-react'
import { useLocation } from 'react-router'
import { SearchForm } from '~/components/search-form'
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
      {location.pathname === '/' && (
        <SidebarHeader>
          <SearchForm />
        </SidebarHeader>
      )}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
