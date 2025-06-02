import { type RenderHookOptions, type RenderOptions, render, renderHook } from '@testing-library/react'
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing'
import type { ReactElement, ReactNode } from 'react'

import { QueryProvider } from '~/core/providers/QueryProvider'
import { ThemeProvider } from '~/core/providers/ThemeProvider'

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  )
}

const createWrapper = (nuqsOptions?: Parameters<typeof withNuqsTestingAdapter>[0]) => {
  if (!nuqsOptions) return AllTheProviders

  const NuqsWrapper = withNuqsTestingAdapter(nuqsOptions)

  return ({ children }: { children: ReactNode }) => (
    <NuqsWrapper>
      <AllTheProviders>{children}</AllTheProviders>
    </NuqsWrapper>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

const customRenderHook = <Result, Props>(
  hook: (initialProps: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'> & {
    nuqsOptions?: Parameters<typeof withNuqsTestingAdapter>[0]
  },
) => {
  const { nuqsOptions, ...hookOptions } = options || {}
  const wrapper = createWrapper(nuqsOptions)

  return renderHook(hook, { wrapper, ...hookOptions })
}

export * from '@testing-library/react'
export { customRender as render, customRenderHook as renderHook }
