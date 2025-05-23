import { render, screen } from '@testing-library/react'
import Tabs from './index'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import { MemoryRouter } from 'react-router-dom'

describe('Tabs', () => {
  it('renders Search and Favorites links', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Tabs />
        </MemoryRouter>
      </I18nextProvider>
    )

    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /favorites/i })).toBeInTheDocument()
  })
})
