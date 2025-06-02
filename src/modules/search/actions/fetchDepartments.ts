'use server'

import { mapDepartments } from '~/modules/search/utils/mapper'
import { API } from '~/shared/helpers/api'
import { handleError } from '~/shared/helpers/errorHandler'
import { logDomainAction } from '~/shared/helpers/logger'
import type { Department } from '~/shared/types'

export async function fetchDepartments() {
  try {
    logDomainAction('departments', 'fetchList', {})

    const { data } = await API.get<{ departments: Department[] }>('/departments')

    return mapDepartments(data.departments)
  } catch (error) {
    handleError(error, 'fetchDepartments')

    return []
  }
}
