'use server'

import { API } from '~/shared/helpers/api'
import type { Department } from '~/shared/types'

export async function fetchDepartments() {
  const { data } = await API.get<{ departments: Department[] }>('/departments')

  return data.departments.map((department) => ({
    name: department.displayName,
    id: department.departmentId.toString(),
  }))
}
