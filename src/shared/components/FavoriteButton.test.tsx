import { toast } from 'sonner'

import { useFavoriteStore } from '~/modules/favorites/store/favorite'
import { useClient } from '~/shared/hooks/useClient'
import { fireEvent, render, screen } from '~/shared/tests/utils'
import { FavoriteButton } from './FavoriteButton'

vi.mock('sonner')
vi.mock('~/modules/favorites/store/favorite')
vi.mock('~/shared/hooks/useClient')

const mockArtwork = {
  objectID: 1,
  objectURL: 'https://test.com',
  title: 'Test Artwork',
  primaryImage: 'https://test.com',
  primaryImageSmall: 'test-image',
  artistDisplayName: 'Test Artist',
  objectDate: '2023',
  medium: 'Test Medium',
  department: 'Test Department',
}

const mockUseFavoriteStore = vi.mocked(useFavoriteStore)
const mockUseClient = vi.mocked(useClient)
const mockToast = vi.mocked(toast)

describe('FavoriteButton', () => {
  const mockIsFavorite = vi.fn()
  const mockAddFavorite = vi.fn()
  const mockRemoveFavorite = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseClient.mockReturnValue({ isReady: true })

    mockUseFavoriteStore.mockImplementation((selector) => {
      const state = {
        favorites: [],
        isFavorite: mockIsFavorite,
        addFavorite: mockAddFavorite,
        removeFavorite: mockRemoveFavorite,
      }
      return selector(state)
    })
  })

  it('renders nothing when not ready', () => {
    mockUseClient.mockReturnValue({ isReady: false })

    render(<FavoriteButton artwork={mockArtwork} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders add to favorites button when artwork is not favorite', () => {
    mockIsFavorite.mockReturnValue(false)

    render(<FavoriteButton artwork={mockArtwork} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Add to favorites')).toBeInTheDocument()
  })

  it('renders remove from favorites button when artwork is favorite', () => {
    mockIsFavorite.mockReturnValue(true)

    render(<FavoriteButton artwork={mockArtwork} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Remove from favorites')).toBeInTheDocument()
  })

  it('adds artwork to favorites when clicked the button', () => {
    mockIsFavorite.mockReturnValue(false)

    render(<FavoriteButton artwork={mockArtwork} />)

    fireEvent.click(screen.getByRole('button'))

    expect(mockAddFavorite).toHaveBeenCalledWith(mockArtwork)
    expect(mockToast.success).toHaveBeenCalledWith('Artwork added to favorites!')
  })

  it('removes artwork from favorites when clicked and is favorite', () => {
    mockIsFavorite.mockReturnValue(true)

    render(<FavoriteButton artwork={mockArtwork} />)

    fireEvent.click(screen.getByRole('button'))

    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockArtwork)
    expect(mockToast.warning).toHaveBeenCalledWith('Artwork removed from favorites')
  })
})
