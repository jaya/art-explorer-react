'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ThemeButton } from '~/shared/components/ThemeButton'
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
    <header className="relative">
      <div className="relative z-2 flex h-28 items-center bg-primary">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
          <h1 className="font-serif text-3xl text-primary-foreground">
            <Link href="/">Art Explorer</Link>
          </h1>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4">
              {links.map((link) => (
                <Link
                  className={cn(
                    'rounded-md bg-transparent px-4 py-1 font-medium text-lg text-primary-foreground transition-colors duration-300 hover:bg-white',
                    pathname === link.href && 'bg-white',
                  )}
                  href={link.href}
                  key={link.href}>
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
