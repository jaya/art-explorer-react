import { usePathname } from 'next/navigation'

import { render, screen } from '~/shared/tests/utils'
import { Header } from './Header'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}))

const mockUsePathname = vi.mocked(usePathname)

describe('Header', () => {
  it('renders the header', () => {
    mockUsePathname.mockReturnValue('/')

    render(<Header />)

    expect(screen.getByRole('heading', { name: 'Art Explorer' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Favorites' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Search' })).toBeInTheDocument()
  })

  it('highlights the active link based on pathname', () => {
    mockUsePathname.mockReturnValue('/favorites')

    render(<Header />)

    const favoritesLink = screen.getByRole('link', { name: 'Favorites' })
    const searchLink = screen.getByRole('link', { name: 'Search' })

    expect(favoritesLink).toHaveClass('bg-white')
    expect(searchLink).not.toHaveClass('bg-white')
  })
})
