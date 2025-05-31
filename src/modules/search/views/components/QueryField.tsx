import { useFormContext } from 'react-hook-form'

import type { SearchSchema } from '~/modules/search/schemas/search'
import { FormControl, FormField, FormItem } from '~/shared/components/Form'
import { Input } from '~/shared/components/Input'

export function QueryField() {
  const form = useFormContext<SearchSchema>()

  return (
    <FormField
      control={form.control}
      name={'query'}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <Input
              placeholder="Search for an artwork, artist, or department"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
