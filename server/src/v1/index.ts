import { Router } from 'express'

import authRouter from './routes/authRouter'

const router = Router()

/*
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ServerMessage"
 *   schemas:
 *     ServerMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

// Configure all v1 routers here
router.use('/auth', authRouter)

export default router
