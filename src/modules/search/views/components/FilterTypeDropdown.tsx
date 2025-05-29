'use client'

import { type FilterType, useSearchStore } from '~/modules/search/store/search'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/components/Select'

export function FilterTypeDropdown() {
  const { filterType, setFilterType } = useSearchStore()

  const handleChange = (value: string) => {
    setFilterType(value as FilterType)
  }

  return (
    <Select
      onValueChange={handleChange}
      value={filterType}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="All fields" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All fields</SelectItem>
        <SelectItem value="artistOrCulture">Artist/Culture</SelectItem>
        <SelectItem value="department">Department</SelectItem>
      </SelectContent>
    </Select>
  )
}
