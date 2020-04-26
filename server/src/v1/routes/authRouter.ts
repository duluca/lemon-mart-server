import { Request, Response, Router } from 'express'

import { UserCollection } from '../../models/user'
import {
  AuthenticationRequiredMessage,
  IncorrectEmailPasswordMessage,
  authenticate,
  createJwt,
} from '../../services/authService'

const router = Router()

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     description: |
 *       Generates a JWT, given correct credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200': # Response
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *               description: JWT token that contains userId as subject,
 *                              email and role as data payload.
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/login', async (req: Request, res: Response) => {
  const userEmail = req.body.email?.toLowerCase()
  const user = await UserCollection.findOne({ email: userEmail })

  if (user && (await user.comparePassword(req.body.password))) {
    return res.send({ accessToken: await createJwt(user) })
  }

  return res.status(401).send({ message: IncorrectEmailPasswordMessage })
})

/**
 * @swagger
 * /v1/auth/me:
 *   get:
 *     description: Gets the `User` object of the logged in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *        '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *        '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// tslint:disable-next-line: variable-name
router.get('/me', authenticate(), async (_req: Request, res: Response) => {
  if (res.locals.currentUser) {
    return res.send(res.locals.currentUser)
  }

  return res.status(401).send({ message: AuthenticationRequiredMessage })
})

export default router
