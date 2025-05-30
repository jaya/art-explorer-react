'use client'

import { useFormContext } from 'react-hook-form'

import { useDepartments } from '~/modules/search/hooks/useDepartments'
import type { SearchSchema } from '~/modules/search/schemas/search'
import { FormControl, FormField, FormItem } from '~/shared/components/Form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/components/Select'

export function DepartmentsField() {
  const { data: departments } = useDepartments()

  const form = useFormContext<SearchSchema>()

  return (
    <FormField
      control={form.control}
      name={'departmentId'}
      render={({ field, fieldState }) => (
        <FormItem className="w-60">
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}>
              <SelectTrigger
                aria-invalid={!!fieldState.error}
                className="w-full"
                data-testid="departments-trigger">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((department) => (
                  <SelectItem
                    key={department.id}
                    value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
