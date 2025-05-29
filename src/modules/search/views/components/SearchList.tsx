'use client'

import { useParams } from 'next/navigation'

export function SearchList() {
  const { query } = useParams<{ query: string }>()

  return (
    <section>
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-24">
        <h2 className="text-center font-serif text-7xl text-foreground after:mx-auto after:mt-4 after:block after:h-0.5 after:w-2/5 after:bg-primary">
          Search results for: {query}
        </h2>
      </div>
    </section>
  )
}
