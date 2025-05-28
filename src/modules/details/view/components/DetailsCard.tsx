import { cn } from '~/shared/utils/className'

interface DetailsCardProps {
  label: string
  value: string
  className?: string
}

export function DetailsCard({ label, value, className }: DetailsCardProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <p className="text-lg text-muted-foreground after:mt-1 after:block after:h-0.5 after:w-24 after:bg-muted-foreground/50">
        {label}
      </p>
      {label === 'link' ? (
        <a
          className="col-span-2 text-3xl text-foreground underline-offset-4 hover:underline"
          href={value}
          rel="noopener noreferrer"
          target="_blank">
          {value}
        </a>
      ) : (
        <p className="text-3xl text-foreground">{value}</p>
      )}
    </div>
  )
}
