import { Router } from 'express'

import api_v1 from './v1'

const api = Router()

// Configure all routes here
api.use('/v1', api_v1)

export default api
