'use client'

import { Loader2 } from 'lucide-react'

import { cn } from '~/shared/utils/className'

interface LoadButtonProps {
  isFetching: boolean
  onClick: () => void
}

export function LoadButton({ isFetching, onClick }: LoadButtonProps) {
  return (
    <button
      className="relative flex w-fit cursor-pointer items-center justify-center rounded-md bg-background px-4 py-2 transition-colors duration-300 hover:bg-muted disabled:cursor-not-allowed"
      disabled={isFetching}
      onClick={onClick}
      type="button">
      <span className={cn(isFetching && 'opacity-0')}>Load more artworks</span>
      {isFetching && <Loader2 className="-translate-1/2 absolute top-1/2 left-1/2 animate-spin text-primary" />}
    </button>
  )
}
