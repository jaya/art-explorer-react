import { render, screen, fireEvent } from '@testing-library/react'
import SearchModeToggle from './index'
import { vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'

const setModeMock = vi.fn()

vi.mock('../../store/useSearchStore', () => ({
  useSearchStore: (selector: any) =>
    selector({
      mode: 'object',
      setMode: setModeMock,
    }),
}))

describe('SearchModeToggle', () => {
  it('renders both toggle options', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SearchModeToggle />
      </I18nextProvider>
    )

    expect(screen.getByRole('button', { name: /artwork/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /artist/i })).toBeInTheDocument()
  })

  it('calls setMode when button is clicked', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SearchModeToggle />
      </I18nextProvider>
    )

    const objectButton = screen.getByRole('button', { name: /artwork/i })
    fireEvent.click(objectButton)
    expect(setModeMock).toHaveBeenCalledWith('object')
  })
})
