import { ModeToggle } from '~/components/mode-toggle'
import { SidebarTrigger } from '~/components/ui/sidebar'

type Props = {
  title: string
}

export function Header({ title }: Props) {
  return (
    <header className="w-full rounded-t-2xl sticky top-0 z-10 bg-background/80 shadow-sm flex flex-row items-center p-2 justify-between backdrop-blur-md">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger />
        <ModeToggle />
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <div />
    </header>
  )
}
