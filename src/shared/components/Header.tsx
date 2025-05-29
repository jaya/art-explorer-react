'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Input } from '~/shared/components/Input'
import { SearchButton } from '~/shared/components/SearchButton'
import { ThemeButton } from '~/shared/components/ThemeButton'
import { cn } from '~/shared/utils/className'

export function Header() {
  const pathname = usePathname()
  const isFavoritesPage = pathname === '/favorites'
  const isSearchPage = pathname === '/search'

  const [isSearchOpen, setIsSearchOpen] = useState(false || isSearchPage)

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <header className="relative">
      <div className="relative z-2 flex h-28 items-center bg-primary">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
          <h1 className="font-serif text-3xl text-black">
            <Link href="/">Art Explorer</Link>
          </h1>
          <div className="flex items-center gap-4">
            <nav>
              <Link
                className={cn(
                  'rounded-md bg-transparent px-4 py-2 text-black text-lg transition-colors duration-300 hover:bg-white',
                  isFavoritesPage && 'bg-white',
                )}
                href="/favorites">
                Favorites
              </Link>
            </nav>
            <SearchButton
              isActive={isSearchOpen}
              onClick={handleSearch}
            />
            <ThemeButton />
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isSearchOpen && (
          <motion.div
            animate={{ y: 0 }}
            className="absolute inset-x-0 top-28 z-1 flex h-16 items-center bg-accent"
            exit={{ y: -64 }}
            initial={{ y: -64 }}
            transition={{ duration: 0.3 }}>
            <div className="mx-auto flex w-full max-w-7xl items-center justify-end px-4">
              <Input
                className="w-full max-w-md"
                placeholder="Search for an artist, artwork, or department"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
