import { type RenderOptions, render } from '@testing-library/react'
import type { ReactElement } from 'react'

import { QueryProvider } from '~/core/providers/QueryProvider'
import { ThemeProvider } from '~/core/providers/ThemeProvider'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

export * from '@testing-library/react'
export { customRender as render }
