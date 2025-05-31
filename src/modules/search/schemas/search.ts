import { z } from 'zod'

export const searchSchema = z
  .object({
    query: z.string().trim().min(1),
    searchType: z.enum(['all', 'artistOrCulture', 'department']).default('all'),
    departmentId: z.string().default(''),
  })
  .refine(
    (data) => {
      if (data.searchType === 'department') {
        return data.departmentId && data.departmentId.trim() !== ''
      }
      return true
    },
    {
      path: ['departmentId'],
    },
  )

export type SearchSchema = z.infer<typeof searchSchema>
