import { useFavoriteStore } from '~/modules/favorites/store/favorite'
import { mockArtwork } from '~/shared/tests/mock'
import { act, renderHook } from '~/shared/tests/utils'

describe('useFavoriteStore', () => {
  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavoriteStore())

    expect(result.current.favorites).toEqual([])
  })

  it('adds a favorite', () => {
    const { result } = renderHook(() => useFavoriteStore())

    act(() => {
      result.current.addFavorite(mockArtwork)
    })

    expect(result.current.favorites).toContain(mockArtwork)
    expect(result.current.favorites).toHaveLength(1)
  })

  it('removes a favorite', () => {
    const { result } = renderHook(() => useFavoriteStore())

    act(() => {
      result.current.addFavorite(mockArtwork)
    })

    act(() => {
      result.current.removeFavorite(mockArtwork)
    })

    expect(result.current.favorites).not.toContain(mockArtwork)
    expect(result.current.favorites).toHaveLength(0)
  })

  it('checks if an artwork is a favorite', () => {
    const { result } = renderHook(() => useFavoriteStore())

    act(() => {
      result.current.addFavorite(mockArtwork)
    })

    expect(result.current.isFavorite(mockArtwork)).toBe(true)
    expect(result.current.isFavorite({ ...mockArtwork, objectID: 2 })).toBe(false)
  })
})
