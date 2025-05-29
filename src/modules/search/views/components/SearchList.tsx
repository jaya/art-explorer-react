'use client'

import { useSearchParams } from 'next/navigation'
import { type FormEvent, useEffect } from 'react'

import { useSearchStore } from '~/modules/search/store/search'
import { DepartmentsDropdown } from '~/modules/search/views/components/DepartmentsDropdown'
import { Button } from '~/shared/components/Button'
import { Input } from '~/shared/components/Input'

export function SearchList() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('query')

  const { query, setQuery } = useSearchStore()

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam)
    }
  }, [queryParam, setQuery])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!query) return

    event.preventDefault()
  }

  return (
    <section>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-24">
        <h2 className="text-center font-serif text-7xl text-foreground after:mx-auto after:mt-4 after:block after:h-0.5 after:w-2/5 after:bg-primary">
          Search
        </h2>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <h3 className="font-serif text-2xl text-foreground">Search the collection</h3>
          <form
            className="flex items-center gap-4"
            onSubmit={handleSubmit}>
            <Input
              className="w-full"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for an artist, artwork, or department"
              value={query}
            />
            <Button
              size="md"
              type="submit"
              variant="primary">
              Search
            </Button>
          </form>
        </div>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <h3 className="font-serif text-2xl text-foreground">Filter by</h3>
          <DepartmentsDropdown />
        </div>
      </div>
    </section>
  )
}
