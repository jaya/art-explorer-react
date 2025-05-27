import { MetService } from '@/services/met.service.js'
import type { ArtworkItem } from '@art-explorer/core'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const artworkRoutes = new Hono()

const artworksQueriesSchema = z.object({
  query: z.string().trim().min(3, 'Minimum 3 characters').optional(),
  departmentId: z.coerce.number().min(1).optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(15).optional(),
})

const idParamsSchema = z.object({
  id: z.coerce.number(),
})

artworkRoutes.get('/', zValidator('query', artworksQueriesSchema), async c => {
  const { query, departmentId, page, limit } = c.req.valid('query')

  const response = await MetService.search(query, departmentId, page, limit)

  if (response.objectIDs.length === 0) {
    return c.text('No artworks found', 404)
  }

  const artworks: ArtworkItem[] = []
  const promises = []

  for (const id of response.objectIDs) {
    try {
      promises.push(
        MetService.getById(id).then(art => {
          if (art) artworks.push(MetService.mapToListItem(art))
        })
      )
    } catch (e) {
      console.error(`Error to get artwork ${id}:`, e)
    }
  }

  await Promise.all(promises)
  return c.json({
    artworks,
    hasMore: response.hasMore,
  })
})

artworkRoutes.get('/:id', zValidator('param', idParamsSchema), async c => {
  const { id } = c.req.valid('param')
  const art = await MetService.getById(id)
  if (!art) return c.text('Artwork not found', 404)

  return c.json({
    artwork: art,
  })
})

export default artworkRoutes
