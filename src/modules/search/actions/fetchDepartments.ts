'use server'

import { mapDepartments } from '~/modules/search/utils/mapper'
import { API } from '~/shared/helpers/api'
import type { Department } from '~/shared/types'

export async function fetchDepartments() {
  const { data } = await API.get<{ departments: Department[] }>('/departments')

  return mapDepartments(data.departments)
}
