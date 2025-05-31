'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ThemeButton } from '~/shared/components/ThemeButton'
import { logger } from '~/shared/helpers/logger'
import { cn } from '~/shared/utils/className'

const links = [
  {
    href: '/favorites',
    label: 'Favorites',
  },
  {
    href: '/search',
    label: 'Search',
  },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="relative z-10">
      <div className="flex h-28 items-center bg-primary">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
          <h1 className="whitespace-nowrap font-serif text-3xl text-primary-foreground">
            <Link href="/">Art Explorer</Link>
          </h1>
          <div className="flex items-center">
            <nav className="xs:static absolute inset-x-0 top-28 flex items-center justify-end gap-4 bg-muted-foreground/20 xs:bg-transparent px-4 py-2">
              {links.map((link) => (
                <Link
                  className={cn(
                    'rounded-md bg-transparent px-4 py-1 font-medium text-base text-foreground xs:text-lg xs:text-primary-foreground transition-colors duration-300 hover:bg-white',
                    pathname === link.href && 'bg-white text-primary-foreground',
                  )}
                  href={link.href}
                  key={link.href}
                  onClick={() => logger('info', 'click:menuLink', { from: pathname, to: link.href })}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <ThemeButton />
          </div>
        </div>
      </div>
    </header>
  )
}
