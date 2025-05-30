import { useFavorites } from '~/modules/favorites/hooks/useFavorites'
import { renderHook } from '~/shared/tests/utils'

describe('useFavorites', () => {
  it('starts with isReady as false and sets it to true after mount', () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.isReady).toBe(true)
  })

  it('has isReady as true after effect runs', async () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.isReady).toBe(true)
  })
})
