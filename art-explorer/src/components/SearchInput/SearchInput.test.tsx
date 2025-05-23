import { render, screen, fireEvent } from '@testing-library/react'
import SearchInput from './index'
import { vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'

const setQueryMock = vi.fn()

vi.mock('../../store/useSearchStore', () => ({
  useSearchStore: (selector: any) =>
    selector({
      query: '',
      setQuery: setQueryMock,
    }),
}))

describe('SearchInput', () => {
  it('renders the input with placeholder and updates on change', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SearchInput />
      </I18nextProvider>
    )

    const input = screen.getByPlaceholderText(/type your search/i)
    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'van' } })
    expect(setQueryMock).toHaveBeenCalledWith('van')
  })
})
