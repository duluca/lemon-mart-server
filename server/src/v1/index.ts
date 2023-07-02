import { Router } from 'express'
import authRouter from './routes/authRouter'

const router = Router()

// Configure all v1 routers here
router.use('/auth', authRouter)

export default router
