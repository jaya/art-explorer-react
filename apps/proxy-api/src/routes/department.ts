import { MetService } from '@/services/met.service.js'
import { Hono } from 'hono'

const departmentRoutes = new Hono()

departmentRoutes.get('/', async c => {
  const response = await MetService.getDepartments()
  return c.json(response)
})

export default departmentRoutes
