import { useEffect, useState } from 'react'

export function useClient() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  return { isReady }
}
