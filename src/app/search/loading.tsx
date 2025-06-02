import { Loader2 } from 'lucide-react'

export default function SearchLoading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  )
}
