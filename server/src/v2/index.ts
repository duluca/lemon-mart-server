import { Router } from 'express'

import userRouter from './routes/userRouter'

const router = Router()

// Configure all v2 routers here
router.use('/users?', userRouter)

export default router
