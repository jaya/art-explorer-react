'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { type SearchSchema, searchSchema } from '~/modules/search/schemas/search'
import { DepartmentsField } from '~/modules/search/views/components/DepartmentsField'
import { QueryField } from '~/modules/search/views/components/QueryField'
import { SearchTypeField } from '~/modules/search/views/components/SearchTypeField'
import { Button } from '~/shared/components/Button'
import { Form } from '~/shared/components/Form'

export function SearchList() {
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

  const searchType = form.watch('searchType')

  useEffect(() => {
    if (queryParam) {
      form.setValue('query', queryParam)
    }
  }, [queryParam, form])

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data)
  })

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
      </div>
    </section>
  )
}
