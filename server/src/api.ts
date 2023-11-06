import { Router } from 'express'
import api_v1 from './v1'
import api_v2 from './v2'

const api = Router()

api.use('/v2', api_v2)
api.use('/v1', api_v1)

export default api
