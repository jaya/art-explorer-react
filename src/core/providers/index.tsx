import type { PropsWithChildren } from 'react'

import { NuqsAdapterProvider } from '~/core/providers/NuqsAdapter'
import { QueryProvider } from '~/core/providers/QueryProvider'
import { ThemeProvider } from '~/core/providers/ThemeProvider'

export function Providers({ children }: PropsWithChildren) {
  return (
    <NuqsAdapterProvider>
      <QueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryProvider>
    </NuqsAdapterProvider>
  )
}
