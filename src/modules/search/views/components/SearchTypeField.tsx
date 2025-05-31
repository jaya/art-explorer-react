'use client'

import { useFormContext } from 'react-hook-form'

import type { SearchSchema } from '~/modules/search/schemas/search'
import { FormControl, FormField, FormItem } from '~/shared/components/Form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/components/Select'

export function SearchTypeField() {
  const form = useFormContext<SearchSchema>()

  return (
    <FormField
      control={form.control}
      name={'searchType'}
      render={({ field, fieldState }) => (
        <FormItem className="w-full md:w-48">
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                if (value !== 'department') {
                  form.setValue('departmentId', '')
                }
              }}
              value={field.value}>
              <SelectTrigger
                aria-invalid={!!fieldState.error}
                className="w-full"
                data-testid="search-type-trigger">
                <SelectValue placeholder="All fields" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All fields</SelectItem>
                <SelectItem value="artistOrCulture">Artist/Culture</SelectItem>
                <SelectItem value="department">Department</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
