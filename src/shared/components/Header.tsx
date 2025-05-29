'use client'

import { ArrowRightIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { FormEvent } from 'react'

import { Button } from '~/shared/components/Button'
import { Input } from '~/shared/components/Input'
import { SearchButton } from '~/shared/components/SearchButton'
import { ThemeButton } from '~/shared/components/ThemeButton'
import { useSearchStore } from '~/shared/store/search'
import { cn } from '~/shared/utils/className'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const isFavoritesPage = pathname === '/favorites'

  const { query, setQuery, isOpen, setIsOpen } = useSearchStore()

  const handleOpenSearch = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(`/search/${query}`)
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
              isActive={isOpen}
              onClick={handleOpenSearch}
            />
            <ThemeButton />
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            animate={{ y: 0 }}
            className="absolute inset-x-0 top-28 z-1 flex h-16 items-center bg-accent"
            exit={{ y: -64 }}
            initial={{ y: -64 }}
            transition={{ duration: 0.3 }}>
            <div className="mx-auto flex w-full max-w-7xl items-center justify-end px-4">
              <form
                className="relative flex w-full max-w-md items-center"
                onSubmit={handleSubmit}>
                <Input
                  className="w-full"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for an artist, artwork, or department"
                  value={query}
                />
                <Button
                  className="absolute top-px right-px bottom-px h-auto"
                  size="icon"
                  type="submit"
                  variant="ghost">
                  <ArrowRightIcon />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
