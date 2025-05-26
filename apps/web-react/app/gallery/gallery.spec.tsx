import { ArtworkService } from '@/services/artworks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Gallery } from './gallery'

jest.mock('@/services/artworks', () => ({
  ArtworkService: {
    getById: jest.fn(),
  },
}))

// Mock global IntersectionObserver
beforeAll(() => {
  class IntersectionObserverMock {
    observe = jest.fn()
    disconnect = jest.fn()
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  })
})

// Helper render with react-query provider
const renderWithQuery = (ui: React.ReactNode) => {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('Gallery component', () => {
  const mockObjectIds = [1, 2, 3]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading state initially', async () => {
    renderWithQuery(<Gallery objectIds={mockObjectIds} />)
    expect(screen.getByText(/loading gallery/i)).toBeInTheDocument()
  })

  it('should show error state', async () => {
    const queryClient = new QueryClient()
    jest
      .spyOn(queryClient, 'getQueryData')
      .mockReturnValue(undefined)

    // Force fetch to fail
    ;(ArtworkService.getById as jest.Mock).mockRejectedValue(
      new Error('Fetch error')
    )

    render(
      <QueryClientProvider client={queryClient}>
        <Gallery objectIds={mockObjectIds} />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(
        screen.getByText(/No artworks founds in this search./i)
      ).toBeInTheDocument()
    })
  })

  it('should render artworks and load more button', async () => {
    ;(ArtworkService.getById as jest.Mock).mockImplementation(id =>
      Promise.resolve({
        objectID: id,
        primaryImageSmall: `url-${id}`,
        title: `Artwork ${id}`,
      })
    )

    renderWithQuery(<Gallery objectIds={Array.from({ length: 18 })} />)

    await waitFor(() => {
      expect(screen.getByText(/load more/i)).toBeInTheDocument()
    })

    // Should render ArtworkCards
    expect(screen.getAllByText(/Artwork/i)).toHaveLength(15)
  })

  it('should call fetchNextPage when Load more button is clicked', async () => {
    ;(ArtworkService.getById as jest.Mock).mockImplementation(id =>
      Promise.resolve({
        objectID: id,
        primaryImageSmall: `url-${id}`,
        title: `Artwork ${id}`,
      })
    )

    renderWithQuery(<Gallery objectIds={Array.from({ length: 18 })} />)

    const loadMoreButton = await screen.findByText(/load more/i)

    fireEvent.click(loadMoreButton)

    // After clicking, the loading indicator should show up
    await waitFor(() => {
      expect(screen.getByText(/No more artworks./i)).toBeInTheDocument()
    })
  })

  it('should show "No artworks found" if none are returned', async () => {
    ;(ArtworkService.getById as jest.Mock).mockImplementation(() =>
      Promise.resolve(null)
    )

    renderWithQuery(<Gallery objectIds={[999]} />)

    await waitFor(() => {
      expect(
        screen.getByText(/no artworks founds in this search/i)
      ).toBeInTheDocument()
    })
  })
})
