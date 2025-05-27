import artworkRoutes from '@/routes/artwork.js'
import departmentRoutes from '@/routes/department.js'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()
app.use('*', logger())
app.use(
  '*',
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? (process.env.ORIGIN_URL ?? '')
        : 'http://localhost:5173',
  })
)
app.get('/health', c => {
  return c.text('OK')
})

app.route('/artworks', artworkRoutes)
app.route('/departments', departmentRoutes)

serve(
  {
    fetch: app.fetch,
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  },
  info => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
