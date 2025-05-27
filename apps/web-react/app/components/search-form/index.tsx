import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { DepartmentsCombobox } from '~/components/departments-combobox'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
} from '~/components/ui/sidebar'

const searchFormSchema = z.object({
  search: z.string().trim().min(3, 'Minimum 3 characters'),
  departmentId: z.coerce.number().min(1).optional(),
})

type SearchForm = z.infer<typeof searchFormSchema>

export function SearchForm() {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<SearchForm>({
    resolver: zodResolver(searchFormSchema),
  })
  const navigate = useNavigate()

  const onSubmit = (data: SearchForm) => {
    let url = `/?search=${encodeURIComponent(data.search)}`
    if (data.departmentId) {
      url = `${url}&departmentId=${data.departmentId}`
    }

    navigate(url)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SidebarGroup>
        <SidebarGroupLabel>Filters</SidebarGroupLabel>
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
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
          </SidebarMenuItem>
          {errors.search && (
            <SidebarMenuItem>
              <span className="text-xs text-red-500 mt-1">
                {errors.search.message}
              </span>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <DepartmentsCombobox
              onSelect={departmentId => setValue('departmentId', departmentId)}
            />
          </SidebarMenuItem>
          <Button>Filter</Button>
        </SidebarMenu>
      </SidebarGroup>
    </form>
  )
}
