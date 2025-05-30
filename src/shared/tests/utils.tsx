import { type RenderHookOptions, type RenderOptions, render, renderHook } from '@testing-library/react'
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

const customRenderHook = <Result, Props>(
  hook: (initialProps: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'>,
) => {
  return renderHook(hook, { wrapper: AllTheProviders, ...options })
}

export * from '@testing-library/react'
export { customRender as render, customRenderHook as renderHook }
