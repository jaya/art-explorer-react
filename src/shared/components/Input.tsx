'use client'

import type * as React from 'react'

import { cn } from '~/shared/utils/className'

export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <div
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-input bg-background! px-3 py-2 text-md shadow-xs transition-all',
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30',
        'aria-invalid:border-destructive/80 aria-invalid:ring-[3px] aria-invalid:ring-destructive/10 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      data-slot="input">
      <input
        className={cn(
          'm-0 h-full w-full appearance-none border-none bg-transparent p-0 font-inherit text-inherit outline-none',
          'placeholder:text-md placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        )}
        type={type}
        {...props}
      />
    </div>
  )
}
