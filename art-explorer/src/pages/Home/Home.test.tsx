import { render, screen, waitFor } from '@testing-library/react'
import Home from './index'
import { vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { makeArtwork } from '../../ __factories__/artwork'

const queryClient = new QueryClient()

vi.mock('../../store/useSearchStore', () => {
  const state = {
    query: '',
    mode: 'object',
    departmentId: null,
    setQuery: vi.fn(),
    setMode: vi.fn(),
    setDepartmentId: vi.fn(),
  }
  return {
    useSearchStore: (selector: any) => selector(state),
  }
})

vi.mock('../../services/metApi/queries', () => ({
  useGetDepartments: () => ({
    data: {
      departments: [
        { departmentId: 1, displayName: 'Paintings' },
        { departmentId: 2, displayName: 'Sculpture' },
      ]
    }
  }),
  usePaginatedArtworks: () => ({
    data: {
      pages: [[1, 2]],
    },
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
  }),
  useGetObjectDetail: (id: number) => ({
    data: makeArtwork({
      objectID: id,
      title: `Artwork ${id}`,
      artistDisplayName: `Artist ${id}`
    }),
    isLoading: false,
  })
}))

describe('Home page integration', () => {
  it('renders select toggle, select department, search input and artwork list', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Home />
        </I18nextProvider>
      </QueryClientProvider>
    )

    expect(screen.getByText(/search by/i)).toBeInTheDocument()
    expect(screen.getByText(/select a department/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/type your search/i)).toBeInTheDocument()
    expect(screen.getByText(/search by/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/artwork 1/i)).toBeInTheDocument()
      expect(screen.getByText(/artist 1/i)).toBeInTheDocument()
      expect(screen.getByText(/artwork 2/i)).toBeInTheDocument()
      expect(screen.getByText(/artist 2/i)).toBeInTheDocument()
    })
  })
})
