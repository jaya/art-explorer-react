import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-primary">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8">
        <h1 className="font-serif text-3xl text-foreground">
          <Link href="/">Art Explorer</Link>
        </h1>
        <nav className="flex items-center gap-4">
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/favorites">
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  )
}
