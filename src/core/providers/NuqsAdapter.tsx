import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { PropsWithChildren } from 'react'

export function NuqsAdapterProvider({ children }: PropsWithChildren) {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
