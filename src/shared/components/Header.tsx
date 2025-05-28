import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-serif text-3xl text-foreground">
          <Link href="/">Art Explorer</Link>
        </h1>
      </div>
    </header>
  )
}
