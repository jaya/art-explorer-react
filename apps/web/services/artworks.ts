import { ARTS_WITH_IMAGES, ARTWORKS } from '@/constants/met-museum.constant'
import type { Artwork } from '@/models/art'

export async function fetchArtwork(id: number) {
  const res = await fetch(`${ARTWORKS}/${id}`)
  if (!res.ok) throw new Error('Error to get the art')
  return (await res.json()) as unknown as Artwork
}

export async function fetchObjectIDs(): Promise<number[]> {
  const res = await fetch(ARTS_WITH_IMAGES)
  const data = await res.json()
  return data.objectIDs
}
