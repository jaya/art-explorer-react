'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
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

export function SearchList() {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('query')

  const form = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: queryParam || '',
      searchType: 'all',
      departmentId: '',
    },
  })

  const formData = useRef(form.getValues())
  const searchType = useWatch({
    control: form.control,
    name: 'searchType',
  })

  const {
    data: searchResults,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearch({
    query: formData.current.query,
    searchType: formData.current.searchType,
    departmentId: formData.current.departmentId,
  })

  const handleSubmit = form.handleSubmit(() => {
    queryClient.removeQueries({ queryKey: ['search', formData.current.query] })
    refetch()
  })

  useEffect(() => {
    if (queryParam) {
      form.setValue('query', queryParam)
    }
  }, [queryParam, form])

  useEffect(() => {
    const subscription = form.watch((value) => {
      formData.current = value
    })
    return () => subscription.unsubscribe()
  }, [form])

  return (
    <section>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-24">
        <h2 className="text-center font-serif text-7xl text-foreground after:mx-auto after:mt-4 after:block after:h-0.5 after:w-2/5 after:bg-primary">
          Search
        </h2>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <h3 className="font-serif text-2xl text-foreground">Search the collection</h3>
          <Form {...form}>
            <form
              className="flex items-center gap-4"
              onSubmit={handleSubmit}>
              <SearchTypeField />
              {searchType === 'department' && <DepartmentsField />}
              <QueryField />
              <Button
                size="md"
                type="submit"
                variant="primary">
                Search
              </Button>
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
            <p className="text-muted-foreground">No results found</p>
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
                <ArtworkCard artwork={artwork} />
              </motion.div>
            ))}
          </motion.div>
        ))}
        {hasNextPage && (
          <div className="flex justify-center">
            <LoadButton
              isFetching={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            />
          </div>
        )}
      </div>
    </section>
  )
}
