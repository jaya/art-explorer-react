import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { Label } from '~/components/ui/label'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from '~/components/ui/sidebar'

const searchFormSchema = z.object({
  search: z.string().trim().min(3, 'Minimum 3 characters'),
})

type SearchForm = z.infer<typeof searchFormSchema>

export function SearchForm() {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<SearchForm>({
    resolver: zodResolver(searchFormSchema),
  })
  const navigate = useNavigate()

  const onSubmit = (data: SearchForm) => {
    navigate(`/?search=${encodeURIComponent(data.search)}`)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search by artist or culture..."
            className="pl-8"
            {...register('search')}
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
        {errors.search && (
          <span className="text-xs text-red-500 mt-1">
            {errors.search.message}
          </span>
        )}
      </SidebarGroup>
    </form>
  )
}
