'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { motion } from 'motion/react'
import { parseAsString, useQueryStates } from 'nuqs'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useSearch } from '~/modules/search/hooks/useSearch'
import { type SearchSchema, searchSchema } from '~/modules/search/schemas/search'
import { DepartmentsField } from '~/modules/search/views/components/DepartmentsField'
import { QueryField } from '~/modules/search/views/components/QueryField'
import { SearchTypeField } from '~/modules/search/views/components/SearchTypeField'
import { containerVariants, itemVariants } from '~/shared/animations/stagger'
import { ArtworkCard } from '~/shared/components/ArtworkCard'
import { Button } from '~/shared/components/Button'
import { Form } from '~/shared/components/Form'
import { LoadButton } from '~/shared/components/LoadButton'
import { logger } from '~/shared/helpers/logger'

const defaultValues = {
  query: '',
  searchType: 'all' as const,
  departmentId: '',
}

export function SearchList() {
  const [searchParams, setSearchParams] = useState<SearchSchema>(defaultValues)

  const queryClient = useQueryClient()
  const [search, setSearch] = useQueryStates({
    query: parseAsString,
  })

  const form = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues,
  })

  const {
    data: searchResults,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearch({
    query: searchParams.query,
    searchType: searchParams.searchType,
    departmentId: searchParams.departmentId,
    enabled: searchParams.query.trim().length > 0,
  })

  const handleSubmit = form.handleSubmit((values) => {
    setSearchParams(values)
    setSearch({ query: values.query })
    queryClient.removeQueries({ queryKey: ['search', values.query] })
  })

  useEffect(() => {
    if (search.query) {
      const newParams = {
        ...form.getValues(),
        query: search.query,
      }
      form.reset(newParams)
      setSearchParams(newParams)
    }
  }, [search.query, form])

  const searchType = form.watch('searchType')

  return (
    <section>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pt-16 pb-24">
        <h2 className="text-center font-serif text-7xl text-foreground after:mx-auto after:mt-4 after:block after:h-0.5 after:w-2/5 after:bg-primary">
          Search
        </h2>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <h3 className="font-serif text-2xl text-foreground">Search the collection</h3>
          <Form {...form}>
            <form
              className="flex flex-col gap-4 md:flex-row"
              onSubmit={handleSubmit}>
              <div className="flex xs:flex-row flex-col items-center gap-4">
                <SearchTypeField />
                {searchType === 'department' && <DepartmentsField />}
              </div>
              <div className="flex flex-1 xs:flex-row flex-col items-center gap-4">
                <QueryField />
                <Button
                  className="w-full xs:w-auto"
                  size="md"
                  type="submit"
                  variant="primary">
                  Search
                </Button>
              </div>
            </form>
          </Form>
        </div>
        {isFetching && (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        )}
        {searchResults?.pages[0].data.length === 0 && (
          <div className="flex justify-center">
            <p className="text-center text-2xl text-muted-foreground">No results found!</p>
          </div>
        )}
        {searchResults?.pages?.map((page) => (
          <motion.div
            animate="visible"
            className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3"
            data-testid="search-list"
            initial="hidden"
            key={page.nextPage ?? 'initial'}
            variants={containerVariants}>
            {page.data.map((artwork) => (
              <motion.div
                className="flex"
                key={artwork.objectID}
                variants={itemVariants}>
                <ArtworkCard
                  artwork={artwork}
                  onClick={() =>
                    logger('info', 'click:artworkCard from search list', {
                      artworkId: artwork.objectID,
                      title: artwork.title,
                    })
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
        {hasNextPage && (
          <div className="flex justify-center">
            <LoadButton
              isFetching={isFetchingNextPage}
              onClick={() => {
                logger('info', 'click:loadMoreArtworks from search list', {
                  page: searchResults?.pages[searchResults.pages.length - 1].nextPage,
                })
                fetchNextPage()
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
