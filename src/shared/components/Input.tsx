import type { ComponentProps } from 'react'
import { cn } from '~/shared/utils/className'

export function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <div
      className={cn(
        'flex h-9 w-full min-w-0 items-baseline gap-2 rounded-md border border-border bg-background px-3 py-2 font-medium text-base text-primary-dark',
        'transition-[color,box-shadow] focus-within:border-border focus-within:ring-2 focus-within:ring-border/50',
        'has-aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      data-slot="input">
      <input
        className={cn(
          'm-0 h-full w-full appearance-none border-none bg-transparent p-0 font-inherit text-inherit outline-none',
          'placeholder:text-muted-foreground placeholder:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        )}
        type={type}
        {...props}
      />
    </div>
  )
}
