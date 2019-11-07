import { Router } from 'express'

import api_v2 from './v2'

const api = Router()

// Configure all routes here
api.use('/v2', api_v2)

export default api
