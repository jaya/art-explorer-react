import { FAVORITES_KEY } from '@/constants/gallery.constant'
import { act, renderHook } from '@testing-library/react'
import { useFavorites } from '../use-favorites'

describe('useFavorites', () => {
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString()
      },
      clear: () => {
        store = {}
      },
      removeItem: (key: string) => {
        delete store[key]
      },
    }
  })()

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      configurable: true,
    })
  })

  afterEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
    expect(result.current.isFavorite(1)).toBe(false)
  })

  it('should load favorites from localStorage on mount', () => {
    const testFavorites = [1, 2, 3]
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(testFavorites))

    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual(testFavorites)
    expect(result.current.isFavorite(1)).toBe(true)
    expect(result.current.isFavorite(4)).toBe(false)
  })

  it('should add a favorite', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite(1)
    })

    expect(result.current.favorites).toEqual([1])
    expect(result.current.isFavorite(1)).toBe(true)
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')).toEqual([1])
  })

  it('should not add duplicate favorites', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite(1)
      result.current.addFavorite(1)
    })

    expect(result.current.favorites).toEqual([1])
    expect(result.current.isFavorite(1)).toBe(true)
  })

  it('should remove a favorite', () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2, 3]))
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.removeFavorite(2)
    })

    expect(result.current.favorites).toEqual([1, 3])
    expect(result.current.isFavorite(2)).toBe(false)
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')).toEqual([
      1, 3,
    ])
  })

  it('should handle removing non-existent favorite', () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([1, 2, 3]))
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.removeFavorite(4)
    })

    expect(result.current.favorites).toEqual([1, 2, 3])
  })
})
