import { useTheme } from '~/shared/hooks/useTheme'
import { fireEvent, render, screen, waitFor } from '~/shared/tests/utils'
import { ThemeButton } from './ThemeButton'

vi.mock('~/shared/hooks/useTheme')
const mockUseTheme = vi.mocked(useTheme)

describe('ThemeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseTheme.mockReturnValue({ isReady: true, theme: 'light', setTheme: vi.fn() })
  })

  it('renders nothing when not ready', () => {
    mockUseTheme.mockReturnValue({ isReady: false, theme: 'light', setTheme: vi.fn() })

    render(<ThemeButton />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders the button with the correct theme', () => {
    render(<ThemeButton />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('data-theme', 'light')
  })

  it('changes the theme when clicked', () => {
    render(<ThemeButton />)

    fireEvent.click(screen.getByRole('button'))

    waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('data-theme', 'dark')
    })
  })
})
