'use server'

import { mapDepartments } from '~/modules/search/utils/mapper'
import { API } from '~/shared/helpers/api'
import { handleError } from '~/shared/helpers/errorHandler'
import type { Department } from '~/shared/types'

export async function fetchDepartments() {
  try {
    const { data } = await API.get<{ departments: Department[] }>('/departments')

    return mapDepartments(data.departments)
  } catch (error) {
    handleError(error, 'fetchDepartments')

    return []
  }
}
