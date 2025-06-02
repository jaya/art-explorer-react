import type { Department } from '~/shared/types'

export function mapDepartments(departments: Department[]) {
  return departments.map((department) => ({
    name: department.displayName,
    id: department.departmentId.toString(),
  }))
}
