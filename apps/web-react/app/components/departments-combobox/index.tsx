import { DEPARTMENTS_KEY_QUERY } from '@/constants/gallery.constant'
import { ArtworkService } from '@/services/artworks'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

const useDepartments = () => {
  return useQuery({
    queryKey: [DEPARTMENTS_KEY_QUERY],
    queryFn: ArtworkService.getDepartments || [],
    staleTime: Number.POSITIVE_INFINITY,
  })
}

type Props = {
  onSelect: (departmentId: number | undefined) => void
}

export function DepartmentsCombobox({ onSelect }: Props) {
  const { data } = useDepartments()
  const departments = data || []
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="w-full h-[32px] justify-between p-0"
        >
          {value ? (
            <span className="line-clamp-[150px]">
              {
                departments.find(
                  department => department.departmentId === Number(value)
                )?.displayName
              }
            </span>
          ) : (
            <span className="opacity-50">Select a department</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[224px] p-0">
        <Command>
          <CommandInput placeholder="Search department..." className="h-9" />
          <CommandList>
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {departments.map(department => (
                <CommandItem
                  key={department.departmentId}
                  value={String(department.departmentId)}
                  onSelect={currentValue => {
                    const newValue = currentValue === value ? '' : currentValue
                    setValue(newValue)
                    setOpen(false)
                    onSelect(newValue ? Number(newValue) : undefined)
                  }}
                  className={
                    value === String(department.departmentId)
                      ? 'bg-primary/70'
                      : ''
                  }
                >
                  {department.displayName}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === department.displayName
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
