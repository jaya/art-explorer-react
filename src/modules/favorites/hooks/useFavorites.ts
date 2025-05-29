import { useEffect, useState } from 'react'

export function useFavorites() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  return { isReady }
}
