import artworkRoutes from '@/routes/artwork.js'
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
        ? 'https://art-explorer-react-web-react.vercel.app/'
        : 'http://localhost:5173',
  })
)
app.get('/health', c => {
  return c.text('OK')
})

app.route('/artworks', artworkRoutes)

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  info => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
