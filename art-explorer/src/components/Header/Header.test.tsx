import { render, screen, fireEvent } from '@testing-library/react'
import Header from './index'
import { vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'

const toggleMock = vi.fn()
vi.mock('../../hooks/useDarkMode', () => ({
  useDarkMode: () => [false, toggleMock]
}))

function renderHeader() {
  return render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </I18nextProvider>
  )
}

describe('Header', () => {
  it('should render the app name', () => {
    renderHeader()
    expect(screen.getByText(/art explorer/i)).toBeInTheDocument()
  })

  it('should render the Search and Favorites tabs', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /favorites/i })).toBeInTheDocument()
  })

  it('should render the dark mode toggle button', () => {
    renderHeader()
    const button = screen.getByRole('button', { name: /toggle dark mode/i })
    expect(button).toBeInTheDocument()
  })

  it('should call toggle function when dark mode button is clicked', () => {
    renderHeader()
    const button = screen.getByRole('button', { name: /toggle dark mode/i })
    fireEvent.click(button)
    expect(toggleMock).toHaveBeenCalledTimes(1)
  })
})
