'use client'

import { useDepartments } from '~/modules/search/hooks/useDepartments'
import { useSearchStore } from '~/modules/search/store/search'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/components/Select'

export function DepartmentsDropdown() {
  const { data: departments } = useDepartments()
  const { departmentId, setDepartmentId } = useSearchStore()

  return (
    <Select
      onValueChange={setDepartmentId}
      value={departmentId}>
      <SelectTrigger className="w-64">
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
  )
}
