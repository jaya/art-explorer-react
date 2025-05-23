import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Artwork from './index'
import { vi, beforeEach } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import { makeArtwork } from '../../ __factories__/artwork'

vi.mock('../../services/metApi/queries', () => ({
  useGetObjectDetail: () => ({
    data: makeArtwork(),
  }),
}))

const toggleMock = vi.fn()
vi.mock('../../store/useFavoritesStore', () => ({
  useFavoritesStore: (selector: any) =>
    selector({
      isFavorite: () => false,
      toggle: toggleMock,
    }),
}))

beforeEach(() => {
  render(
    <I18nextProvider i18n={i18n}>
      <Artwork id={1} />
    </I18nextProvider>
  )
})

describe('Artwork', () => {
  it('renders artwork info and opens modal on click', async () => {
    expect(screen.getByText(/shoes/i)).toBeInTheDocument()
    expect(screen.getByText(/vincent van gogh/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/shoes/i))

    await waitFor(() => {
      expect(screen.getByText(/1888/)).toBeInTheDocument()
      expect(screen.getByText(/see more details/i)).toBeInTheDocument()
    })
  })

  it('calls toggle when clicking heart icon in card', () => {
    const heartButton = screen.getByTestId('favorite-button')

    fireEvent.click(heartButton!)
    expect(toggleMock).toHaveBeenCalledWith(1)
  })

  it('closes modal when clicking X', async () => {
    fireEvent.click(screen.getByText(/shoes/i))
    await waitFor(() => expect(screen.getByText(/1888/)).toBeInTheDocument())

    const closeButton = screen.getByTestId('close-modal')
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText(/1888/)).not.toBeInTheDocument()
    })
  })
})
