'use client'

import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '~/shared/utils/className'

export const buttonVariants = tv({
  base: "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-md outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
      destructive:
        'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
      outline:
        'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
      ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      sm: 'h-8 rounded-lg px-3 text-sm has-[svg]:px-2',
      md: 'h-9 px-3 py-2 text-md has-[div>div>svg]:px-2',
      lg: 'h-10 px-4 text-md',
      icon: 'size-9',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      data-slot="button"
      {...props}>
      <div className="relative inline-flex items-center justify-center">
        {loading && (
          <Loader2 className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-5 animate-spin" />
        )}
        <div
          className={cn('inline-flex items-center justify-center gap-1', {
            invisible: loading,
            'opacity-100': !loading,
          })}>
          {props.children}
        </div>
      </div>
    </Comp>
  )
}
